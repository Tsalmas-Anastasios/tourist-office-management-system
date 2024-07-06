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
exports.CustomerManagementRoutes = void 0;
const utils_service_1 = require("../lib/utils.service");
const models_1 = require("../models");
const accounts_db_1 = require("../lib/connectors/db/accounts-db");
const customer_service_1 = require("../lib/customer.service");
class CustomerManagementRoutes {
    routes(app) {
        app.route('/api/customers/new')
            .post(utils_service_1.utilsService.checkAuthSecretary, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const secretary = new models_1.Secretariat(req.session.secretary);
            return secretary.register_customer(req, res);
        }));
        app.route('/api/customers')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const customers = [];
            try {
                const result = yield accounts_db_1.accountsDb.query(`SELECT * FROM customers`);
                for (const row of result.rows)
                    customers.push(new models_1.Customer(Object.assign(Object.assign({}, row), { place_of_residence: {
                            street: row['place_of_residence__street'],
                            city: row['place_of_residence__city'],
                            postal_code: row['place_of_residence__postal_code'],
                            state: row['place_of_residence__state'],
                            country: row['place_of_residence__country'],
                            longitude: row['place_of_residence__longitude'],
                            latitude: row['place_of_residence__latitude'],
                        } })));
                return res.status(200).send(customers);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/customers/c/:account_id')
            .get(utils_service_1.utilsService.checkAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const account_id = req.params.account_id.toString();
            try {
                const customer = new models_1.Customer(yield customer_service_1.customerGetService.getCustomer(account_id));
                return res.status(200).send(customer);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }))
            .put(utils_service_1.utilsService.checkAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const account_id = req.params.account_id.toString();
            if (account_id !== req.session.user.account_id && req.session.user.account_type !== 'secretariat')
                return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'unauthorized_for_this_action' }, res);
            let customer;
            if (account_id !== req.session.user.account_id)
                customer = new models_1.Customer(req.session.customer);
            else
                customer = new models_1.Customer(yield customer_service_1.customerGetService.getCustomer(account_id));
            try {
                yield customer.update_customer();
                return res.status(200).send({ code: 200, type: 'customer_updated_successfully' });
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }))
            .delete(utils_service_1.utilsService.checkAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const account_id = req.params.account_id.toString();
            if (account_id !== req.session.user.account_id && req.session.user.account_type !== 'secretariat')
                return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'unauthorized_for_this_action' }, res);
            let customer;
            if (account_id !== req.session.user.account_id)
                customer = new models_1.Customer(req.session.customer);
            else
                customer = new models_1.Customer(yield customer_service_1.customerGetService.getCustomer(account_id));
            try {
                yield customer.delete_customer();
                return res.status(200).send({ code: 200, type: 'customer_deleted' });
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
    }
}
exports.CustomerManagementRoutes = CustomerManagementRoutes;
//# sourceMappingURL=customers.js.map