import { Application, Request, Response } from 'express';



export class IndexRoutes {

    public routes(app: Application): void {


        app.route('/')
            .get(async (req: Request, res: Response) => {

                if (req?.session?.user?.account_id)
                    return res.status(200).send({
                        message: 'You are successfully authenticated to use the system!',
                        user: req.session.user
                    });

                return res.status(200).send({
                    message: 'Hi, you are unauthorized to have access in this system!',
                });

            });


    }

}
