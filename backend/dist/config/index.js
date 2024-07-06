"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require('dotenv').config();
class Config {
    constructor() {
        this.SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;
        this.nanoid_basic_alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_';
        this.nanoid_basic_length = 16;
        this.account_id_length = 14;
        this.customer_id_length = 14;
        this.travel_agent_id_length = 14;
        this.secretariat_id_length = 14;
        this.plan_id_length = 6;
        this.place_id_length = 14;
        this.accommodation_id_length = 14;
        this.booking_id_length = 14;
        this.activation_link = process.env.ACTIVATION_LINK;
        this.request_pwd_change = process.env.CHANGE_PWD_LINK;
    }
}
exports.config = new Config();
//# sourceMappingURL=index.js.map