import { Application, Request, Response } from 'express';
import { config } from '../config';

import { utilsService } from '../lib/utils.service';
import { Customer, PlanBooking, Secretariat, TravelAgent, TravelPlan } from '../models';

import { accountsDb } from '../lib/connectors/db/accounts-db';





export class BookingsRoutes {


    public routes(app: Application) {


        app.route('/api/bookings/new')
            .post(async (req: Request, res: Response) => {


                const booking_data = new PlanBooking(req.body.booking);
                booking_data.booking_id = utilsService.generateId({ alphabet: config.nanoid_basic_alphabet, length: config.booking_id_length });


                try {


                    if (booking_data?.secretary_id) {
                        const secretary = new Secretariat();
                        return res.status(200).send(await secretary.bookPlan(booking_data, req?.session?.user || req?.body?.user));
                    } else if (booking_data?.travel_agent_id) {
                        const travel_agent = new TravelAgent();
                        return res.status(200).send(await travel_agent.bookPlan(booking_data, req?.session?.user || req?.body?.user));
                    } else if (booking_data?.customer_id) {
                        const customer = new Customer();
                        return res.status(200).send(await customer.bookPlan(booking_data, req?.session?.user || req?.body?.user));
                    }



                    throw new Error();


                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        app.route('/api/booking/new-for-customer')
            .post(utilsService.checkAuthSecretary, async (req: Request, res: Response) => {

                const booking_data = new PlanBooking(req.body);
                booking_data.booking_id = utilsService.generateId({ alphabet: config.nanoid_basic_alphabet, length: config.booking_id_length });


                const secretary = new Secretariat(req.session.secretary);


                try {


                    return res.status(200).send(await secretary.bookPlanForCustomer(booking_data));


                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }


}
