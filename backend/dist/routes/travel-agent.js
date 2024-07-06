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
exports.TravelAgentManagementRoutes = void 0;
const utils_service_1 = require("../lib/utils.service");
const models_1 = require("../models");
const accounts_db_1 = require("../lib/connectors/db/accounts-db");
const travel_agents_service_1 = require("../lib/travel-agents.service");
class TravelAgentManagementRoutes {
    routes(app) {
        app.route('/api/travel-agents/new')
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const secretary = new models_1.Secretariat(((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.secretary) || ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.secretary) || null);
            return secretary.register_travel_agent({ new_travel_agent: req.body.travel_agent }, req, res);
        }));
        app.route('/api/travel-agents')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const travel_agents = [];
            try {
                const result = yield accounts_db_1.accountsDb.query(`SELECT * FROM travel_agents`);
                for (const row of result.rows)
                    travel_agents.push(new models_1.TravelAgent(Object.assign(Object.assign({}, row), { place_of_residence: {
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
                        } })));
                return res.status(200).send(travel_agents);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/travel-agents/t/:account_id')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const account_id = req.params.account_id.toString();
            try {
                const travel_agent = new models_1.TravelAgent(yield travel_agents_service_1.travelAgentGetService.getTravelAgent(account_id));
                return res.status(200).send(travel_agent);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }))
            .put((req, res) => __awaiter(this, void 0, void 0, function* () {
            const account_id = req.params.account_id.toString();
            if (account_id !== req.session.user.account_id && req.session.user.account_type !== 'secretariat')
                return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'unauthorized_for_this_action' }, res);
            let travel_agent;
            if (account_id !== req.session.user.account_id)
                travel_agent = new models_1.TravelAgent(req.session.travel_agent);
            else
                travel_agent = new models_1.TravelAgent(yield travel_agents_service_1.travelAgentGetService.getTravelAgent(account_id));
            try {
                yield travel_agent.update_travel_agent();
                return res.status(200).send({ code: 200, type: 'travel_agent_updated' });
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }))
            .delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            const account_id = req.params.account_id.toString();
            const user = ((_c = req === null || req === void 0 ? void 0 : req.session) === null || _c === void 0 ? void 0 : _c.user) || ((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.user) || null;
            if (account_id !== user.account_id && user.account_type !== 'secretariat')
                return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'unauthorized_for_this_action' }, res);
            const travel_agent = yield travel_agents_service_1.travelAgentGetService.getTravelAgent(account_id);
            try {
                yield travel_agent.delete_travel_agent();
                return res.status(200).send({ code: 200, type: 'travel_agent_deleted' });
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
    }
}
exports.TravelAgentManagementRoutes = TravelAgentManagementRoutes;
//# sourceMappingURL=travel-agent.js.map