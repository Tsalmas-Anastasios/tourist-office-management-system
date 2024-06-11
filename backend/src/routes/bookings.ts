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
            .post(async (req: Request, res: Response) => {

                const booking_data = new PlanBooking(req.body.booking);
                booking_data.booking_id = utilsService.generateId({ alphabet: config.nanoid_basic_alphabet, length: config.booking_id_length });


                const secretary = new Secretariat(req?.session?.secretary || req?.body?.secretary || null);


                try {


                    return res.status(200).send(await secretary.bookPlanForCustomer(booking_data));


                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });





        // get bookings per plan
        app.route('/api/bookings/pl/:plan_id')
            .get(async (req: Request, res: Response) => {

                const bookings: PlanBooking[] = [];
                const plan_id = req.params.plan_id.toString();

                try {

                    const result = await accountsDb.query(`
                        SELECT
                            bookings.*,
                            CASE
                                WHEN bookings.customer_id IS NOT NULL THEN customers.first_name
                                WHEN bookings.travel_agent_id IS NOT NULL THEN travel_agents.first_name
                                ELSE secretariat.first_name
                            END AS first_name,
                            CASE
                                WHEN bookings.customer_id IS NOT NULL THEN customers.last_name
                                WHEN bookings.travel_agent_id IS NOT NULL THEN travel_agents.last_name
                                ELSE secretariat.last_name
                            END AS last_name,
                            CASE
                                WHEN bookings.customer_id IS NOT NULL THEN customers.email
                                WHEN bookings.travel_agent_id IS NOT NULL THEN travel_agents.email
                                ELSE secretariat.email
                            END AS email,
                            CASE
                                WHEN bookings.customer_id IS NOT NULL THEN customers.phone
                                WHEN bookings.travel_agent_id IS NOT NULL THEN travel_agents.phone
                                ELSE secretariat.phone
                            END AS phone
                        FROM bookings
                        LEFT JOIN customers ON bookings.customer_id = customers.customer_id
                        LEFT JOIN travel_agents ON bookings.travel_agent_id = travel_agents.travel_agent_id
                        LEFT JOIN secretariat ON bookings.secretary_id = secretariat.secretariat_id;
                    `);



                    for (const row of result.rows) {

                        const booking = new PlanBooking(row);


                        if (booking?.customer_id)
                            booking.main_customer = new Customer({
                                first_name: row['first_name'],
                                last_name: row['last_name'],
                                email: row['email'],
                                phone: row['phone']
                            });
                        else if (booking?.travel_agent_id) {
                            booking.travel_agent = new TravelAgent();
                            booking.travel_agent.first_name = row['first_name'];
                            booking.travel_agent.last_name = row['last_name'];
                            booking.travel_agent.email = row['email'];
                            booking.travel_agent.phone = row['phone'];
                        } else {
                            booking.secretary = new Secretariat();
                            booking.secretary.first_name = row['first_name'];
                            booking.secretary.last_name = row['last_name'];
                            booking.secretary.email = row['email'];
                            booking.secretary.phone = row['phone'];
                        }


                        bookings.push(booking);

                    }




                    return res.status(200).send(bookings);

                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }


}
