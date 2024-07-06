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
exports.customerGetService = void 0;
const accounts_db_1 = require("./connectors/db/accounts-db");
const models_1 = require("../models");
class CustomerGetService {
    getCustomer(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield accounts_db_1.accountsDb.query(`SELECT * FROM customers WHERE account_id = :account_id`, { account_id: account_id });
                if (result.rowsCount === 0)
                    return Promise.resolve(null);
                const row = result.rows[0];
                const customer = new models_1.Customer(Object.assign(Object.assign({}, row), { place_of_residence: {
                        street: row['place_of_residence__street'],
                        city: row['place_of_residence__city'],
                        postal_code: row['place_of_residence__postal_code'],
                        state: row['place_of_residence__state'],
                        country: row['place_of_residence__country'],
                        longitude: row['place_of_residence__longitude'],
                        latitude: row['place_of_residence__latitude'],
                    } }));
                return Promise.resolve(customer);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    customerExists(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield accounts_db_1.accountsDb.query(`SELECT account_id FROM customers WHERE account_id = :account_id`, { account_id: account_id });
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
exports.customerGetService = new CustomerGetService();
//# sourceMappingURL=customer.service.js.map