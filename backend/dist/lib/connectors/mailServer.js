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
exports.mailServer = void 0;
const nodemailer = require("nodemailer");
const emailServer_1 = require("../../config/emailServer");
require('dotenv').config();
class MailServer {
    send_mail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer.createTransport({
                    host: (data === null || data === void 0 ? void 0 : data.host) || process.env.ACCOUNTS_EMAIL_HOST,
                    port: (data === null || data === void 0 ? void 0 : data.port) || Number(process.env.ACCOUNTS_EMAIL_PORT),
                    secure: (data === null || data === void 0 ? void 0 : data.secure) || Number(process.env.ACCOUNTS_EMAIL_SECURE_CONNECTION) ? true : false,
                    auth: {
                        user: (data === null || data === void 0 ? void 0 : data.from_email) || emailServer_1.emailServer.accounts_email.auth.user,
                        pass: (data === null || data === void 0 ? void 0 : data.from_psswd) || emailServer_1.emailServer.accounts_email.auth.password,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                let from;
                if (data === null || data === void 0 ? void 0 : data.from_email)
                    if (data === null || data === void 0 ? void 0 : data.from_name)
                        from = `"${data.from_name}" <${data.from_email}>`;
                    else
                        from = `"${emailServer_1.emailServer.accounts_email.defaults.name}" <${data.from_email}>`;
                else
                    from = `"${emailServer_1.emailServer.accounts_email.defaults.name}" <${emailServer_1.emailServer.accounts_email.defaults.email}>`;
                const mail = yield transporter.sendMail({
                    from: from,
                    to: data.to,
                    cc: (data === null || data === void 0 ? void 0 : data.cc) ? data.cc : null,
                    bcc: (data === null || data === void 0 ? void 0 : data.bcc) ? data.bcc : null,
                    subject: data.subject,
                    text: (data === null || data === void 0 ? void 0 : data.text) ? data.text : null,
                    html: data.html
                });
                return Promise.resolve(mail.messageId);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
const mailServer = new MailServer();
exports.mailServer = mailServer;
//# sourceMappingURL=mailServer.js.map