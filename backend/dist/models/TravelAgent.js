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
exports.TravelAgent = void 0;
const accounts_db_1 = require("../lib/connectors/db/accounts-db");
const utils_service_1 = require("../lib/utils.service");
const user_service_1 = require("../lib/user.service");
const registration_service_1 = require("../lib/registration.service");
const manage_plan_service_1 = require("../lib/manage-plan.service");
const mailServer_1 = require("../lib/connectors/mailServer");
class TravelAgent {
    constructor(props) {
        this.account_id = (props === null || props === void 0 ? void 0 : props.account_id) || null;
        this.travel_agent_id = (props === null || props === void 0 ? void 0 : props.travel_agent_id) || null;
        this.first_name = (props === null || props === void 0 ? void 0 : props.first_name) || null;
        this.last_name = (props === null || props === void 0 ? void 0 : props.last_name) || null;
        this.email = (props === null || props === void 0 ? void 0 : props.email) || null;
        this.phone = (props === null || props === void 0 ? void 0 : props.phone) || null;
        this.date_of_birth = (props === null || props === void 0 ? void 0 : props.date_of_birth) || null;
        this.id_number = (props === null || props === void 0 ? void 0 : props.id_number) || null;
        this.id_type = (props === null || props === void 0 ? void 0 : props.id_type) || null;
        this.place_of_residence = (props === null || props === void 0 ? void 0 : props.place_of_residence) || null;
        this.start_date = (props === null || props === void 0 ? void 0 : props.start_date) || null;
        this.still_working = (props === null || props === void 0 ? void 0 : props.still_working) ? true : false;
        this.office_details = (props === null || props === void 0 ? void 0 : props.office_details) || null;
        this.updated_at = (props === null || props === void 0 ? void 0 : props.updated_at) || null;
        this.created_at = (props === null || props === void 0 ? void 0 : props.created_at) || null;
        this.password = (props === null || props === void 0 ? void 0 : props.password) || null;
        this.username = (props === null || props === void 0 ? void 0 : props.username) || null;
    }
    log_out(req, res) {
        try {
            req.session.destroy((err) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: err.message }, res);
                else
                    return res.status(200).send({ code: 200, status: '200 OK', message: 'Logout OK' });
            }));
        }
        catch (error) {
            return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: error.message }, res);
        }
    }
    activate_travel_agent(data, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield accounts_db_1.accountsDb.query(`UPDATE accounts SET activated = 1 WHERE account_id = :account_id`, { account_id: data.account_id });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    change_password(data, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.password.length < 8 || data.password.length > 20)
                return utils_service_1.utilsService.systemErrorHandler({ code: 402, type: 'password_out_of_range', message: 'Password length out of range' }, res);
            if (registration_service_1.registrationService.checkPassword(data.password))
                return utils_service_1.utilsService.systemErrorHandler({ code: 402, type: 'password_not_strength', message: `Password doesn't meet the criteria` }, res);
            try {
                const password_change_result = yield accounts_db_1.accountsDb.query(`UPDATE accounts SET password = :password WHERE account_id = :account_id`, { password: utils_service_1.utilsService.generateHash(data.password), account_id: data.account_id });
                return res.status(200).send({ code: 200, type: 'password_changed' });
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        });
    }
    update_travel_agent() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            if (!(this === null || this === void 0 ? void 0 : this.first_name) || !(this === null || this === void 0 ? void 0 : this.last_name) || !(this === null || this === void 0 ? void 0 : this.email) || !(this === null || this === void 0 ? void 0 : this.phone) || !(this === null || this === void 0 ? void 0 : this.username))
                return Promise.reject({ code: 400, type: 'bad_request', message: 'Credentials to register the user are missing' });
            try {
                if (yield user_service_1.userExistsService.userExists({ username: this.username }))
                    return Promise.reject({ code: 401, type: 'username_exists', message: 'Username already exists' });
                if (yield user_service_1.userExistsService.userExists({ email: this.email }))
                    return Promise.reject({ code: 401, type: 'email_exists', message: 'Email already exists' });
                if (yield user_service_1.userExistsService.userExists({ phone: this.phone }))
                    return Promise.reject({ code: 401, type: 'phone_exists', message: 'Phone already exists' });
            }
            catch (error) {
                return Promise.reject({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null });
            }
            try {
                const account_insertion_result = yield accounts_db_1.accountsDb.query(`
                UPDATE
                    accounts
                SET
                    username = :username,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    phone = :phone
                WHERE
                    account_id = :account_id
            `, this);
                const insert_travel_agent_result = yield accounts_db_1.accountsDb.query(`
                UPDATE
                    travel_agents
                SET
                    last_name = :last_name,
                    email = :email,
                    phone = :phone,
                    date_of_birth = ${(this === null || this === void 0 ? void 0 : this.date_of_birth) ? `'${this.date_of_birth}'` : `NULL`},
                    id_number = ${(this === null || this === void 0 ? void 0 : this.id_number) ? `'${this.id_number}'` : `NULL`},
                    id_type = ${(this === null || this === void 0 ? void 0 : this.id_type) ? `'${this.id_type}'` : `NULL`},
                    place_of_residence__street = ${((_a = this === null || this === void 0 ? void 0 : this.place_of_residence) === null || _a === void 0 ? void 0 : _a.street) ? `'${this.place_of_residence.street}'` : `NULL`},
                    place_of_residence__city = ${((_b = this === null || this === void 0 ? void 0 : this.place_of_residence) === null || _b === void 0 ? void 0 : _b.city) ? `'${this.place_of_residence.city}'` : `NULL`},
                    place_of_residence__postal_code = ${((_c = this === null || this === void 0 ? void 0 : this.place_of_residence) === null || _c === void 0 ? void 0 : _c.postal_code) ? `'${this.place_of_residence.postal_code}'` : `NULL`},
                    place_of_residence__state = ${((_d = this === null || this === void 0 ? void 0 : this.place_of_residence) === null || _d === void 0 ? void 0 : _d.state) ? `'${this.place_of_residence.state}'` : `NULL`},
                    place_of_residence__country = ${((_e = this === null || this === void 0 ? void 0 : this.place_of_residence) === null || _e === void 0 ? void 0 : _e.country) ? `'${this.place_of_residence.country}'` : `NULL`},
                    place_of_residence__longitude = ${((_f = this === null || this === void 0 ? void 0 : this.place_of_residence) === null || _f === void 0 ? void 0 : _f.longitude) ? `${this.place_of_residence.longitude}` : `NULL`},
                    place_of_residence__latitude = ${((_g = this === null || this === void 0 ? void 0 : this.place_of_residence) === null || _g === void 0 ? void 0 : _g.latitude) ? `${this.place_of_residence.latitude}` : `NULL`},
                    start_date = ${(this === null || this === void 0 ? void 0 : this.start_date) ? `'${this.start_date}'` : `NULL`},
                    still_working = ${this.still_working ? 1 : 0},
                    office_details__email = ${((_h = this === null || this === void 0 ? void 0 : this.office_details) === null || _h === void 0 ? void 0 : _h.email) ? `'${this.office_details.email}'` : `NULL`},
                    office_details__phone = ${((_j = this === null || this === void 0 ? void 0 : this.office_details) === null || _j === void 0 ? void 0 : _j.phone) ? `'${this.office_details.phone}'` : `NULL`},
                    first_name = :first_name
                WHERE
                    account_id = :account_id
            `, Object.assign({}, this));
            }
            catch (error) {
                return Promise.reject({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null });
            }
        });
    }
    delete_travel_agent() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const delete_result = yield accounts_db_1.accountsDb.query(`DELETE FROM accounts WHERE account_id = :account_id`, { account_id: this.account_id });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    createNewPLan(new_plan, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const insertion_result = yield (0, manage_plan_service_1.createNewPlan)(new_plan);
                if (insertion_result.code === 400)
                    return utils_service_1.utilsService.systemErrorHandler(insertion_result, res);
                return res.status(200).send(insertion_result);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        });
    }
    updateExistingPlan(existing_plan, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const insertion_result = yield (0, manage_plan_service_1.updateExistingPlan)(existing_plan);
                if (insertion_result.code === 400)
                    return utils_service_1.utilsService.systemErrorHandler(insertion_result, res);
                return res.status(200).send(insertion_result);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        });
    }
    deleteExistingPlan(plan_id, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletion_result = yield (0, manage_plan_service_1.deleteExistingPlan)(plan_id);
                return res.status(200).send(deletion_result);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        });
    }
    bookPlan(booking_details, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const insertion_result = yield accounts_db_1.accountsDb.query(`
                INSERT INTO
                    bookings
                SET
                    booking_id = :booking_id,
                    plan_id = :plan_id,
                    travel_agent_id = :travel_agent_id,
                    booking_dates_start = :booking_dates_start,
                    booking_dates_end = :booking_dates_end,
                    card_number = :card_number;
            `, booking_details);
                const emailId = yield mailServer_1.mailServer.send_mail({
                    to: [user.email],
                    subject: 'Booking successfully saved! | Tourist office',
                    html: 'Η κράτησή σας δημιουργήθηκε με επιτυχία! Θα λάβετε ενημερώσεις και πρόσθετες πληροφορίες για το ταξίδι σας, 5 μέρες πριν την αναχώρησή σας! Σας ευχαριστούμε που επιλέξατε εμάς για την δημιουργία του ταξιδιού σας!'
                });
                return Promise.resolve({ code: 200, type: 'booking_created' });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    deleteBookingSelf(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield accounts_db_1.accountsDb.query(`DELETE FROM bookings WHERE booking_id = :booking_id`, data);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.TravelAgent = TravelAgent;
//# sourceMappingURL=TravelAgent.js.map