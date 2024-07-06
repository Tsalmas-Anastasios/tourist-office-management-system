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
exports.PlansRoutes = void 0;
const utils_service_1 = require("../lib/utils.service");
const models_1 = require("../models");
const accounts_db_1 = require("../lib/connectors/db/accounts-db");
class PlansRoutes {
    routes(app) {
        app.route('/api/plans')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const plans_list = [];
            try {
                const plans_list_result = yield accounts_db_1.accountsDb.query(`
                        SELECT
                            plans.*,
                            places.country as place__country,
                            places.city as place__city,
                            places.postal_code as place__postal_code,
                            places.state as place__state,
                            places.street as place__street,
                            places.longitude as place__longitude,
                            places.latitude as place__latitude,
                            accommodations.title as accommodation__title,
                            accommodations.title_internal as accommodation__title_internal,
                            accommodations.type as accommodation__type,
                            accommodations.location_details__street as accommodation__location_details__street,
                            accommodations.location_details__city as accommodation__location_details__city,
                            accommodations.location_details__postal_code as accommodation__location_details__postal_code,
                            accommodations.location_details__state as accommodation__location_details__state,
                            accommodations.location_details__country as accommodation__location_details__country,
                            accommodations.location_details__longitude as accommodation__location_details__longitude,
                            accommodations.location_details__latitude as accommodation__location_details__latitude,
                            accommodations.accept_adults as accommodation__accept_adults,
                            accommodations.accept_children as accommodation__accept_children,
                            accommodations.accept_infants as accommodation__accept_infants
                        FROM
                            plans
                        JOIN places ON plans.place_id = places.place_id
                        JOIN accommodations ON plans.accommodation_id = accommodations.accommodation_id;
                    `);
                for (const row of plans_list_result.rows)
                    plans_list.push(new models_1.TravelPlan(Object.assign(Object.assign({}, row), { means_of_transport_arrival: {
                            type: row['means_of_transport_arrival__type'],
                            company_name: row['means_of_transport_arrival__company_name'],
                            start_time: row['means_of_transport_arrival__start_time'],
                            arrival_time: row['means_of_transport_arrival__arrival_time'],
                            number: row['means_of_transport_arrival__number'],
                        }, means_of_transport_return: {
                            type: row['means_of_transport_return__type'],
                            company_name: row['means_of_transport_return__company_name'],
                            start_time: row['means_of_transport_return__start_time'],
                            arrival_time: row['means_of_transport_return__arrival_time'],
                            number: row['means_of_transport_return__number'],
                        }, discount: {
                            code_type: row['discount__code_type'],
                            code_value: row['discount__code_value'],
                            enabled: row['discount__enabled'],
                            type: row['discount__type'],
                            value: row['discount__value']
                        }, place_details: new models_1.Place({
                            country: row['place__country'],
                            city: row['place__city'],
                            postal_code: row['place__postal_code'],
                            state: row['place__state'],
                            street: row['place__street'],
                            longitude: row['place__longitude'],
                            latitude: row['place__latitude']
                        }), accommodation_details: new models_1.Accommodation({
                            title: row['accommodation__title'],
                            title_internal: row['accommodation__title_internal'],
                            type: row['accommodation__type'],
                            location_details: {
                                street: row['accommodation__location_details__street'],
                                city: row['accommodation__location_details__city'],
                                postal_code: row['accommodation__location_details__postal_code'],
                                state: row['accommodation__location_details__state'],
                                country: row['accommodation__location_details__country'],
                                longitude: row['accommodation__location_details__longitude'],
                                latitude: row['accommodation__location_details__latitude'],
                            },
                            accept_adults: row['accommodation__accept_adults'],
                            accept_children: row['accommodation__accept_children'],
                            accept_infants: row['accommodation__accept_infants'],
                        }) })));
                return res.status(200).send(plans_list);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/plans/new')
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const new_plan = new models_1.TravelPlan(req.body.plan);
            const user = ((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.user) || ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.user) || null;
            if (user.user.account_type === 'secretariat') {
                const sec_plain = ((_d = (_c = req === null || req === void 0 ? void 0 : req.session) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.account_id) ? req.session.secretary : ((_f = (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.account_id) ? req.body.secretariat_data : null;
                const secretary = new models_1.Secretariat(sec_plain);
                return secretary.createNewPLan(new_plan, res);
            }
            else if (user.user.account_type === 'travel_agent') {
                const travel_agent_plain = ((_h = (_g = req === null || req === void 0 ? void 0 : req.session) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h.account_id) ? req.session.travel_agent : ((_k = (_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.user) === null || _k === void 0 ? void 0 : _k.account_id) ? req.body.travel_agent : null;
                const travel_agent = new models_1.TravelAgent(travel_agent_plain);
                return travel_agent.createNewPLan(new_plan, res);
            }
            return utils_service_1.utilsService.systemErrorHandler({
                code: 500,
                type: 'wrong_action'
            }, res);
        }));
        app.route('/api/plans/p/:plan_id')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const plan_id = req.params.plan_id.toString();
            try {
                const plan_result = yield accounts_db_1.accountsDb.query(`
                        SELECT
                            plans.*,
                            places.country as place__country,
                            places.city as place__city,
                            places.postal_code as place__postal_code,
                            places.state as place__state,
                            places.street as place__street,
                            places.longitude as place__longitude,
                            places.latitude as place__latitude,
                            accommodations.title as accommodation__title,
                            accommodations.title_internal as accommodation__title_internal,
                            accommodations.type as accommodation__type,
                            accommodations.location_details__street as accommodation__location_details__street,
                            accommodations.location_details__city as accommodation__location_details__city,
                            accommodations.location_details__postal_code as accommodation__location_details__postal_code,
                            accommodations.location_details__state as accommodation__location_details__state,
                            accommodations.location_details__country as accommodation__location_details__country,
                            accommodations.location_details__longitude as accommodation__location_details__longitude,
                            accommodations.location_details__latitude as accommodation__location_details__latitude,
                            accommodations.accept_adults as accommodation__accept_adults,
                            accommodations.accept_children as accommodation__accept_children,
                            accommodations.accept_infants as accommodation__accept_infants
                        FROM
                            plans
                        JOIN places ON plans.place_id = places.place_id
                        JOIN accommodations ON plans.accommodation_id = accommodations.accommodation_id
                        WHERE
                            plan_id = :plan_id;
                    `, { plan_id: plan_id });
                if (plan_result.rowsCount === 0)
                    return res.status(200).send(null);
                return res.status(200).send(new models_1.TravelPlan(Object.assign(Object.assign({}, plan_result.rows[0]), { means_of_transport_arrival: {
                        type: plan_result.rows[0]['means_of_transport_arrival__type'],
                        company_name: plan_result.rows[0]['means_of_transport_arrival__company_name'],
                        start_time: plan_result.rows[0]['means_of_transport_arrival__start_time'],
                        arrival_time: plan_result.rows[0]['means_of_transport_arrival__arrival_time'],
                        number: plan_result.rows[0]['means_of_transport_arrival__number'],
                    }, means_of_transport_return: {
                        type: plan_result.rows[0]['means_of_transport_return__type'],
                        company_name: plan_result.rows[0]['means_of_transport_return__company_name'],
                        start_time: plan_result.rows[0]['means_of_transport_return__start_time'],
                        arrival_time: plan_result.rows[0]['means_of_transport_return__arrival_time'],
                        number: plan_result.rows[0]['means_of_transport_return__number'],
                    }, discount: {
                        code_type: plan_result.rows[0]['discount__code_type'],
                        code_value: plan_result.rows[0]['discount__code_value'],
                        enabled: plan_result.rows[0]['discount__enabled'],
                        type: plan_result.rows[0]['discount__type'],
                        value: plan_result.rows[0]['discount__value']
                    }, place_details: new models_1.Place({
                        country: plan_result.rows[0]['place__country'],
                        city: plan_result.rows[0]['place__city'],
                        postal_code: plan_result.rows[0]['place__postal_code'],
                        state: plan_result.rows[0]['place__state'],
                        street: plan_result.rows[0]['place__street'],
                        longitude: plan_result.rows[0]['place__longitude'],
                        latitude: plan_result.rows[0]['place__latitude']
                    }), accommodation_details: new models_1.Accommodation({
                        title: plan_result.rows[0]['accommodation__title'],
                        title_internal: plan_result.rows[0]['accommodation__title_internal'],
                        type: plan_result.rows[0]['accommodation__type'],
                        location_details: {
                            street: plan_result.rows[0]['accommodation__location_details__street'],
                            city: plan_result.rows[0]['accommodation__location_details__city'],
                            postal_code: plan_result.rows[0]['accommodation__location_details__postal_code'],
                            state: plan_result.rows[0]['accommodation__location_details__state'],
                            country: plan_result.rows[0]['accommodation__location_details__country'],
                            longitude: plan_result.rows[0]['accommodation__location_details__longitude'],
                            latitude: plan_result.rows[0]['accommodation__location_details__latitude'],
                        },
                        accept_adults: plan_result.rows[0]['accommodation__accept_adults'],
                        accept_children: plan_result.rows[0]['accommodation__accept_children'],
                        accept_infants: plan_result.rows[0]['accommodation__accept_infants'],
                    }) })));
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }))
            .put((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
            const existing_plan = new models_1.TravelPlan(req.body.plan);
            existing_plan.plan_id = req.params.plan_id.toString();
            const user = ((_l = req === null || req === void 0 ? void 0 : req.session) === null || _l === void 0 ? void 0 : _l.user) || ((_m = req === null || req === void 0 ? void 0 : req.body) === null || _m === void 0 ? void 0 : _m.user) || null;
            if (user.user.account_type === 'secretariat') {
                const sec_plain = ((_p = (_o = req === null || req === void 0 ? void 0 : req.session) === null || _o === void 0 ? void 0 : _o.user) === null || _p === void 0 ? void 0 : _p.account_id) ? req.session.secretary : ((_r = (_q = req === null || req === void 0 ? void 0 : req.body) === null || _q === void 0 ? void 0 : _q.user) === null || _r === void 0 ? void 0 : _r.account_id) ? req.body.secretariat_data : null;
                const secretary = new models_1.Secretariat(sec_plain);
                return secretary.updateExistingPlan(existing_plan, res);
            }
            else if (user.user.account_type === 'travel_agent') {
                const travel_agent_plain = ((_t = (_s = req === null || req === void 0 ? void 0 : req.session) === null || _s === void 0 ? void 0 : _s.user) === null || _t === void 0 ? void 0 : _t.account_id) ? req.session.travel_agent : ((_v = (_u = req === null || req === void 0 ? void 0 : req.body) === null || _u === void 0 ? void 0 : _u.user) === null || _v === void 0 ? void 0 : _v.account_id) ? req.body.travel_agent : null;
                const travel_agent = new models_1.TravelAgent(travel_agent_plain);
                return travel_agent.updateExistingPlan(existing_plan, res);
            }
            return utils_service_1.utilsService.systemErrorHandler({
                code: 500,
                type: 'wrong_action'
            }, res);
        }))
            .delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _w, _x;
            const plan_id = req.params.plan_id.toString();
            const user = ((_w = req === null || req === void 0 ? void 0 : req.session) === null || _w === void 0 ? void 0 : _w.user) || ((_x = req === null || req === void 0 ? void 0 : req.body) === null || _x === void 0 ? void 0 : _x.user) || null;
            if (user.account_type === 'secretariat') {
                const secretary = new models_1.Secretariat();
                return secretary.deleteExistingPlan(plan_id, res);
            }
            else if (user.account_type === 'travel_agent') {
                const travel_agent = new models_1.TravelAgent();
                return travel_agent.deleteExistingPlan(plan_id, res);
            }
            return utils_service_1.utilsService.systemErrorHandler({
                code: 500,
                type: 'wrong_action'
            }, res);
        }));
    }
}
exports.PlansRoutes = PlansRoutes;
//# sourceMappingURL=plans.js.map