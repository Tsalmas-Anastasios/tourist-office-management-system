import { Application, Request, Response } from 'express';
import { config } from '../config';

import { utilsService } from '../lib/utils.service';
import { TravelPlan } from '../models';

import { accountsDb } from '../lib/connectors/db/accounts-db';



export class PlansRoutes {


    public routes(app: Application) {



        app.route('/api/plans')
            .get(async (req: Request, res: Response) => {



            });





        // add a new plan
        app.route('/api/plans/new')
            .post(utilsService.checkAuth, async (req: Request, res: Response) => {

                const new_plan = new TravelPlan(req.body);



                if (!new_plan?.title || !new_plan?.title_internal || !new_plan?.price || !new_plan?.category
                    || !new_plan?.small_description || !new_plan?.description || !new_plan?.date_range
                    || !new_plan?.start_date || !new_plan?.end_date || !new_plan?.starting_type || !new_plan?.means_of_transport_arrival
                    || !new_plan?.means_of_transport_return || !new_plan?.place_id || !new_plan?.accommodation_id)
                    return utilsService.systemErrorHandler({ code: 400, type: 'bad_request', message: 'Data to create the plan are missing' }, res);




                try {

                    new_plan.plan_id = utilsService.generateId({ alphabet: config.nanoid_basic_alphabet, length: config.plan_id_length });
                    const insertion_result = await accountsDb.query(`
                        INSERT INTO
                            plans
                        SET
                            
                    `);



                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }


            });



    }


}
