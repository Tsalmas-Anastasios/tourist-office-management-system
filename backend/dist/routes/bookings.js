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
exports.BookingsRoutes = void 0;
const config_1 = require("../config");
const utils_service_1 = require("../lib/utils.service");
const models_1 = require("../models");
const accounts_db_1 = require("../lib/connectors/db/accounts-db");
class BookingsRoutes {
    routes(app) {
        app.route('/api/bookings/new')
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const booking_data = new models_1.PlanBooking(req.body.booking);
            booking_data.booking_id = utils_service_1.utilsService.generateId({ alphabet: config_1.config.nanoid_basic_alphabet, length: config_1.config.booking_id_length });
            try {
                if (booking_data === null || booking_data === void 0 ? void 0 : booking_data.secretary_id) {
                    const secretary = new models_1.Secretariat();
                    return res.status(200).send(yield secretary.bookPlan(booking_data, ((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.user) || ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.user)));
                }
                else if (booking_data === null || booking_data === void 0 ? void 0 : booking_data.travel_agent_id) {
                    const travel_agent = new models_1.TravelAgent();
                    return res.status(200).send(yield travel_agent.bookPlan(booking_data, ((_c = req === null || req === void 0 ? void 0 : req.session) === null || _c === void 0 ? void 0 : _c.user) || ((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.user)));
                }
                else if (booking_data === null || booking_data === void 0 ? void 0 : booking_data.customer_id) {
                    const customer = new models_1.Customer();
                    return res.status(200).send(yield customer.bookPlan(booking_data, ((_e = req === null || req === void 0 ? void 0 : req.session) === null || _e === void 0 ? void 0 : _e.user) || ((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.user)));
                }
                throw new Error();
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/booking/new-for-customer')
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _g, _h;
            const booking_data = new models_1.PlanBooking(req.body.booking);
            booking_data.booking_id = utils_service_1.utilsService.generateId({ alphabet: config_1.config.nanoid_basic_alphabet, length: config_1.config.booking_id_length });
            const secretary = new models_1.Secretariat(((_g = req === null || req === void 0 ? void 0 : req.session) === null || _g === void 0 ? void 0 : _g.secretary) || ((_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.secretary) || null);
            try {
                return res.status(200).send(yield secretary.bookPlanForCustomer(booking_data));
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/bookings/pl/:plan_id')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const bookings = [];
            const plan_id = req.params.plan_id.toString();
            try {
                const result = yield accounts_db_1.accountsDb.query(`
                        SELECT
                            bookings.*,
                            CASE
                                WHEN bookings.customer_id IS NOT NULL THEN customers.first_name
                                WHEN bookings.travel_agent_id IS NOT NULL THEN travel_agents.first_name
                                ELSE secretariat.first_name
                            END AS first_name,
                            CASE
                                WHEN bookings.customer_id IS NOT NULL THEN customers.last_name
                                WHEN bookings.travel_agent_id IS NOT NULL THEN travel_agents.last_name
                                ELSE secretariat.last_name
                            END AS last_name,
                            CASE
                                WHEN bookings.customer_id IS NOT NULL THEN customers.email
                                WHEN bookings.travel_agent_id IS NOT NULL THEN travel_agents.email
                                ELSE secretariat.email
                            END AS email,
                            CASE
                                WHEN bookings.customer_id IS NOT NULL THEN customers.phone
                                WHEN bookings.travel_agent_id IS NOT NULL THEN travel_agents.phone
                                ELSE secretariat.phone
                            END AS phone
                        FROM bookings
                        LEFT JOIN customers ON bookings.customer_id = customers.customer_id
                        LEFT JOIN travel_agents ON bookings.travel_agent_id = travel_agents.travel_agent_id
                        LEFT JOIN secretariat ON bookings.secretary_id = secretariat.secretariat_id
                        WHERE
                            bookings.plan_id = :plan_id;
                    `, { plan_id: plan_id });
                for (const row of result.rows) {
                    const booking = new models_1.PlanBooking(row);
                    if (booking === null || booking === void 0 ? void 0 : booking.customer_id)
                        booking.main_customer = new models_1.Customer({
                            first_name: row['first_name'],
                            last_name: row['last_name'],
                            email: row['email'],
                            phone: row['phone']
                        });
                    else if (booking === null || booking === void 0 ? void 0 : booking.travel_agent_id) {
                        booking.travel_agent = new models_1.TravelAgent();
                        booking.travel_agent.first_name = row['first_name'];
                        booking.travel_agent.last_name = row['last_name'];
                        booking.travel_agent.email = row['email'];
                        booking.travel_agent.phone = row['phone'];
                    }
                    else {
                        booking.secretary = new models_1.Secretariat();
                        booking.secretary.first_name = row['first_name'];
                        booking.secretary.last_name = row['last_name'];
                        booking.secretary.email = row['email'];
                        booking.secretary.phone = row['phone'];
                    }
                    bookings.push(booking);
                }
                return res.status(200).send(bookings);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/bookings/cs/:account_id')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const account_id = req.params.account_id.toString();
            let account_type = '';
            try {
                const account_type_result = yield accounts_db_1.accountsDb.query(`SELECT account_type FROM accounts WHERE account_id = :account_id`, { account_id: account_id });
                if (account_type_result.rowsCount === 0)
                    return utils_service_1.utilsService.systemErrorHandler({ code: 404, type: 'user_not_found' }, res);
                account_type = account_type_result.rows[0].account_type.toString();
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
            let custom_id_query = '';
            if (account_type === 'secretariat')
                custom_id_query = `SELECT secretariat_id FROM secretariat WHERE account_id = :account_id`;
            else if (account_type === 'travel_agent')
                custom_id_query = `SELECT travel_agent_id FROM travel_agents WHERE account_id = :account_id`;
            else
                custom_id_query = `SELECT customer_id FROM customers WHERE account_id = :account_id`;
            let custom_id = '';
            try {
                const custom_id_result = yield accounts_db_1.accountsDb.query(custom_id_query, { account_id: account_id });
                if (custom_id_result.rowsCount === 0)
                    return utils_service_1.utilsService.systemErrorHandler({ code: 404, type: 'user_not_found' }, res);
                if (account_type === 'secretariat')
                    custom_id = custom_id_result.rows[0].secretariat_id.toString();
                else if (account_type === 'travel_agent')
                    custom_id = custom_id_result.rows[0].travel_agent_id.toString();
                else
                    custom_id = custom_id_result.rows[0].customer_id.toString();
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
            let where_query = '';
            if (account_type === 'secretariat')
                where_query = 'bookings.secretary_id = :custom_id';
            else if (account_type === 'travel_agent')
                where_query = 'bookings.travel_agent_id = :custom_id';
            else
                where_query = 'bookings.customer_id = :custom_id';
            try {
                const bookings_result = yield accounts_db_1.accountsDb.query(`
                        SELECT
                            bookings.*,
                            plans.title as plan__title,
                            plans.title_internal as plan__title_internal,
                            plans.price as plan__price,
                            plans.booking_type as plan__booking_type,
                            plans.category as plan__category,
                            plans.persons as plan__persons,
                            plans.adults as plan__adults,
                            plans.children as plan__children,
                            plans.infants as plan__infants,
                            plans.small_description as plan__small_description,
                            plans.description as plan__description,
                            plans.date_range as plan__date_range,
                            plans.start_date as plan__start_date,
                            plans.end_date as plan__end_date,
                            plans.min_days as plan__min_days,
                            plans.max_days as plan__max_days,
                            plans.cancelation_policy as plan__cancelation_policy,
                            plans.available as plan__available,
                            plans.available_from_date as plan__available_from_date,
                            plans.available_until_date as plan__available_until_date,
                            plans.starting_type as plan__starting_type,
                            plans.adults_only as plan__adults_only,
                            plans.family_friendly as plan__family_friendly,
                            plans.area_description as plan__area_description,
                            plans.other_important_info as plan__other_important_info,
                            plans.means_of_transport_arrival__type as plan__means_of_transport_arrival__type,
                            plans.means_of_transport_arrival__company_name as plan__means_of_transport_arrival__company_name,
                            plans.means_of_transport_arrival__start_time as plan__means_of_transport_arrival__start_time,
                            plans.means_of_transport_arrival__arrival_time as plan__means_of_transport_arrival__arrival_time,
                            plans.means_of_transport_arrival__number as plan__means_of_transport_arrival__number,
                            plans.means_of_transport_return__type as plan__means_of_transport_return__type,
                            plans.means_of_transport_return__company_name as plan__means_of_transport_return__company_name,
                            plans.means_of_transport_return__start_time as plan__means_of_transport_return__start_time,
                            plans.means_of_transport_return__arrival_time as plan__means_of_transport_return__arrival_time,
                            plans.means_of_transport_return__number as plan__means_of_transport_return__number,
                            plans.place_id as plan__place_id,
                            plans.accommodation_id as plan__accommodation_id,
                            plans.discount__code_type as plan__discount__code_type,
                            plans.discount__code_value as plan__discount__code_value,
                            plans.discount__enabled as plan__discount__enabled,
                            plans.discount__type as plan__discount__type,
                            plans.discount__value as plan__discount__value,
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
                            bookings
                        JOIN plans ON plans.plan_id = bookings.plan_id
                        JOIN places ON plans.place_id = places.place_id
                        JOIN accommodations ON plans.accommodation_id = accommodations.accommodation_id
                        WHERE
                            ${where_query};
                    `, { custom_id: custom_id });
                const bookings_list = [];
                for (const row of bookings_result.rows) {
                    const booking = new models_1.PlanBooking(row);
                    if (booking === null || booking === void 0 ? void 0 : booking.customer_id)
                        booking.main_customer = new models_1.Customer({
                            first_name: row['first_name'],
                            last_name: row['last_name'],
                            email: row['email'],
                            phone: row['phone']
                        });
                    else if (booking === null || booking === void 0 ? void 0 : booking.travel_agent_id) {
                        booking.travel_agent = new models_1.TravelAgent();
                        booking.travel_agent.first_name = row['first_name'];
                        booking.travel_agent.last_name = row['last_name'];
                        booking.travel_agent.email = row['email'];
                        booking.travel_agent.phone = row['phone'];
                    }
                    else {
                        booking.secretary = new models_1.Secretariat();
                        booking.secretary.first_name = row['first_name'];
                        booking.secretary.last_name = row['last_name'];
                        booking.secretary.email = row['email'];
                        booking.secretary.phone = row['phone'];
                    }
                    const booking_plan = new models_1.TravelPlan({
                        title: row['plan__title'],
                        title_internal: row['plan__title_internal'],
                        price: row['plan__price'],
                        booking_type: row['plan__booking_type'],
                        category: row['plan__category'],
                        persons: row['plan__persons'],
                        adults: row['plan__adults'],
                        children: row['plan__children'],
                        infants: row['plan__infants'],
                        small_description: row['plan__small_description'],
                        description: row['plan__description'],
                        date_range: row['plan__date_range'],
                        start_date: row['plan__start_date'],
                        end_date: row['plan__end_date'],
                        min_days: row['plan__min_days'],
                        max_days: row['plan__max_days'],
                        cancelation_policy: row['plan__cancelation_policy'],
                        available: row['plan__available'],
                        available_from_date: row['plan__available_from_date'],
                        available_until_date: row['plan__available_until_date'],
                        starting_type: row['plan__starting_type'],
                        adults_only: row['plan__adults_only'],
                        family_friendly: row['plan__family_friendly'],
                        area_description: row['plan__area_description'],
                        other_important_info: row['plan__other_important_info'],
                        place_id: row['plan__place_id'],
                        accommodation_id: row['plan__accommodation_id'],
                        means_of_transport_arrival: {
                            type: row['plan__means_of_transport_arrival__type'],
                            company_name: row['plan__means_of_transport_arrival__company_name'],
                            start_time: row['plan__means_of_transport_arrival__start_time'],
                            arrival_time: row['plan__means_of_transport_arrival__arrival_time'],
                            number: row['plan__means_of_transport_arrival__number'],
                        },
                        means_of_transport_return: {
                            type: row['plan__means_of_transport_return__type'],
                            company_name: row['plan__means_of_transport_return__company_name'],
                            start_time: row['plan__means_of_transport_return__start_time'],
                            arrival_time: row['plan__means_of_transport_return__arrival_time'],
                            number: row['plan__means_of_transport_return__number'],
                        },
                        discount: {
                            code_type: row['plan__discount__code_type'],
                            code_value: row['plan__discount__code_value'],
                            enabled: row['plan__discount__enabled'],
                            type: row['plan__discount__type'],
                            value: row['plan__discount__value']
                        },
                        place_details: new models_1.Place({
                            country: row['place__country'],
                            city: row['place__city'],
                            postal_code: row['place__postal_code'],
                            state: row['place__state'],
                            street: row['place__street'],
                            longitude: row['place__longitude'],
                            latitude: row['place__latitude']
                        }),
                        accommodation_details: new models_1.Accommodation({
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
                        }),
                    });
                    bookings_list.push({
                        booking: booking,
                        plan: booking_plan
                    });
                }
                return res.status(200).send(bookings_list);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/bookings/cs/:account_id/:booking_id')
            .delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
            const data = {
                account_id: req.params.account_id.toString(),
                booking_id: req.params.booking_id.toString()
            };
            const user = ((_j = req === null || req === void 0 ? void 0 : req.session) === null || _j === void 0 ? void 0 : _j.user) || ((_k = req === null || req === void 0 ? void 0 : req.body) === null || _k === void 0 ? void 0 : _k.user) || null;
            try {
                if (user.user.account_type === 'secretariat') {
                    const sec_plain = ((_m = (_l = req === null || req === void 0 ? void 0 : req.session) === null || _l === void 0 ? void 0 : _l.user) === null || _m === void 0 ? void 0 : _m.account_id) ? req.session.secretary : ((_p = (_o = req === null || req === void 0 ? void 0 : req.body) === null || _o === void 0 ? void 0 : _o.user) === null || _p === void 0 ? void 0 : _p.account_id) ? req.body.secretariat_data : null;
                    const secretary = new models_1.Secretariat(sec_plain);
                    yield secretary.deleteBookingSelf(data);
                    return res.status(200).send({ code: 200, type: 'booking_deleted' });
                }
                else if (user.user.account_type === 'travel_agent') {
                    const travel_agent_plain = ((_r = (_q = req === null || req === void 0 ? void 0 : req.session) === null || _q === void 0 ? void 0 : _q.user) === null || _r === void 0 ? void 0 : _r.account_id) ? req.session.travel_agent : ((_t = (_s = req === null || req === void 0 ? void 0 : req.body) === null || _s === void 0 ? void 0 : _s.user) === null || _t === void 0 ? void 0 : _t.account_id) ? req.body.travel_agent : null;
                    const travel_agent = new models_1.TravelAgent(travel_agent_plain);
                    yield travel_agent.deleteBookingSelf(data);
                    return res.status(200).send({ code: 200, type: 'booking_deleted' });
                }
                else if (user.user.account_type === 'customer') {
                    const customer_plain = ((_v = (_u = req === null || req === void 0 ? void 0 : req.session) === null || _u === void 0 ? void 0 : _u.user) === null || _v === void 0 ? void 0 : _v.account_id) ? req.session.customer : ((_x = (_w = req === null || req === void 0 ? void 0 : req.body) === null || _w === void 0 ? void 0 : _w.user) === null || _x === void 0 ? void 0 : _x.account_id) ? req.body.customer : null;
                    const customer = new models_1.Customer(customer_plain);
                    yield customer.deleteBookingSelf(data);
                    return res.status(200).send({ code: 200, type: 'booking_deleted' });
                }
                return utils_service_1.utilsService.systemErrorHandler({
                    code: 500,
                    type: 'wrong_action'
                }, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
    }
}
exports.BookingsRoutes = BookingsRoutes;
//# sourceMappingURL=bookings.js.map