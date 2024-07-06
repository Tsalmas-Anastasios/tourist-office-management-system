"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringValidator = void 0;
require('dotenv').config();
class StringValidator {
    isEmail(text) {
        const emailRegExp = new RegExp(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/gm);
        return emailRegExp.test(text);
    }
    findDifferencesString(str1, str2) {
        let diff = '';
        let str1_counter = 0;
        str2.split('').forEach((val) => {
            if (val !== str1.charAt(str1_counter))
                diff += val;
            else
                str1_counter++;
        });
        return diff;
    }
}
exports.stringValidator = new StringValidator();
//# sourceMappingURL=stringValidator.service.js.map