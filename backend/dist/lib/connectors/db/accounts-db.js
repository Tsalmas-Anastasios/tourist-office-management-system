"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountsDb = exports.AccountsDBPool = void 0;
const mysql_ = require("mysql");
const accounts_1 = require("../../../config/db/accounts");
class AccountsDBPool {
    constructor() {
        this._mysql = mysql_;
        this.poolConfig = {
            connectionLimit: accounts_1.accountsDatabaseConfig.accounts_db.limit,
            host: accounts_1.accountsDatabaseConfig.accounts_db.host,
            user: accounts_1.accountsDatabaseConfig.accounts_db.user,
            password: accounts_1.accountsDatabaseConfig.accounts_db.password,
            database: accounts_1.accountsDatabaseConfig.accounts_db.database,
            multipleStatements: accounts_1.accountsDatabaseConfig.accounts_db.multipleStatements,
            charset: accounts_1.accountsDatabaseConfig.accounts_db.charset,
            supportBigNumbers: true,
            ssl: accounts_1.accountsDatabaseConfig.accounts_db.ssl,
            timezone: accounts_1.accountsDatabaseConfig.accounts_db.timezone || 'UTC',
        };
        this.pool = mysql_.createPool(this.poolConfig);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err)
                    return reject(err);
                connection.config.queryFormat = (sqlQuery, values) => {
                    if (!values)
                        return sqlQuery;
                    return sqlQuery.replace(/\:(\w+)/g, (txt, key) => {
                        if (values.hasOwnProperty(key))
                            return connection.escape(values[key]);
                        return txt;
                    });
                };
                connection.query(sql, args, (error, rows, fields) => {
                    connection.release();
                    if (error)
                        return reject(error);
                    return resolve({ rows: rows, rowsCount: (rows === null || rows === void 0 ? void 0 : rows.length) || 0, fields: fields });
                });
            });
        });
    }
}
exports.AccountsDBPool = AccountsDBPool;
exports.accountsDb = new AccountsDBPool();
//# sourceMappingURL=accounts-db.js.map