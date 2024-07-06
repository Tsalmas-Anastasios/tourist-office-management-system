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
exports.InitializePassportLocalStrategy = void 0;
const passportLocalStrategy = require("passport-local");
const passport_1 = require("passport");
const bcrypt = require("bcrypt");
const stringValidator_service_1 = require("../stringValidator.service");
const accounts_db_1 = require("../connectors/db/accounts-db");
const models_1 = require("../../models");
class InitializePassportLocalStrategy {
    initPassport(app) {
        app.use(passport_1.default.initialize());
        app.use(passport_1.default.authenticate('session'));
        passport_1.default.use(new passportLocalStrategy.Strategy({ usernameField: 'username', passwordField: 'password' }, (username, password, result) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!username)
                    result(null, false);
                let find_user_query;
                if (stringValidator_service_1.stringValidator.isEmail(username))
                    find_user_query = `SELECT * FROM accounts WHERE email = '${username}'`;
                else
                    find_user_query = `SELECT * FROM accounts WHERE username = '${username}'`;
                const query_result = yield accounts_db_1.accountsDb.query(find_user_query);
                if (query_result.rowsCount <= 0)
                    result(null, false, {
                        code: 404,
                        type: 'user_not_found',
                        message: 'User doesn\'t exist yet'
                    });
                const tmp_user = new models_1.Account(query_result.rows[0]);
                if (!bcrypt.compareSync(password.toString(), tmp_user.password.toString()))
                    result(null, false, {
                        code: 400,
                        type: 'wrong_password',
                        message: 'The entered password is wrong'
                    });
                result(null, tmp_user);
            }
            catch (error) {
                result(error);
            }
        })));
        passport_1.default.serializeUser((req, user, result) => {
            result(null, user);
        });
        passport_1.default.deserializeUser((user, result) => __awaiter(this, void 0, void 0, function* () {
            const query_result = yield accounts_db_1.accountsDb.query(`SELECT * FROM accounts WHERE email = :email`, { email: user.email });
            if (query_result.rowsCount <= 0)
                result(null, false, {
                    code: 404,
                    type: 'user_not_found',
                    message: 'User doesn\'t exist yet'
                });
            result(null, new models_1.Account(query_result.rows[0]));
        }));
    }
}
exports.InitializePassportLocalStrategy = InitializePassportLocalStrategy;
//# sourceMappingURL=passport-local.service.js.map