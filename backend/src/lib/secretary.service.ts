import { Request } from 'express';
import { accountsDb } from './connectors/db/accounts-db';
import { Secretariat } from '../models';


class SecretaryGetService {


    async getSecretary(account_id: string): Promise<Secretariat> {

        try {

            const result = await accountsDb.query(`SELECT * FROM secretariat WHERE account_id = :account_id`, { account_id: account_id });
            if (result.rowsCount === 0)
                return Promise.resolve(null);

            const secretary = new Secretariat(result.rows[0]);
            return Promise.resolve(secretary);

        } catch (error) {
            return Promise.reject(error);
        }

    }





    async secretaryExists(account_id: string): Promise<boolean> {

        try {

            const result = await accountsDb.query(`SELECT account_id FROM secretariat WHERE account_id = :account_id`, { account_id: account_id });
            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




export const secretaryGetService = new SecretaryGetService();
