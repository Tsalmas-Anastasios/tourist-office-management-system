"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelAgentGetService = void 0;
const accounts_db_1 = require("./connectors/db/accounts-db");
const models_1 = require("../models");
class TravelAgentGetService {
    getTravelAgent(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(account_id);
            try {
                const result = yield accounts_db_1.accountsDb.query(`SELECT * FROM travel_agents WHERE account_id = :account_id`, { account_id: account_id });
                if (result.rowsCount === 0)
                    return null;
                const row = result.rows[0];
                const travel_agent = new models_1.TravelAgent(Object.assign(Object.assign({}, row), { place_of_residence: {
                        street: row['place_of_residence__street'],
                        city: row['place_of_residence__city'],
                        postal_code: row['place_of_residence__postal_code'],
                        state: row['place_of_residence__state'],
                        country: row['place_of_residence__country'],
                        longitude: row['place_of_residence__longitude'],
                        latitude: row['place_of_residence__latitude'],
                    }, office_details: {
                        email: row['office_details__email'],
                        phone: row['office_details__phone']
                    } }));
                return Promise.resolve(travel_agent);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    travelAgentExists(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield accounts_db_1.accountsDb.query(`SELECT account_id FROM travel_agents WHERE account_id = :account_id`, { account_id: account_id });
                if (result.rowsCount === 0)
                    return Promise.resolve(false);
                return Promise.resolve(true);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.travelAgentGetService = new TravelAgentGetService();
//# sourceMappingURL=travel-agents.service.js.map