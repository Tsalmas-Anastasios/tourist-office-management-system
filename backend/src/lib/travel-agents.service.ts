import { Request } from 'express';
import { accountsDb } from './connectors/db/accounts-db';
import { TravelAgent } from '../models';



class TravelAgentGetService {


    async getTravelAgent(account_id: string): Promise<TravelAgent> {

        try {

            const result = await accountsDb.query(`SELECT * FROM travel_agents WHERE account_id = :account_id`, { account_id: account_id });
            if (result.rowsCount === 0)
                return null;

            const row = result.rows[0];
            const travel_agent = new TravelAgent({
                ...row,
                place_of_residence: {
                    street: row['place_of_residence.street'],
                    city: row['place_of_residence.city'],
                    postal_code: row['place_of_residence.postal_code'],
                    state: row['place_of_residence.state'],
                    country: row['place_of_residence.country'],
                    longitude: row['place_of_residence.longitude'],
                    latitude: row['place_of_residence.latitude'],
                },
                office_details: {
                    email: row['office_details.email'],
                    phone: row['office_details.phone']
                }
            });

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
