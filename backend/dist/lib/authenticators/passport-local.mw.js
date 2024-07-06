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
exports.initializePassportLocalStrategy = void 0;
const passportLocalStrategy = require("passport-local");
const passport = require("passport");
const bcrypt = require("bcrypt");
const stringValidator_service_1 = require("../stringValidator.service");
const accounts_db_1 = require("../connectors/db/accounts-db");
const models_1 = require("../../models");
class InitializePassportLocalStrategy {
    initPassport(app) {
        passport.use(new passportLocalStrategy.Strategy({ usernameField: 'username', passwordField: 'password' }, (username, password, result) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!username || !password)
                    return result(null, false, { message: '403' });
                let find_user_query;
                if (stringValidator_service_1.stringValidator.isEmail(username))
                    find_user_query = `SELECT * FROM accounts WHERE email = '${username}'`;
                else
                    find_user_query = `SELECT * FROM accounts WHERE username = '${username}'`;
                const query_result = yield accounts_db_1.accountsDb.query(find_user_query);
                if (query_result.rowsCount <= 0)
                    return result(null, false, { message: '404' });
                const tmp_user = new models_1.Account(query_result.rows[0]);
                if (!(tmp_user === null || tmp_user === void 0 ? void 0 : tmp_user.activated))
                    return result(null, false, { message: '401' });
                if (!bcrypt.compareSync(password.toString(), tmp_user.password.toString()))
                    return result(null, false, { message: '400' });
                delete tmp_user.password;
                return result(null, tmp_user);
            }
            catch (error) {
                result(error);
            }
        })));
        passport.serializeUser((req, user, result) => {
            result(null, user);
        });
        passport.deserializeUser((user, result) => __awaiter(this, void 0, void 0, function* () {
            const query_result = yield accounts_db_1.accountsDb.query(`SELECT * FROM accounts WHERE email = :email`, { email: user.email });
            if (query_result.rowsCount <= 0)
                return result(null, false);
            result(null, new models_1.Account(query_result.rows[0]));
        }));
    }
}
exports.initializePassportLocalStrategy = new InitializePassportLocalStrategy();
//# sourceMappingURL=passport-local.mw.js.map