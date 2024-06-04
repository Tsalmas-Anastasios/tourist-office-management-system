import { Request } from 'express';
import { accountsDb } from './connectors/db/accounts-db';
import { Customer, Secretariat } from '../models';



class CustomerGetService {


    async getCustomer(account_id: string): Promise<Customer> {

        try {

            const result = await accountsDb.query(`SELECT * FROM customers WHERE account_id = :account_id`, { account_id: account_id });
            if (result.rowsCount === 0)
                return Promise.resolve(null);

            const customer = new Customer(result.rows[0]);
            return Promise.resolve(customer);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async customerExists(account_id: string): Promise<boolean> {

        try {

            const result = await accountsDb.query(`SELECT account_id FROM customers WHERE account_id = :account_id`, { account_id: account_id });
            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }



}




export const customerGetService = new CustomerGetService();
