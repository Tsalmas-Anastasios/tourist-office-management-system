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
exports.userExistsService = void 0;
const accounts_db_1 = require("./connectors/db/accounts-db");
class UserExistsService {
    userExists(user_data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let queryWhereClause = '';
                for (const key in user_data)
                    queryWhereClause += `AND ${key} = '${user_data[key]}'`;
                queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');
                const result = yield accounts_db_1.accountsDb.query(`SELECT account_id FROM accounts WHERE ${queryWhereClause};`);
                if (result.rowsCount === 0)
                    return Promise.resolve(false);
                return Promise.resolve(true);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.userExistsService = new UserExistsService();
//# sourceMappingURL=user.service.js.map