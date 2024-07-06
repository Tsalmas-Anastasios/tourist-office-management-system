"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPasswordChangeEmailTemplate = void 0;
const config_1 = require("../../config");
class RequestPasswordChangeEmailTemplate {
    constructor(jwt) {
        this.html = `
            <!doctype html>
            <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Request password change</title>
                </head>



                <body>

                    <p>
                        You request to change the password.
                    </p>


                    <p>
                        Click the link bellow to define a new password:
                    </p>
                    <p>
                        <a href="${config_1.config.request_pwd_change}${jwt}">Click here!</a>
                    </p>

                </body>

            </html>
        `;
    }
}
exports.RequestPasswordChangeEmailTemplate = RequestPasswordChangeEmailTemplate;
//# sourceMappingURL=RequestPasswordChangeEmailTemplate.js.map