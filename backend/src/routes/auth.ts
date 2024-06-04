import { Application, Request, Response } from 'express';
import * as passport from 'passport';
import { config } from '../config';

import { utilsService } from '../lib/utils.service';
import { Account, Secretariat, Customer } from '../models';

import { accountsDb } from '../lib/connectors/db/accounts-db';

import { userExistsService } from '../lib/user.service';
import { registrationService } from '../lib/registration.service';


export class AuthRoutes {


    public routes(app: Application): void {



        // local login
        app.route('/api/auth/login')
            .post(async (req: Request, res: Response) => {
                passport.authenticate('local', async (error: any, user: Account, options) => {

                    if (!options?.message) {

                        if (user?.account_id) {
                            req.session.user = user;
                            req.session.created_at = utilsService.moment().toDate();


                            if (req.session.user.account_type === 'secretariat') {

                                const secretariat_data = await accountsDb.query(`SELECT * FROM secretariat WHERE account_id = :account_id;`, { account_id: req.session.user.account_id });
                                if (secretariat_data.rowsCount === 0)
                                    return res.status(200).send({ user: req.session.user });

                                return res.status(200).send({
                                    user: req.session.user,
                                    secretariat_data: new Secretariat(secretariat_data.rows[0]),
                                });

                            } else if (req.session.user.account_type === 'travel_agent') {

                                const travel_agents_data = await accountsDb.query(`SELECT * FROM travel_agents WHERE account_id = :account_id;`, { account_id: req.session.user.account_id });
                                if (travel_agents_data.rowsCount === 0)
                                    return res.status(200).send({ user: req.session.user });

                                return res.status(200).send({
                                    user: req.session.user,
                                    travel_agent_data: null
                                });

                            } else if (req.session.user.account_type === 'customer') {

                                const customers_data = await accountsDb.query(`SELECT * FROM customers WHERE account_id = :account_id;`, { account_id: req.session.user.account_id });
                                if (customers_data.rowsCount === 0)
                                    return res.status(200).send({ user: req.session.user });

                                return res.status(200).send({
                                    user: req.session.user,
                                    travel_agent_data: null
                                });

                            } else
                                return res.status(200).send({
                                    user: req.session.user,
                                });



                        }

                        return await utilsService.systemErrorHandler({
                            code: 404,
                            type: 'user_not_found',
                            message: 'User doesn\'t exist yet'
                        }, res);

                    }






                    const message_code: number = Number(options.message);


                    if (message_code === 403)
                        return await utilsService.systemErrorHandler({
                            code: 403,
                            type: 'missing_credentials',
                            message: 'Username or password is missing'
                        }, res);
                    else if (message_code === 404)
                        return await utilsService.systemErrorHandler({
                            code: 404,
                            type: 'user_not_found',
                            message: 'User doesn\'t exist yet'
                        }, res);
                    else if (message_code === 401)
                        return await utilsService.systemErrorHandler({
                            code: 401,
                            type: 'user_not_activated',
                            message: 'User is not activated'
                        }, res);
                    else if (message_code === 400)
                        return await utilsService.systemErrorHandler({
                            code: 400,
                            type: 'wrong_password',
                            message: 'Wrong password'
                        }, res);

                })(req, res);

            });





        // register new user - here you can register ONLY customers
        app.route('/api/auth/register-customer')
            .post(async (req: Request, res: Response) => {


                try {

                    const new_customer = new Customer();

                    return new_customer.register(req, res);

                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }


            });






        // logout from session
        app.route('/api/auth/logout')
            .post(utilsService.checkAuth, async (req: Request, res: Response) => {

                if (req.session.user.account_type === 'customer') {

                    const customer = new Customer();

                    try {
                        return customer.log_out(req, res);
                    } catch (error) {
                        return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                    }

                } else if (req.session.user.account_type === 'secretariat') {

                    const secretary = new Secretariat();

                    try {
                        return secretary.log_out(req, res);
                    } catch (error) {
                        return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                    }

                }



                // TODO: implement logout for other account types
            });



    }


}
