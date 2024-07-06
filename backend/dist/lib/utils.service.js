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
exports.utilsService = void 0;
const nanoid_1 = require("nanoid");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const lodash = require("lodash");
const path = require("path");
const fs = require("fs");
const accounts_db_1 = require("./connectors/db/accounts-db");
require('dotenv').config();
class UtilsService {
    constructor() {
        this.moment = moment;
        this.lodash = lodash;
        this.path = path;
        this.fs = fs;
    }
    generateHash(value) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        return hash;
    }
    generateId(params) {
        const nanoid = (0, nanoid_1.customAlphabet)(params.alphabet, params.length);
        return nanoid();
    }
    checkAuth(req, res, next) {
        var _a, _b;
        if (!((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.account_id))
            return res.status(401).send({ code: 401, type: 'unauthorized', message: 'Please sign in' });
        next();
    }
    checkAuthSecretary(req, res, next) {
        var _a, _b;
        if (!((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.account_id))
            return res.status(401).send({ code: 401, type: 'unauthorized', message: 'Please sign in' });
        if (req.session.user.account_type !== 'secretariat')
            return res.status(401).send({ code: 401, type: 'unauthorized', message: 'Please sign in' });
        next();
    }
    systemErrorHandler(error_obj, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield accounts_db_1.accountsDb.query(`
                INSERT INTO
                    system_errors
                SET
                    error_code = :error_code,
                    error_metadata = :error_metadata;
            `, {
                    error_code: (error_obj === null || error_obj === void 0 ? void 0 : error_obj.code) ? Number(error_obj.code) : 500,
                    error_metadata: JSON.stringify(error_obj),
                });
            }
            catch (error) {
                if (process.env.ENVIRONMENT_MODE === 'development')
                    console.log(error);
                return res.status(500).send({
                    code: 500,
                    type: 'cannot_connect_to_the_db',
                    message: 'Cannot connect to the DB'
                });
            }
            if (process.env.ENVIRONMENT_MODE === 'development')
                console.log(error_obj);
            return res.status((error_obj === null || error_obj === void 0 ? void 0 : error_obj.code) ? Number(error_obj.code) : 500).send(error_obj);
        });
    }
}
exports.utilsService = new UtilsService();
//# sourceMappingURL=utils.service.js.map