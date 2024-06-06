import { Application, Request, Response } from 'express';
import { config } from '../config';

import { utilsService } from '../lib/utils.service';
import { Secretariat, TravelAgent, TravelPlan } from '../models';

import { accountsDb } from '../lib/connectors/db/accounts-db';

import { createNewPlan } from '../lib/manage-plan.service';



export class PlansRoutes {


    public routes(app: Application) {



        app.route('/api/plans')
            .get(async (req: Request, res: Response) => {

                // TODO: implement me

            });





        // add a new plan
        app.route('/api/plans/new')
            .post(utilsService.checkAuth, async (req: Request, res: Response) => {

                const new_plan = new TravelPlan(req.body);


                if (req.session.user.account_type === 'secretariat') {

                    const secretary = new Secretariat(req.session.secretary);
                    await secretary.createNewPLan(new_plan, res);

                } else if (req.session.user.account_type === 'travel_agent') {

                    const travel_agent = new TravelAgent(req.session.travel_agent);
                    await travel_agent.createNewPLan(new_plan, res);

                }



                return utilsService.systemErrorHandler({
                    code: 500,
                    type: 'wrong_action'
                }, res);

            });




        // specific plan
        app.route('/api/plans/p/:plan_id')
            .get(async (req: Request, res: Response) => {
                // TODO: implement me
            })
            .put(utilsService.checkAuth, async (req: Request, res: Response) => {

                const existing_plan = new TravelPlan(req.body);
                existing_plan.plan_id = req.params.plan_id.toString();



                if (req.session.user.account_type === 'secretariat') {

                    const secretary = new Secretariat(req.session.secretary);
                    await secretary.updateExistingPlan(existing_plan, res);

                } else if (req.session.user.account_type === 'travel_agent') {

                    const travel_agent = new TravelAgent(req.session.travel_agent);
                    await travel_agent.updateExistingPlan(existing_plan, res);

                }



                return utilsService.systemErrorHandler({
                    code: 500,
                    type: 'wrong_action'
                }, res);


            })
            .delete(utilsService.checkAuth, async (req: Request, res: Response) => {

                const plan_id = req.params.plan_id.toString();



                if (req.session.user.account_type === 'secretariat') {

                    const secretary = new Secretariat(req.session.secretary);
                    await secretary.deleteExistingPlan(plan_id, res);

                } else if (req.session.user.account_type === 'travel_agent') {

                    const travel_agent = new TravelAgent(req.session.travel_agent);
                    await travel_agent.deleteExistingPlan(plan_id, res);

                }



                return utilsService.systemErrorHandler({
                    code: 500,
                    type: 'wrong_action'
                }, res);

            });



    }


}
