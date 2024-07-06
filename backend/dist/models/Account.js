"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
class Account {
    constructor(props) {
        this.account_id = (props === null || props === void 0 ? void 0 : props.account_id) || null;
        this.username = (props === null || props === void 0 ? void 0 : props.username) || null;
        this.first_name = (props === null || props === void 0 ? void 0 : props.first_name) || null;
        this.last_name = (props === null || props === void 0 ? void 0 : props.last_name) || null;
        this.email = (props === null || props === void 0 ? void 0 : props.email) || null;
        this.phone = (props === null || props === void 0 ? void 0 : props.phone) || null;
        this.password = (props === null || props === void 0 ? void 0 : props.password) || null;
        this.account_type = (props === null || props === void 0 ? void 0 : props.account_type) || null;
        this.activated = (props === null || props === void 0 ? void 0 : props.activated) ? true : false;
        this.request_password_change = (props === null || props === void 0 ? void 0 : props.request_password_change) ? true : false;
        this.created_at = (props === null || props === void 0 ? void 0 : props.created_at) || null;
    }
}
exports.Account = Account;
//# sourceMappingURL=Account.js.map