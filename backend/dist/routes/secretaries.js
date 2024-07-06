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
exports.SecretaryManagementRoutes = void 0;
const utils_service_1 = require("../lib/utils.service");
const models_1 = require("../models");
const secretary_service_1 = require("../lib/secretary.service");
const accounts_db_1 = require("../lib/connectors/db/accounts-db");
class SecretaryManagementRoutes {
    routes(app) {
        app.route('/api/secretaries/new')
            .post(utils_service_1.utilsService.checkAuthSecretary, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const secretary = new models_1.Secretariat(req.session.secretary);
            return secretary.register_secretary({ new_secretary: req.body.secretary }, req, res);
        }));
        app.route('/api/secretaries')
            .get(utils_service_1.utilsService.checkAuthSecretary, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const secretaries = [];
            try {
                const result = yield accounts_db_1.accountsDb.query(`SELECT * FROM secretariat`);
                for (const row of result.rows)
                    secretaries.push(new models_1.Secretariat(Object.assign(Object.assign({}, row), { place_of_residence: {
                            street: row['place_of_residence__street'],
                            city: row['place_of_residence__city'],
                            postal_code: row['place_of_residence__postal_code'],
                            state: row['place_of_residence__state'],
                            country: row['place_of_residence__country'],
                            longitude: row['place_of_residence__longitude'],
                            latitude: row['place_of_residence__latitude'],
                        }, office_hours: {
                            start_time: row['office_hours__start_time'],
                            end_time: row['office_hours__end_time']
                        }, office_details: {
                            email: row['office_details__email'],
                            phone: row['office_details__phone']
                        } })));
                return res.status(200).send(secretaries);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/secretaries/s/:account_id')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const account_id = req.params.account_id.toString();
            try {
                const secretary = new models_1.Secretariat(yield secretary_service_1.secretaryGetService.getSecretary(account_id));
                return res.status(200).send(secretary);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }))
            .put(utils_service_1.utilsService.checkAuthSecretary, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const account_id = req.params.account_id.toString();
            const secretary = new models_1.Secretariat(req.body.secretary);
            try {
                if (!(yield secretary_service_1.secretaryGetService.secretaryExists(account_id)))
                    return utils_service_1.utilsService.systemErrorHandler({ code: 404, type: 'user_not_found' }, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler(error, res);
            }
            try {
                yield secretary.update_secretary();
                return res.status(200).send({ code: 200, type: 'secretary_updated' });
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler(error, res);
            }
        }))
            .delete(utils_service_1.utilsService.checkAuthSecretary, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const account_id = req.params.account_id.toString();
            const secretary = new models_1.Secretariat(req.body.secretary);
            try {
                if (!(yield secretary_service_1.secretaryGetService.secretaryExists(account_id)))
                    return utils_service_1.utilsService.systemErrorHandler({ code: 404, type: 'user_not_found' }, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler(error, res);
            }
            try {
                yield secretary.delete_secretary();
                return res.status(200).send({ code: 200, type: 'secretary_account_deleted' });
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler(error, res);
            }
        }));
    }
}
exports.SecretaryManagementRoutes = SecretaryManagementRoutes;
//# sourceMappingURL=secretaries.js.map