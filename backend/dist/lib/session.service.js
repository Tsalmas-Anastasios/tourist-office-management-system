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
exports.sessionDataGetService = void 0;
const accounts_db_1 = require("./connectors/db/accounts-db");
class SessionDataGetService {
    getSessionData(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const session_data = { session_id: null, expires: null, data: null };
            try {
                const result = yield accounts_db_1.accountsDb.query(`
                SELECT
                    *
                FROM
                    sessions
                WHERE
                    data LIKE '%{"account_id":":account_id",%'
                LIMIT 1;
            `, { account_id: account_id });
                if (result.rowsCount === 0)
                    return Promise.resolve(session_data);
                session_data.session_id = result.rows[0].sid.toString();
                session_data.expires = Number(result.rows[0].expires);
                session_data.data = JSON.parse(result.rows[0].data);
                return Promise.resolve(session_data);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.sessionDataGetService = new SessionDataGetService();
//# sourceMappingURL=session.service.js.map