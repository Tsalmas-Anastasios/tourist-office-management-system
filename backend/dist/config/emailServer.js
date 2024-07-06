"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailServer = void 0;
class EmailServer {
    constructor() {
        this.accounts_email = {
            host: process.env.ACCOUNTS_EMAIL_HOST,
            port: process.env.ACCOUNTS_EMAIL_PORT,
            secure: process.env.ACCOUNTS_EMAIL_SECURE_CONNECTION,
            auth: {
                user: process.env.ACCOUNTS_EMAIL_AUTH_USER,
                password: process.env.ACCOUNTS_EMAIL_AUTH_PASSWORD,
            },
            defaults: {
                name: process.env.ACCOUNTS_EMAIL_DEFAULT_NAME,
                email: process.env.ACCOUNTS_EMAIL_DEFAULT_EMAIL,
            },
        };
    }
}
exports.emailServer = new EmailServer;
//# sourceMappingURL=emailServer.js.map