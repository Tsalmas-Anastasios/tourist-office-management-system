"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivateAccountEmailTemplate = void 0;
const config_1 = require("../../config");
class ActivateAccountEmailTemplate {
    constructor(jwt) {
        this.html = `
            <!doctype html>
            <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Account activation</title>
                </head>



                <body>

                    <p>
                        Welcome to the system! We are very pleased that you have decided to use our service to organize your trip.
                    </p>


                    <p>
                        Click the link bellow to activate your account:
                    </p>
                    <p>
                        <a href="${config_1.config.activation_link}${jwt}">Click here!</a>
                    </p>

                </body>

            </html>
        `;
    }
}
exports.ActivateAccountEmailTemplate = ActivateAccountEmailTemplate;
//# sourceMappingURL=ActivateAccountEmailTemplate.js.map