"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const session = require("express-session");
const uuid_1 = require("uuid");
const cors = require("cors");
const morgan = require("morgan");
const https = require("https");
const expressMySqlSession = require("express-mysql-session");
const passport = require("passport");
require('dotenv').config();
const utils_service_1 = require("./lib/utils.service");
const accounts_db_1 = require("./lib/connectors/db/accounts-db");
const passport_local_mw_1 = require("./lib/authenticators/passport-local.mw");
const index_1 = require("./routes/index");
const auth_1 = require("./routes/auth");
const travel_agent_1 = require("./routes/travel-agent");
const customers_1 = require("./routes/customers");
const secretaries_1 = require("./routes/secretaries");
const plans_1 = require("./routes/plans");
const places_1 = require("./routes/places");
const accommodation_1 = require("./routes/accommodation");
const bookings_1 = require("./routes/bookings");
class App {
    constructor() {
        this.domains_list = [
            'http://localhost:4200',
            'http://127.0.0.1:5500',
        ];
        this.app = express();
        this.app.set('port', process.env.BACKEND_PORT);
        this.config();
        this.routes();
    }
    config() {
        this.app.use(express.json({ limit: '32mb' }));
        this.app.use(express.urlencoded({ extended: false, limit: '32mb' }));
        const mySQLSessionStore = expressMySqlSession(session);
        const sessionStore = new mySQLSessionStore({
            checkExpirationInterval: 900000,
            schema: {
                tableName: 'sessions',
                columnNames: {
                    session_id: 'sid',
                    expires: 'expires',
                    data: 'data'
                }
            }
        }, accounts_db_1.accountsDb._mysql.createPool(accounts_db_1.accountsDb.poolConfig));
        this.app.use(session({
            secret: process.env.SESSION_PUBLIC_KEY,
            name: 'tourist-office-management-system.sid',
            cookie: {
                httpOnly: true,
                secure: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
                sameSite: 'none',
            },
            saveUninitialized: false,
            resave: true,
            store: sessionStore,
            genid: (req) => (0, uuid_1.v4)()
        }));
        this.app.use(cors({
            origin: '*',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }));
        this.app.set('trust proxy', true);
        const accessLogStream = utils_service_1.utilsService.fs.createWriteStream(utils_service_1.utilsService.path.join(__dirname, 'access.log'), { flags: 'a' });
        this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: accessLogStream }));
        this.app.use(passport.initialize());
        this.app.use(passport.authenticate('session'));
        passport_local_mw_1.initializePassportLocalStrategy.initPassport(this.app);
        if (process.env.ENVIRONMENT_MODE === 'development') {
            const https_server = https.createServer({
                key: utils_service_1.utilsService.fs.readFileSync(utils_service_1.utilsService.path.join(__dirname, '/config/certs/server.key')),
                cert: utils_service_1.utilsService.fs.readFileSync(utils_service_1.utilsService.path.join(__dirname, '/config/certs/server.cert'))
            }, this.app);
            https_server.listen(this.app.get('port'), () => {
                console.log(`Tourist Office Management System - Copyright 20[2-9][0-9]`);
                console.log(`Server is running on port: ${this.app.get('port')} (https://localhost:${this.app.get('port')})`);
            });
        }
        else
            this.app.listen(this.app.get('port'), () => {
                console.log(`Tourist Office Management System - Copyright 20[2-9][0-9]`);
            });
    }
    routes() {
        new index_1.IndexRoutes().routes(this.app);
        new auth_1.AuthRoutes().routes(this.app);
        new travel_agent_1.TravelAgentManagementRoutes().routes(this.app);
        new customers_1.CustomerManagementRoutes().routes(this.app);
        new secretaries_1.SecretaryManagementRoutes().routes(this.app);
        new plans_1.PlansRoutes().routes(this.app);
        new places_1.PlacesRoutes().routes(this.app);
        new accommodation_1.AccommodationRoutes().routes(this.app);
        new bookings_1.BookingsRoutes().routes(this.app);
    }
}
const app = new App();
//# sourceMappingURL=app.js.map