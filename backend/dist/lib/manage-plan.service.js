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
exports.deleteExistingPlan = exports.updateExistingPlan = exports.createNewPlan = void 0;
const config_1 = require("../config");
const utils_service_1 = require("./utils.service");
const accounts_db_1 = require("./connectors/db/accounts-db");
function createNewPlan(new_plan) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if (!(new_plan === null || new_plan === void 0 ? void 0 : new_plan.title) || !(new_plan === null || new_plan === void 0 ? void 0 : new_plan.title_internal) || !(new_plan === null || new_plan === void 0 ? void 0 : new_plan.price) || !(new_plan === null || new_plan === void 0 ? void 0 : new_plan.category)
            || !(new_plan === null || new_plan === void 0 ? void 0 : new_plan.small_description) || !(new_plan === null || new_plan === void 0 ? void 0 : new_plan.description) || !(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_arrival)
            || !(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_return) || !(new_plan === null || new_plan === void 0 ? void 0 : new_plan.place_id) || !(new_plan === null || new_plan === void 0 ? void 0 : new_plan.accommodation_id))
            return Promise.resolve({ code: 400, type: 'bad_request', message: 'Data to create the plan are missing' });
        try {
            new_plan.plan_id = utils_service_1.utilsService.generateId({ alphabet: config_1.config.nanoid_basic_alphabet, length: config_1.config.plan_id_length });
            const insertion_result = yield accounts_db_1.accountsDb.query(`
            INSERT INTO
                plans
            SET
                plan_id = :plan_id,
                title = :title,
                title_internal = :title_internal,
                price = :price,
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.booking_type) ? `booking_type = '${new_plan.booking_type}',` : ``}
                category = :category,
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.persons) ? `persons = '${new_plan.persons}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.adults) ? `adults = ${new_plan.adults},` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.children) ? `children = ${new_plan.children},` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.infants) ? `infants = ${new_plan.infants},` : ``}
                small_description = :small_description,
                description = :description,
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.date_range) ? `date_range = '${new_plan.date_range}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.start_date) ? `start_date = '${new_plan.start_date}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.end_date) ? `end_date = '${new_plan.end_date}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.min_days) ? `min_days = ${new_plan.min_days},` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.max_days) ? `max_days = ${new_plan.max_days},` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.cancelation_policy) ? `cancelation_policy = '${new_plan.cancelation_policy}',` : ``}
                available = ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.available) ? 1 : 0},
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.available_from_date) ? `available_from_date = '${new_plan.available_from_date}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.available_until_date) ? `available_until_date = '${new_plan.available_until_date}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.starting_type) ? `starting_type = '${new_plan.starting_type}',` : ``}
                adults_only = ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.adults_only) ? 1 : 0},
                family_friendly = ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.family_friendly) ? 1 : 0},
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.area_description) ? `area_description = '${new_plan.area_description}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.other_important_info) ? `other_important_info = '${new_plan.other_important_info}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_arrival.type) ? `means_of_transport_arrival__type = '${new_plan.means_of_transport_arrival.type}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_arrival.company_name) ? `means_of_transport_arrival__company_name = '${new_plan.means_of_transport_arrival.company_name}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_arrival.start_time) ? `means_of_transport_arrival__start_time = '${new_plan.means_of_transport_arrival.start_time}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_arrival.arrival_time) ? `means_of_transport_arrival__arrival_time = '${new_plan.means_of_transport_arrival.arrival_time}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_arrival.number) ? `means_of_transport_arrival__number = '${new_plan.means_of_transport_arrival.number}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_return.type) ? `means_of_transport_return__type = '${new_plan.means_of_transport_return.type}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_return.company_name) ? `means_of_transport_return__company_name = '${new_plan.means_of_transport_return.company_name}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_return.start_time) ? `means_of_transport_return__start_time = '${new_plan.means_of_transport_return.start_time}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_return.arrival_time) ? `means_of_transport_return__arrival_time = '${new_plan.means_of_transport_return.arrival_time}',` : ``}
                ${(new_plan === null || new_plan === void 0 ? void 0 : new_plan.means_of_transport_return.number) ? `means_of_transport_return__number = '${new_plan.means_of_transport_return.number}',` : ``}
                ${((_a = new_plan === null || new_plan === void 0 ? void 0 : new_plan.discount) === null || _a === void 0 ? void 0 : _a.code_type) ? `discount__code_type = '${new_plan.discount.code_type}',` : ``}
                ${((_b = new_plan === null || new_plan === void 0 ? void 0 : new_plan.discount) === null || _b === void 0 ? void 0 : _b.code_value) ? `discount__code_value = '${new_plan.discount.code_value}',` : ``}
                discount__enabled = ${((_c = new_plan === null || new_plan === void 0 ? void 0 : new_plan.discount) === null || _c === void 0 ? void 0 : _c.enabled) ? 1 : 0},
                ${((_d = new_plan === null || new_plan === void 0 ? void 0 : new_plan.discount) === null || _d === void 0 ? void 0 : _d.type) ? `discount__type = '${new_plan.discount.type}',` : ``}
                ${((_e = new_plan === null || new_plan === void 0 ? void 0 : new_plan.discount) === null || _e === void 0 ? void 0 : _e.value) ? `discount__value = ${new_plan.discount.value},` : ``}
                place_id = :place_id,
                accommodation_id = :accommodation_id
        `, new_plan);
            return Promise.resolve({
                code: 200,
                type: 'plan_created',
                plan_id: new_plan.place_id
            });
        }
        catch (error) {
            return Promise.reject(error);
        }
    });
}
exports.createNewPlan = createNewPlan;
function updateExistingPlan(existing_plan) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if (!(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.title) || !(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.title_internal) || !(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.price) || !(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.category)
            || !(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.small_description) || !(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.description) || !(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_arrival)
            || !(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_return) || !(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.place_id) || !(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.accommodation_id))
            return Promise.resolve({ code: 400, type: 'bad_request', message: 'Data to create the plan are missing' });
        try {
            const update_result = yield accounts_db_1.accountsDb.query(`
            UPDATE
                plans
            SET
                title = :title,
                title_internal = :title_internal,
                price = :price,
                booking_type = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.booking_type) ? `'${existing_plan.booking_type}'` : `NULL`},
                category = :category,
                persons = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.persons) ? `${existing_plan.persons}` : `NULL`},
                adults = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.adults) ? `${existing_plan.adults}` : `NULL`},
                children = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.children) ? `${existing_plan.children}` : `NULL`},
                infants = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.infants) ? `${existing_plan.infants}` : `NULL`},
                small_description = :small_description,
                description = :description,
                date_range = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.date_range) ? `'${existing_plan.date_range}'` : `NULL`},
                start_date = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.start_date) ? `'${existing_plan.start_date}'` : `NULL`},
                end_date = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.end_date) ? `'${existing_plan.end_date}'` : `NULL`},
                min_days = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.min_days) ? `${existing_plan.min_days}` : `NULL`},
                max_days = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.max_days) ? `${existing_plan.max_days}` : `NULL`},
                cancelation_policy = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.cancelation_policy) ? `'${existing_plan.cancelation_policy}'` : `NULL`},
                available = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.available) ? 1 : 0},
                available_from_date = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.available_from_date) ? `'${existing_plan.available_from_date}'` : `NULL`},
                available_until_date = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.available_until_date) ? `'${existing_plan.available_until_date}'` : `NULL`},
                starting_type = :starting_type,
                adults_only = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.adults_only) ? 1 : 0},
                family_friendly = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.family_friendly) ? 1 : 0},
                area_description = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.area_description) ? `'${existing_plan.area_description}'` : `NULL`},
                other_important_info = ${(existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.other_important_info) ? `'${existing_plan.other_important_info}'` : `NULL`},
                means_of_transport_arrival__type = ${((_a = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_arrival) === null || _a === void 0 ? void 0 : _a.type) ? `'${existing_plan.means_of_transport_arrival.type}'` : `NULL`},
                means_of_transport_arrival__company_name = ${((_b = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_arrival) === null || _b === void 0 ? void 0 : _b.company_name) ? `'${existing_plan.means_of_transport_arrival.company_name}'` : `NULL`},
                means_of_transport_arrival__start_time = ${((_c = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_arrival) === null || _c === void 0 ? void 0 : _c.start_time) ? `'${existing_plan.means_of_transport_arrival.start_time}'` : `NULL`},
                means_of_transport_arrival__arrival_time = ${((_d = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_arrival) === null || _d === void 0 ? void 0 : _d.arrival_time) ? `'${existing_plan.means_of_transport_arrival.arrival_time}'` : `NULL`},
                means_of_transport_arrival__number = ${((_e = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_arrival) === null || _e === void 0 ? void 0 : _e.number) ? `'${existing_plan.means_of_transport_arrival.number}'` : `NULL`},
                means_of_transport_return__type = ${((_f = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_return) === null || _f === void 0 ? void 0 : _f.type) ? `'${existing_plan.means_of_transport_return.type}'` : `NULL`},
                means_of_transport_return__company_name = ${((_g = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_return) === null || _g === void 0 ? void 0 : _g.company_name) ? `'${existing_plan.means_of_transport_return.company_name}'` : `NULL`},
                means_of_transport_return__start_time = ${((_h = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_return) === null || _h === void 0 ? void 0 : _h.start_time) ? `'${existing_plan.means_of_transport_return.start_time}'` : `NULL`},
                means_of_transport_return__arrival_time = ${((_j = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_return) === null || _j === void 0 ? void 0 : _j.arrival_time) ? `'${existing_plan.means_of_transport_return.arrival_time}'` : `NULL`},
                means_of_transport_return__number = ${((_k = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.means_of_transport_return) === null || _k === void 0 ? void 0 : _k.number) ? `'${existing_plan.means_of_transport_return.number}'` : `NULL`},
                discount__code_type = ${((_l = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.discount) === null || _l === void 0 ? void 0 : _l.code_type) ? `'${existing_plan.discount.code_type}'` : `NULL`},
                discount__code_value = ${((_m = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.discount) === null || _m === void 0 ? void 0 : _m.code_value) ? `'${existing_plan.discount.code_value}'` : `NULL`},
                discount__enabled = ${((_o = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.discount) === null || _o === void 0 ? void 0 : _o.enabled) ? 1 : 0},
                discount__type = ${((_p = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.discount) === null || _p === void 0 ? void 0 : _p.type) ? `'${existing_plan.discount.type}'` : `NULL`},
                discount__value = ${((_q = existing_plan === null || existing_plan === void 0 ? void 0 : existing_plan.discount) === null || _q === void 0 ? void 0 : _q.value) ? `${existing_plan.discount.value}` : `NULL`},
                place_id = :place_id,
                accommodation_id = :accommodation_id
            WHERE
                plan_id = :plan_id
        `, existing_plan);
            return Promise.resolve({
                code: 200,
                type: 'plan_created',
                plan_id: existing_plan.place_id
            });
        }
        catch (error) {
            return Promise.reject(error);
        }
    });
}
exports.updateExistingPlan = updateExistingPlan;
function deleteExistingPlan(plan_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const delete_result = yield accounts_db_1.accountsDb.query(`DELETE FROM plans WHERE plan_id = :plan_id`, { plan_id: plan_id });
            return Promise.resolve({
                code: 200,
                type: 'plan_deleted',
            });
        }
        catch (error) {
            return Promise.reject(error);
        }
    });
}
exports.deleteExistingPlan = deleteExistingPlan;
//# sourceMappingURL=manage-plan.service.js.map