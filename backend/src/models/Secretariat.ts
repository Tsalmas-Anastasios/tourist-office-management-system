import { Application, Request, Response } from 'express';

import { utilsService } from '../lib/utils.service';



export class Secretariat {

    account_id?: string;
    secretariat_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth?: string | Date;

    id_number?: string;
    id_type?: 'id_card' | 'passport';

    place_of_residence?: {
        street?: string;
        city?: string;
        postal_code?: string;
        state?: string;
        country?: string;
        longitude?: number;
        latitude?: number;
    };

    start_date?: string | Date;
    still_working?: boolean;

    office_hours?: {
        start_time: string;
        end_time: string;
    };

    office_details?: {
        email?: string;
        phone?: string;
    };

    updated_at?: string | Date;
    created_at?: string | Date;

    constructor(props?: Secretariat) {

        this.account_id = props?.account_id || null;
        this.secretariat_id = props?.secretariat_id || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.email = props?.email || null;
        this.phone = props?.phone || null;
        this.date_of_birth = props?.date_of_birth || null;
        this.id_number = props?.id_number || null;
        this.id_type = props?.id_type || null;

        this.place_of_residence = props?.place_of_residence || null;

        this.start_date = props?.start_date || null;
        this.still_working = props?.still_working ? true : false;

        this.office_details = props?.office_details || null;

        this.office_hours = props?.office_hours || null;

        this.updated_at = props?.updated_at || null;
        this.created_at = props?.created_at || null;

    }





    public log_out(req: Request, res: Response): Promise<any> {

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

    }

}
