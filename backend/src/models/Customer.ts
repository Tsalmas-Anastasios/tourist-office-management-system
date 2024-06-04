import { Application, Request, Response } from 'express';
import { Account } from './Account';

import { config } from '../config';

import { utilsService } from '../lib/utils.service';

import { accountsDb } from '../lib/connectors/db/accounts-db';

import { userExistsService } from '../lib/user.service';
import { registrationService } from '../lib/registration.service';




export class Customer {

    account_id?: string;
    customer_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    age?: number;
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


    // plans_history?: plans[]

    updated_at?: string | Date;
    created_at?: string | Date;


    constructor(props?: Customer) {

        this.account_id = props?.account_id || null;
        this.customer_id = props?.customer_id || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.email = props?.email || null;
        this.phone = props?.phone || null;
        this.age = props?.age || null;
        this.date_of_birth = props?.date_of_birth || null;
        this.id_number = props?.id_number || null;
        this.id_type = props?.id_type || null;

        this.place_of_residence = props?.place_of_residence || null;

        this.updated_at = props?.updated_at || null;
        this.created_at = props?.created_at || null;

    }






    public async register(req: Request, res: Response): Promise<any> {


        const registration_data: Account = new Account(req.body.customer);


        // check if the data arrived
        if (!registration_data?.first_name || !registration_data?.last_name || !registration_data?.username || !registration_data?.email
            || !registration_data?.phone || !registration_data?.password)
            return utilsService.systemErrorHandler({ code: 400, type: 'bad_request', message: 'Credentials to register the user are missing' }, res);



        // check if the user exists
        try {

            if (await userExistsService.userExists({ username: registration_data.username }))
                return utilsService.systemErrorHandler({ code: 401, type: 'username_exists', message: 'Username already exists' }, res);

            if (await userExistsService.userExists({ email: registration_data.email }))
                return utilsService.systemErrorHandler({ code: 401, type: 'email_exists', message: 'Email already exists' }, res);

            if (await userExistsService.userExists({ phone: registration_data.phone }))
                return utilsService.systemErrorHandler({ code: 401, type: 'phone_exists', message: 'Phone already exists' }, res);

        } catch (error) {
            return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
        }





        // check the password validation
        if (registration_data.password.length < 8 || registration_data.password.length > 20)
            return utilsService.systemErrorHandler({ code: 402, type: 'password_out_of_range', message: 'Password length out of range' }, res);

        if (registrationService.checkPassword(registration_data.password))
            return utilsService.systemErrorHandler({ code: 402, type: 'password_not_strength', message: `Password doesn't meet the criteria` }, res);





        // hash the password
        registration_data.password = utilsService.generateHash(registration_data.password);


        // if checks not failed, save the new customer account
        try {

            // insert new account
            registration_data.account_id = utilsService.generateId({ alphabet: config.nanoid_basic_alphabet, length: config.account_id_length });
            const insertion_result = await accountsDb.query(`
                INSERT INTO
                    accounts
                SET
                    account_id = :account_id,
                    username = :username,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    phone = :phone,
                    password = :password,
                    account_type = 'customer';
            `, registration_data);




            // insert new customer data
            const insert_customer_result = await accountsDb.query(`
                INSERT INTO
                    customers
                SET
                    account_id = :account_id,
                    customer_id = :customer_id,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    phone = :phone
            `, {
                customer_id: utilsService.generateId({ alphabet: config.nanoid_basic_alphabet, length: config.customer_id_length }),
                ...registration_data
            });




            return res.status(200).send({ code: 200, type: 'new_customer_registered', message: 'new_customer_registered_successfully' });

        } catch (error) {
            return utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
        }

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
