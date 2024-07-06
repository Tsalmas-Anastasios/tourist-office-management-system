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
exports.AuthRoutes = void 0;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const utils_service_1 = require("../lib/utils.service");
const models_1 = require("../models");
const accounts_db_1 = require("../lib/connectors/db/accounts-db");
const registration_service_1 = require("../lib/registration.service");
const stringValidator_service_1 = require("../lib/stringValidator.service");
const mailServer_1 = require("../lib/connectors/mailServer");
const RequestPasswordChangeEmailTemplate_1 = require("../lib/email-templates/RequestPasswordChangeEmailTemplate");
require('dotenv').config();
class AuthRoutes {
    routes(app) {
        app.route('/api/auth/login')
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            passport.authenticate('local', (error, user, options) => __awaiter(this, void 0, void 0, function* () {
                if (!(options === null || options === void 0 ? void 0 : options.message)) {
                    if (user === null || user === void 0 ? void 0 : user.account_id) {
                        req.session.user = user;
                        req.session.created_at = utils_service_1.utilsService.moment().toDate();
                        if (req.session.user.account_type === 'secretariat') {
                            const secretariat_data = yield accounts_db_1.accountsDb.query(`SELECT * FROM secretariat WHERE account_id = :account_id;`, { account_id: req.session.user.account_id });
                            if (secretariat_data.rowsCount === 0)
                                return res.status(200).send({ user: req.session.user });
                            const secretary = new models_1.Secretariat(secretariat_data.rows[0]);
                            req.session.secretary = secretary;
                            return res.status(200).send({
                                user: req.session.user,
                                secretariat_data: secretary,
                            });
                        }
                        else if (req.session.user.account_type === 'travel_agent') {
                            const travel_agents_data = yield accounts_db_1.accountsDb.query(`SELECT * FROM travel_agents WHERE account_id = :account_id;`, { account_id: req.session.user.account_id });
                            if (travel_agents_data.rowsCount === 0)
                                return res.status(200).send({ user: req.session.user });
                            const travel_agent = new models_1.TravelAgent(travel_agents_data.rows[0]);
                            req.session.travel_agent = travel_agent;
                            return res.status(200).send({
                                user: req.session.user,
                                travel_agent_data: travel_agent
                            });
                        }
                        else if (req.session.user.account_type === 'customer') {
                            const customers_data = yield accounts_db_1.accountsDb.query(`SELECT * FROM customers WHERE account_id = :account_id;`, { account_id: req.session.user.account_id });
                            if (customers_data.rowsCount === 0)
                                return res.status(200).send({ user: req.session.user });
                            const customer = new models_1.Customer(customers_data.rows[0]);
                            req.session.customer = customer;
                            return res.status(200).send({
                                user: req.session.user,
                                customer_data: customer
                            });
                        }
                        else
                            return res.status(200).send({
                                user: req.session.user,
                            });
                    }
                    return yield utils_service_1.utilsService.systemErrorHandler({
                        code: 404,
                        type: 'user_not_found',
                        message: 'User doesn\'t exist yet'
                    }, res);
                }
                const message_code = Number(options.message);
                if (message_code === 403)
                    return yield utils_service_1.utilsService.systemErrorHandler({
                        code: 403,
                        type: 'missing_credentials',
                        message: 'Username or password is missing'
                    }, res);
                else if (message_code === 404)
                    return yield utils_service_1.utilsService.systemErrorHandler({
                        code: 404,
                        type: 'user_not_found',
                        message: 'User doesn\'t exist yet'
                    }, res);
                else if (message_code === 401)
                    return yield utils_service_1.utilsService.systemErrorHandler({
                        code: 401,
                        type: 'user_not_activated',
                        message: 'User is not activated'
                    }, res);
                else if (message_code === 400)
                    return yield utils_service_1.utilsService.systemErrorHandler({
                        code: 400,
                        type: 'wrong_password',
                        message: 'Wrong password'
                    }, res);
                else
                    return yield utils_service_1.utilsService.systemErrorHandler({
                        code: 500,
                        type: 'undefined_error',
                        message: options.message
                    }, res);
            }))(req, res);
        }));
        app.route('/api/auth/register-customer')
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const new_customer = new models_1.Customer();
                return new_customer.register(req, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/auth/activate/:token')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const activation_token = req.params.token.toString();
            const token_data = jwt.decode(activation_token, { completed: true });
            if (token_data.type !== 'activation_key')
                return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'unauthorized', message: `The key isn't an activation token` }, res);
            const user_activated_result = yield accounts_db_1.accountsDb.query(`SELECT activated FROM accounts WHERE account_id = :account_id;`, { account_id: token_data.account_id });
            if (user_activated_result.rowsCount === 0)
                return utils_service_1.utilsService.systemErrorHandler({ code: 404, type: 'user_not_found', message: `The user didn't found to our system` }, res);
            const activated = Number(user_activated_result.rows[0].activated) ? true : false;
            if (activated)
                return utils_service_1.utilsService.systemErrorHandler({ code: 201, type: 'already_activated', message: 'This account (account email) has been already activated' }, res);
            if (token_data.account_type === 'customer')
                try {
                    const customer = new models_1.Customer();
                    yield customer.activate_customer({ account_id: token_data.account_id }, req, res);
                    return res.status(200).redirect(process.env.FRONTEND_LOGIN_PAGE);
                }
                catch (error) {
                    return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
                }
            else if (token_data.account_type === 'travel_agent')
                try {
                    const travel_agent = new models_1.TravelAgent();
                    yield travel_agent.activate_travel_agent({ account_id: token_data.account_id }, req, res);
                    return res.status(200).redirect(process.env.FRONTEND_LOGIN_PAGE);
                }
                catch (error) {
                    return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
                }
            else if (token_data.account_type === 'secretariat')
                try {
                    const secretariat = new models_1.Secretariat();
                    yield secretariat.activate_secretary({ account_id: token_data.account_id }, req, res);
                    return res.status(200).redirect(process.env.FRONTEND_LOGIN_PAGE);
                }
                catch (error) {
                    return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
                }
        }));
        app.route('/api/auth/request-new-password')
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_email = req.body.email;
            let account;
            try {
                let account_result;
                if (stringValidator_service_1.stringValidator.isEmail(user_email))
                    account_result = yield accounts_db_1.accountsDb.query('SELECT * FROM accounts WHERE email = :email', { email: user_email });
                else
                    account_result = yield accounts_db_1.accountsDb.query('SELECT * FROM accounts WHERE username = :username', { username: user_email });
                if (account_result.rowsCount === 0)
                    return utils_service_1.utilsService.systemErrorHandler({ code: 404, type: 'user_not_found' }, res);
                account = new models_1.Account(account_result.rows[0]);
                delete account.password;
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
            if (!(account === null || account === void 0 ? void 0 : account.account_id))
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error' }, res);
            const new_token = registration_service_1.generateAccountData.getWebToken({
                account_id: account.account_id,
                username: account.username,
                email: account.email,
                account_type: account.account_type,
                type: 'request_password_change'
            });
            try {
                const change_request_pwd_status_result = yield accounts_db_1.accountsDb.query(`UPDATE accounts SET request_password_change = 1 WHERE account_id = :account_id`, { account_id: account.account_id });
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
            const emailId = yield mailServer_1.mailServer.send_mail({
                to: [account.email],
                subject: 'Request password change',
                html: new RequestPasswordChangeEmailTemplate_1.RequestPasswordChangeEmailTemplate(jwt).html
            });
            return res.status(200).send({ code: 200, type: 'request_password_change_created' });
        }));
        app.route('/api/auth/change-password-validate/:token')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token.toString();
            const token_data = jwt.decode(token, { completed: true });
            if (!(token_data === null || token_data === void 0 ? void 0 : token_data.type) || token_data.type !== 'request_password_change')
                return utils_service_1.utilsService.systemErrorHandler({ code: 401, type: 'unauthorized', message: `The key isn't a request password token` }, res);
            try {
                const req_result = yield accounts_db_1.accountsDb.query(`SELECT request_password_change FROM accounts WHERE account_id = :account_id`, { account_id: (token_data === null || token_data === void 0 ? void 0 : token_data.account_id) || null });
                if (req_result.rowsCount === 0)
                    return utils_service_1.utilsService.systemErrorHandler({ code: 404, type: 'user_not_found' }, res);
                const req_status = req_result.rows[0].request_password_change ? true : false;
                if (!req_status)
                    return utils_service_1.utilsService.systemErrorHandler({ code: 404, type: 'request_not_found' }, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
            return res.status(200).send({
                code: 200,
                type: 'successful_key_validation',
                valid: true,
                account_id: token_data.account_id
            });
        }));
        app.route('/api/auth/change-password')
            .put((req, res) => __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            let account;
            try {
                const account_result = yield accounts_db_1.accountsDb.query('SELECT * FROM accounts WHERE account_id = :account_id', { account_id: params.account_id });
                if (account_result.rowsCount === 0)
                    return utils_service_1.utilsService.systemErrorHandler({ code: 404, type: 'user_not_found' }, res);
                account = new models_1.Account(account_result.rows[0]);
                delete account.password;
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
            if (account.account_type === 'customer') {
                const customer = new models_1.Customer();
                return customer.change_password({ account_id: account.account_id, password: account.password }, req, res);
            }
            else if (account.account_type === 'secretariat') {
                const secretary = new models_1.Secretariat();
                return secretary.change_password({ account_id: account.account_id, password: account.password }, req, res);
            }
            else if (account.account_type === 'travel_agent') {
                const travel_agent = new models_1.TravelAgent();
                return travel_agent.change_password({ account_id: account.account_id, password: account.password }, req, res);
            }
        }));
        app.route('/api/auth/logout')
            .post(utils_service_1.utilsService.checkAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user.account_type === 'customer') {
                const customer = new models_1.Customer();
                try {
                    return customer.log_out(req, res);
                }
                catch (error) {
                    return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
                }
            }
            else if (req.session.user.account_type === 'secretariat') {
                const secretary = new models_1.Secretariat();
                try {
                    return secretary.log_out(req, res);
                }
                catch (error) {
                    return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
                }
            }
            else if (req.session.user.account_type === 'travel_agent') {
                const travel_agent = new models_1.TravelAgent();
                try {
                    return travel_agent.log_out(req, res);
                }
                catch (error) {
                    return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
                }
            }
            else
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
        }));
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=auth.js.map