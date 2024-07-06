"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretsConfig = void 0;
require('dotenv').config();
class SecretsConfig {
    constructor() {
        this.google_oauth_login_client_id = process.env.GOOGLE_OAUTH_LOGIN_CLIENT_ID;
        this.google_oauth_login_client_secret = process.env.GOOGLE_OAUTH_LOGIN_CLIENT_SECRET;
    }
}
exports.secretsConfig = new SecretsConfig();
//# sourceMappingURL=secrets.js.map