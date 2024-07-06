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
exports.Secretariat = void 0;
const accounts_db_1 = require("../lib/connectors/db/accounts-db");
const registration_service_1 = require("../lib/registration.service");
const user_service_1 = require("../lib/user.service");
const config_1 = require("../config");
const utils_service_1 = require("../lib/utils.service");
const TravelAgent_1 = require("./TravelAgent");
const mailServer_1 = require("../lib/connectors/mailServer");
const ActivateAccountEmailTemplate_1 = require("../lib/email-templates/ActivateAccountEmailTemplate");
const Customer_1 = require("./Customer");
const manage_plan_service_1 = require("../lib/manage-plan.service");
class Secretariat {
    constructor(props) {
        this.account_id = (props === null || props === void 0 ? void 0 : props.account_id) || null;
        this.secretariat_id = (props === null || props === void 0 ? void 0 : props.secretariat_id) || null;
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
        this.office_hours = (props === null || props === void 0 ? void 0 : props.office_hours) || null;
        this.updated_at = (props === null || props === void 0 ? void 0 : props.updated_at) || null;
        this.created_at = (props === null || props === void 0 ? void 0 : props.created_at) || null;
        this.password = (props === null || props === void 0 ? void 0 : props.password) || null;
        this.username = (props === null || props === void 0 ? void 0 : props.username) || null;
    }
    register_customer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const new_customer = new Customer_1.Customer();
            yield new_customer.register(req, res);
        });
    }
    register_travel_agent(data, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const new_travel_agent = new TravelAgent_1.TravelAgent(data.new_travel_agent);
            if (!(new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.first_name) || !(new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.last_name) || !(new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.email)
                || !(new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.phone) || !(new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.password) || !(new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.username))
                return utils_service_1.utilsService.systemErrorHandler({ code: 400, type: 'bad_request', message: 'Credentials to register the user are missing' }, res);
            try {
                if (yield user_service_1.userExistsService.userExists({ username: new_travel_agent.username }))
                    return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'username_exists', message: 'Username already exists' }, res);
                if (yield user_service_1.userExistsService.userExists({ email: new_travel_agent.email }))
                    return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'email_exists', message: 'Email already exists' }, res);
                if (yield user_service_1.userExistsService.userExists({ phone: new_travel_agent.phone }))
                    return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'phone_exists', message: 'Phone already exists' }, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
            new_travel_agent.password = utils_service_1.utilsService.generateHash(new_travel_agent.password);
            try {
                new_travel_agent.account_id = utils_service_1.utilsService.generateId({ alphabet: config_1.config.nanoid_basic_alphabet, length: config_1.config.account_id_length });
                const account_insertion_result = yield accounts_db_1.accountsDb.query(`
                INSERT INTO
                    accounts
                SET
                    account_id = :account_id,
                    username = :username,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    phone = :phone,
                    password = :password,
                    account_type = 'travel_agent';
            `, new_travel_agent);
                const insert_travel_agent_result = yield accounts_db_1.accountsDb.query(`
                INSERT INTO
                    travel_agents
                SET
                    account_id = :account_id,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    phone = :phone,
                    ${(new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.date_of_birth) ? `date_of_birth = '${new_travel_agent.date_of_birth}',` : ``}
                    ${(new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.id_number) ? `id_number = '${new_travel_agent.id_number}',` : ``}
                    ${(new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.id_type) ? `id_type = '${new_travel_agent.id_type}',` : ``}
                    ${((_a = new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.place_of_residence) === null || _a === void 0 ? void 0 : _a.street) ? `place_of_residence__street = '${new_travel_agent.place_of_residence.street}',` : ``}
                    ${((_b = new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.place_of_residence) === null || _b === void 0 ? void 0 : _b.city) ? `place_of_residence__city = '${new_travel_agent.place_of_residence.city}',` : ``}
                    ${((_c = new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.place_of_residence) === null || _c === void 0 ? void 0 : _c.postal_code) ? `place_of_residence__postal_code = '${new_travel_agent.place_of_residence.postal_code}',` : ``}
                    ${((_d = new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.place_of_residence) === null || _d === void 0 ? void 0 : _d.state) ? `place_of_residence__state = '${new_travel_agent.place_of_residence.state}',` : ``}
                    ${((_e = new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.place_of_residence) === null || _e === void 0 ? void 0 : _e.country) ? `place_of_residence__country = '${new_travel_agent.place_of_residence.country}',` : ``}
                    ${((_f = new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.place_of_residence) === null || _f === void 0 ? void 0 : _f.longitude) ? `place_of_residence__longitude = ${new_travel_agent.place_of_residence.longitude},` : ``}
                    ${((_g = new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.place_of_residence) === null || _g === void 0 ? void 0 : _g.latitude) ? `place_of_residence__latitude = ${new_travel_agent.place_of_residence.latitude},` : ``}
                    ${(new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.start_date) ? `start_date = '${new_travel_agent.start_date}',` : ``}
                    ${((_h = new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.office_details) === null || _h === void 0 ? void 0 : _h.email) ? `office_details__email = '${new_travel_agent.office_details.email}',` : ``}
                    ${((_j = new_travel_agent === null || new_travel_agent === void 0 ? void 0 : new_travel_agent.office_details) === null || _j === void 0 ? void 0 : _j.phone) ? `office_details__phone = '${new_travel_agent.office_details.phone}',` : ``}
                    travel_agent_id = :travel_agent_id;
            `, Object.assign(Object.assign({}, new_travel_agent), { travel_agent_id: utils_service_1.utilsService.generateId({ alphabet: config_1.config.nanoid_basic_alphabet, length: config_1.config.travel_agent_id_length }) }));
                const activation_key = registration_service_1.generateAccountData.getWebToken({
                    account_id: new_travel_agent.account_id,
                    username: new_travel_agent.username,
                    email: new_travel_agent.email,
                    account_type: 'travel_agent',
                    type: 'activation_key'
                });
                const emailId = yield mailServer_1.mailServer.send_mail({
                    to: [new_travel_agent.email],
                    subject: 'Thank you for your register! Please activate your account!',
                    html: new ActivateAccountEmailTemplate_1.ActivateAccountEmailTemplate(activation_key).html
                });
                return res.status(200).send({ code: 200, type: 'new_travel_agent_registered', message: 'new_travel_agent_registered_successfully' });
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        });
    }
    register_secretary(data, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            const new_secretary = new Secretariat(data.new_secretary);
            if (!(new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.first_name) || !(new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.last_name) || !(new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.email) || !(new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.phone)
                || !(new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.password) || !(new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.username))
                return utils_service_1.utilsService.systemErrorHandler({ code: 400, type: 'bad_request', message: 'Credentials to register the user are missing' }, res);
            try {
                if (yield user_service_1.userExistsService.userExists({ username: new_secretary.username }))
                    return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'username_exists', message: 'Username already exists' }, res);
                if (yield user_service_1.userExistsService.userExists({ email: new_secretary.email }))
                    return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'email_exists', message: 'Email already exists' }, res);
                if (yield user_service_1.userExistsService.userExists({ phone: new_secretary.phone }))
                    return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'phone_exists', message: 'Phone already exists' }, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
            new_secretary.password = utils_service_1.utilsService.generateHash(new_secretary.password);
            try {
                new_secretary.account_id = utils_service_1.utilsService.generateId({ alphabet: config_1.config.nanoid_basic_alphabet, length: config_1.config.account_id_length });
                const account_insertion_result = yield accounts_db_1.accountsDb.query(`
                INSERT INTO
                    accounts
                SET
                    account_id = :account_id,
                    username = :username,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    phone = :phone,
                    password = :password,
                    account_type = 'secretariat';
            `, new_secretary);
                const insert_travel_agent_result = yield accounts_db_1.accountsDb.query(`
                INSERT INTO
                    secretariat
                SET
                    account_id = :account_id,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    phone = :phone,
                    ${(new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.date_of_birth) ? `date_of_birth = '${new_secretary.date_of_birth}',` : ``}
                    ${(new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.id_number) ? `id_number = '${new_secretary.id_number}',` : ``}
                    ${(new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.id_type) ? `id_type = '${new_secretary.id_type}',` : ``}
                    ${((_a = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.place_of_residence) === null || _a === void 0 ? void 0 : _a.street) ? `place_of_residence__street = '${new_secretary.place_of_residence.street}',` : ``}
                    ${((_b = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.place_of_residence) === null || _b === void 0 ? void 0 : _b.city) ? `place_of_residence__city = '${new_secretary.place_of_residence.city}',` : ``}
                    ${((_c = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.place_of_residence) === null || _c === void 0 ? void 0 : _c.postal_code) ? `place_of_residence__postal_code = '${new_secretary.place_of_residence.postal_code}',` : ``}
                    ${((_d = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.place_of_residence) === null || _d === void 0 ? void 0 : _d.state) ? `place_of_residence__state = '${new_secretary.place_of_residence.state}',` : ``}
                    ${((_e = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.place_of_residence) === null || _e === void 0 ? void 0 : _e.country) ? `place_of_residence__country = '${new_secretary.place_of_residence.country}',` : ``}
                    ${((_f = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.place_of_residence) === null || _f === void 0 ? void 0 : _f.longitude) ? `place_of_residence__longitude = ${new_secretary.place_of_residence.longitude},` : ``}
                    ${((_g = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.place_of_residence) === null || _g === void 0 ? void 0 : _g.latitude) ? `place_of_residence__latitude = ${new_secretary.place_of_residence.latitude},` : ``}
                    ${(new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.start_date) ? `start_date = '${new_secretary.start_date}',` : ``}
                    still_working = ${new_secretary.still_working ? 1 : 0},
                    ${((_h = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.office_hours) === null || _h === void 0 ? void 0 : _h.start_time) ? `office_hours__start_time = '${new_secretary.office_hours.start_time}',` : ``}
                    ${((_j = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.office_hours) === null || _j === void 0 ? void 0 : _j.end_time) ? `office_hours__end_time = '${new_secretary.office_hours.end_time}',` : ``}
                    ${((_k = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.office_details) === null || _k === void 0 ? void 0 : _k.email) ? `office_details__email = '${new_secretary.office_details.email}',` : ``}
                    ${((_l = new_secretary === null || new_secretary === void 0 ? void 0 : new_secretary.office_details) === null || _l === void 0 ? void 0 : _l.phone) ? `office_details__phone = '${new_secretary.office_details.phone}',` : ``}
                    secretariat_id = :secretariat_id
            `, Object.assign(Object.assign({}, new_secretary), { secretariat_id: utils_service_1.utilsService.generateId({ alphabet: config_1.config.nanoid_basic_alphabet, length: config_1.config.secretariat_id_length }) }));
                const activation_key = registration_service_1.generateAccountData.getWebToken({
                    account_id: new_secretary.account_id,
                    username: new_secretary.username,
                    email: new_secretary.email,
                    account_type: 'travel_agent',
                    type: 'activation_key'
                });
                const emailId = yield mailServer_1.mailServer.send_mail({
                    to: [new_secretary.email],
                    subject: 'Thank you for your register! Please activate your account!',
                    html: new ActivateAccountEmailTemplate_1.ActivateAccountEmailTemplate(activation_key).html
                });
                return res.status(200).send({ code: 200, type: 'new_secretary_registered', message: 'new_secretary_registered_successfully' });
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        });
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
    activate_secretary(data, req, res) {
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
    update_secretary() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
                    secretariat
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
                    office_hours__start_time = ${((_h = this === null || this === void 0 ? void 0 : this.office_hours) === null || _h === void 0 ? void 0 : _h.start_time) ? `'${this.office_hours.start_time}'` : `NULL`},
                    office_hours__end_time = ${((_j = this === null || this === void 0 ? void 0 : this.office_hours) === null || _j === void 0 ? void 0 : _j.end_time) ? `'${this.office_hours.end_time}'` : `NULL`},
                    office_details__email = ${((_k = this === null || this === void 0 ? void 0 : this.office_details) === null || _k === void 0 ? void 0 : _k.email) ? `'${this.office_details.email}'` : `NULL`},
                    office_details__phone = ${((_l = this === null || this === void 0 ? void 0 : this.office_details) === null || _l === void 0 ? void 0 : _l.phone) ? `'${this.office_details.phone}'` : `NULL`},
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
    delete_secretary() {
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
    newPlace(new_place) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(new_place === null || new_place === void 0 ? void 0 : new_place.country) || !(new_place === null || new_place === void 0 ? void 0 : new_place.city) || !(new_place === null || new_place === void 0 ? void 0 : new_place.postal_code) || !(new_place === null || new_place === void 0 ? void 0 : new_place.state))
                return Promise.resolve({ code: 400, type: 'missing_data' });
            try {
                new_place.place_id = utils_service_1.utilsService.generateId({ alphabet: config_1.config.nanoid_basic_alphabet, length: config_1.config.place_id_length });
                const insertion_result = yield accounts_db_1.accountsDb.query(`
                INSERT INTO
                    places
                SET
                    country = :country,
                    city = :city,
                    postal_code = :postal_code,
                    state = :state,
                    ${(new_place === null || new_place === void 0 ? void 0 : new_place.street) ? `street = '${new_place.street}',` : ``}
                    ${(new_place === null || new_place === void 0 ? void 0 : new_place.longitude) ? `longitude = '${new_place.longitude}',` : ``}
                    ${(new_place === null || new_place === void 0 ? void 0 : new_place.latitude) ? `latitude = '${new_place.latitude}',` : ``}
                    place_id = :place_id
            `, new_place);
                return Promise.resolve({ code: 200, type: 'new_place_inserted' });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    updateExistingPlace(existing_place) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(existing_place === null || existing_place === void 0 ? void 0 : existing_place.place_id) || !(existing_place === null || existing_place === void 0 ? void 0 : existing_place.country) || !(existing_place === null || existing_place === void 0 ? void 0 : existing_place.city) || !(existing_place === null || existing_place === void 0 ? void 0 : existing_place.postal_code) || !(existing_place === null || existing_place === void 0 ? void 0 : existing_place.state))
                return Promise.resolve({ code: 400, type: 'missing_data' });
            try {
                const update_result = yield accounts_db_1.accountsDb.query(`
                UPDATE
                    places
                SET
                    country = :country,
                    city = :city,
                    postal_code = :postal_code,
                    state = :state,
                    street = ${(existing_place === null || existing_place === void 0 ? void 0 : existing_place.street) ? `'${existing_place.street}'` : `NULL`},
                    longitude = ${(existing_place === null || existing_place === void 0 ? void 0 : existing_place.longitude) ? `'${existing_place.longitude}'` : `NULL`},
                    latitude = ${(existing_place === null || existing_place === void 0 ? void 0 : existing_place.latitude) ? `'${existing_place.latitude}'` : `NULL`},
                    place_id = :place_id
                WHERE
                    place_id = :place_id;
            `, existing_place);
                return Promise.resolve({ code: 200, type: 'place_updated' });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    deleteExistingPlace(place_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletion_result = yield accounts_db_1.accountsDb.query(`DELETE FROM places WHERE place_id = :place_id`, { place_id: place_id });
                return Promise.resolve({ code: 200, type: 'place_deleted' });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    addNewAccommodation(new_accommodation) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            if (!(new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.title) || !(new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.title) || !(new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.type) || !(new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.place_id))
                return Promise.resolve({ code: 400, type: 'missing_data' });
            try {
                new_accommodation.accommodation_id = utils_service_1.utilsService.generateId({ alphabet: config_1.config.nanoid_basic_alphabet, length: config_1.config.accommodation_id_length });
                const insertion_result = yield accounts_db_1.accountsDb.query(`
                INSERT INTO
                    accommodations
                SET
                    accommodation_id = :accommodation_id,
                    place_id = :place_id,
                    title = :title,
                    title_internal = :title_internal,
                    type = :type,
                    ${((_a = new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.location_details) === null || _a === void 0 ? void 0 : _a.street) ? `location_details__street = '${new_accommodation.location_details.street}',` : ``}
                    ${((_b = new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.location_details) === null || _b === void 0 ? void 0 : _b.city) ? `location_details__city = '${new_accommodation.location_details.city}',` : ``}
                    ${((_c = new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.location_details) === null || _c === void 0 ? void 0 : _c.postal_code) ? `location_details__postal_code = '${new_accommodation.location_details.postal_code}',` : ``}
                    ${((_d = new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.location_details) === null || _d === void 0 ? void 0 : _d.state) ? `location_details__state = '${new_accommodation.location_details.state}',` : ``}
                    ${((_e = new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.location_details) === null || _e === void 0 ? void 0 : _e.country) ? `location_details__country = '${new_accommodation.location_details.country}',` : ``}
                    ${((_f = new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.location_details) === null || _f === void 0 ? void 0 : _f.longitude) ? `location_details__longitude = '${new_accommodation.location_details.longitude}',` : ``}
                    ${((_g = new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.location_details) === null || _g === void 0 ? void 0 : _g.latitude) ? `location_details__latitude = '${new_accommodation.location_details.latitude}',` : ``}
                    accept_adults = ${(new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.accept_adults) ? 1 : 0},
                    accept_children = ${(new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.accept_children) ? 1 : 0},
                    accept_infants = ${(new_accommodation === null || new_accommodation === void 0 ? void 0 : new_accommodation.accept_infants) ? 1 : 0};
            `, new_accommodation);
                return Promise.resolve({ code: 200, type: 'new_accommodation_inserted' });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    updateExistingAccommodation(existing_accommodation) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            if (!(existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.title) || !(existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.title) || !(existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.type) || !(existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.place_id))
                return Promise.resolve({ code: 400, type: 'missing_data' });
            try {
                existing_accommodation.accommodation_id = utils_service_1.utilsService.generateId({ alphabet: config_1.config.nanoid_basic_alphabet, length: config_1.config.accommodation_id_length });
                const insertion_result = yield accounts_db_1.accountsDb.query(`
                UPDATE
                    accommodations
                SET
                    accommodation_id = :accommodation_id,
                    title = :title,
                    title_internal = :title_internal,
                    type = :type,
                    location_details__street = ${((_a = existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.location_details) === null || _a === void 0 ? void 0 : _a.street) ? `'${existing_accommodation.location_details.street}'` : `NULL`},
                    location_details__city = ${((_b = existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.location_details) === null || _b === void 0 ? void 0 : _b.city) ? `'${existing_accommodation.location_details.city}'` : `NULL`},
                    location_details__postal_code = ${((_c = existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.location_details) === null || _c === void 0 ? void 0 : _c.postal_code) ? `'${existing_accommodation.location_details.postal_code}'` : `NULL`},
                    location_details__state = ${((_d = existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.location_details) === null || _d === void 0 ? void 0 : _d.state) ? `'${existing_accommodation.location_details.state}'` : `NULL`},
                    location_details__country = ${((_e = existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.location_details) === null || _e === void 0 ? void 0 : _e.country) ? `'${existing_accommodation.location_details.country}'` : `NULL`},
                    location_details__longitude = ${((_f = existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.location_details) === null || _f === void 0 ? void 0 : _f.longitude) ? `${existing_accommodation.location_details.longitude}` : `NULL`},
                    location_details__latitude = ${((_g = existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.location_details) === null || _g === void 0 ? void 0 : _g.latitude) ? `${existing_accommodation.location_details.latitude}` : `NULL`},
                    accept_adults = ${(existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.accept_adults) ? 1 : 0},
                    accept_children = ${(existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.accept_children) ? 1 : 0},
                    accept_infants = ${(existing_accommodation === null || existing_accommodation === void 0 ? void 0 : existing_accommodation.accept_infants) ? 1 : 0}
                WHERE
                    accommodation_id = :accommodation_id
            `, existing_accommodation);
                return Promise.resolve({ code: 200, type: 'accommodation_updated' });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    deleteExistingAccommodation(accommodation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletion_result = yield accounts_db_1.accountsDb.query(`DELETE FROM accommodations WHERE accommodation_id = :accommodation_id`, { accommodation_id: accommodation_id });
                return Promise.resolve({ code: 200, type: 'accommodation_deleted' });
            }
            catch (error) {
                return Promise.reject(error);
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
                    secretary_id = :secretary_id,
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
    bookPlanForCustomer(booking_details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const insertion_result = yield accounts_db_1.accountsDb.query(`
                INSERT INTO
                    bookings
                SET
                    booking_id = :booking_id,
                    plan_id = :plan_id,
                    customer_id = :customer_id,
                    booking_dates_start = :booking_dates_start,
                    booking_dates_end = :booking_dates_end,
                    card_number = :card_number;
            `, booking_details);
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
exports.Secretariat = Secretariat;
//# sourceMappingURL=Secretariat.js.map