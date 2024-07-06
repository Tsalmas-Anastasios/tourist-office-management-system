"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccountData = exports.registrationService = void 0;
const jwt = require("jsonwebtoken");
const config_1 = require("../config");
class RegistrationService {
    checkPassword(password) {
        const isUpperCase = new RegExp(/(?=.*[A-Z])/g);
        const isSpecialChar = new RegExp(/(?=.*[!@#$%^&*])/g);
        const isLowerCase = new RegExp(/(?=.*[a-z])/g);
        const isNumeric = new RegExp(/(?=.*[0-9])/g);
        if (password.match(isUpperCase) && password.match(isSpecialChar) && password.match(isLowerCase) && password.match(isNumeric))
            return true;
        return false;
    }
}
class GenerateData {
    getWebToken(data) {
        return jwt.sign({
            account_id: data.account_id,
            username: data.username,
            email: data.email,
            account_type: data.account_type,
            type: data.type
        }, config_1.config.SECRET_KEY_JWT);
    }
}
exports.registrationService = new RegistrationService();
exports.generateAccountData = new GenerateData();
//# sourceMappingURL=registration.service.js.map