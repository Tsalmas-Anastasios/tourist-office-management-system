import { Request } from 'express';
import { accountsDb } from './connectors/db/accounts-db';
import { TravelAgent } from '../models';



class TravelAgentGetService {


    async getTravelAgent(account_id: string): Promise<TravelAgent> {

        try {

            const result = await accountsDb.query(`SELECT * FROM travel_agents WHERE account_id = :account_id`, { account_id: account_id });
            if (result.rowsCount === 0)
                return null;

            const travel_agent = new TravelAgent(result.rows[0]);

            return Promise.resolve(travel_agent);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async travelAgentExists(account_id: string): Promise<boolean> {

        try {

            const result = await accountsDb.query(`SELECT account_id FROM travel_agents WHERE account_id = :account_id`, { account_id: account_id });
            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




export const travelAgentGetService = new TravelAgentGetService();
