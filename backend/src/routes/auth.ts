import { Application, Request, Response } from 'express';
import * as passport from 'passport';

import { utilsService } from '../lib/utils.service';
import { Account, Secretariat } from '../models';

import { accountsDb } from '../lib/connectors/db/accounts-db';


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

                                return res.status(200).send({
                                    user: req.session.user,
                                    travel_agent_data: null
                                });

                            } else if (req.session.user.account_type === 'customer') {

                                return res.status(200).send({
                                    user: req.session.user,
                                    travel_agent_data: null
                                });

                            } else {

                                return res.status(200).send({
                                    user: req.session.user,
                                });

                            }



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


                const registration_data: Account = new Account(req.body);


                // check if the data arrived
                if (!registration_data?.first_name || !registration_data?.last_name || !registration_data?.username || !registration_data?.email
                    || !registration_data?.phone || !registration_data?.password || !registration_data?.account_type)
                    return utilsService.systemErrorHandler({ code: 400, type: 'bad_request', message: 'Credentials to register the user are missing' }, res)



                // check if the user exists
                try {

                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });






        // logout from session
        app.route('/api/auth/logout')
            .post(utilsService.checkAuth, async (req: Request, res: Response) => {

                try {

                    req.session.destroy(async (err) => {
                        if (err)
                            return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: err.message }, res);
                        else
                            return res.status(200).send({ code: 200, status: '200 OK', message: 'Logout OK' });
                    });

                } catch (error) {
                    return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error.message }, res);
                }

            });



    }


}
