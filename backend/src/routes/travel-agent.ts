import { Application, Request, Response } from 'express';
import { utilsService } from '../lib/utils.service';
import { TravelAgent, Secretariat } from '../models';
import { accountsDb } from '../lib/connectors/db/accounts-db';

import { travelAgentGetService } from '../lib/travel-agents.service';



export class TravelAgentManagementRoutes {


    public routes(app: Application) {



        // create new travel agent
        app.route('/api/travel-agents/new')
            .post(utilsService.checkAuthSecretary, async (req: Request, res: Response) => {

                const secretary = new Secretariat(req.session.secretary);
                return secretary.register_travel_agent({ new_travel_agent: req.body.travel_agent }, req, res);

            });



        // get all travel agents
        app.route('/api/travel-agents')
            .get(utilsService.checkAuthSecretary, async (req: Request, res: Response) => {

                const travel_agents: TravelAgent[] = [];


                try {

                    const result = await accountsDb.query(`SELECT * FROM travel_agents`);

                    for (const row of result.rows)
                        travel_agents.push(new TravelAgent({
                            ...row,
                            place_of_residence: {
                                street: row['place_of_residence.street'],
                                city: row['place_of_residence.city'],
                                postal_code: row['place_of_residence.postal_code'],
                                state: row['place_of_residence.state'],
                                country: row['place_of_residence.country'],
                                longitude: row['place_of_residence.longitude'],
                                latitude: row['place_of_residence.latitude'],
                            },
                            office_details: {
                                email: row['office_details.email'],
                                phone: row['office_details.phone']
                            }
                        }));


                    return res.status(200).send(travel_agents);

                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // specific travel agent
        app.route('/api/travel-agents/t/:account_id')
            .get(async (req: Request, res: Response) => {

                const account_id = req.params.account_id.toString();


                try {

                    const travel_agent = new TravelAgent(await travelAgentGetService.getTravelAgent(account_id));
                    return res.status(200).send(travel_agent);

                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .put(utilsService.checkAuth, async (req: Request, res: Response) => {

                const account_id = req.params.account_id.toString();

                if (account_id !== req.session.user.account_id && req.session.user.account_type !== 'secretariat')
                    return utilsService.systemErrorHandler({ code: 401, type: 'unauthorized_for_this_action' }, res);


                let travel_agent: TravelAgent;
                if (account_id !== req.session.user.account_id)
                    travel_agent = new TravelAgent(req.session.travel_agent);
                else
                    travel_agent = new TravelAgent(await travelAgentGetService.getTravelAgent(account_id));



                // update travel agent
                try {
                    await travel_agent.update_travel_agent();
                    return res.status(200).send({ code: 200, type: 'travel_agent_updated' });
                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utilsService.checkAuth, async (req: Request, res: Response) => {

                const account_id = req.params.account_id.toString();

                if (account_id !== req.session.user.account_id && req.session.user.account_type !== 'secretariat')
                    return utilsService.systemErrorHandler({ code: 401, type: 'unauthorized_for_this_action' }, res);


                let travel_agent: TravelAgent;
                if (account_id !== req.session.user.account_id)
                    travel_agent = new TravelAgent(req.session.travel_agent);
                else
                    travel_agent = new TravelAgent(await travelAgentGetService.getTravelAgent(account_id));




                // delete travel agent
                try {
                    await travel_agent.delete_travel_agent();
                    return res.status(200).send({ code: 200, type: 'travel_agent_deleted' });
                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



    }


}
