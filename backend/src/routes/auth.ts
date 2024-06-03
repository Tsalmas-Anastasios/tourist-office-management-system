import { Application, Request, Response } from 'express';
import * as passport from 'passport';

import { utilsService } from '../lib/utils.service';
import { Account } from '../models';


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


                            return res.status(200).send(req.session.user);
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



    }


}
