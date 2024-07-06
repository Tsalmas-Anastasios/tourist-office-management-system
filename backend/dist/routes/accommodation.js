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
exports.AccommodationRoutes = void 0;
const utils_service_1 = require("../lib/utils.service");
const models_1 = require("../models");
const accounts_db_1 = require("../lib/connectors/db/accounts-db");
class AccommodationRoutes {
    routes(app) {
        app.route('/api/accommodations')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const accommodations_list = [];
            try {
                const result = yield accounts_db_1.accountsDb.query(`SELECT * FROM accommodations`);
                for (const row of result.rows)
                    accommodations_list.push(new models_1.Accommodation(Object.assign({ location_details: {
                            street: row['location_details__street'],
                            city: row['location_details__city'],
                            postal_code: row['location_details__postal_code'],
                            state: row['location_details__state'],
                            country: row['location_details__country'],
                            longitude: row['location_details__longitude'],
                            latitude: row['location_details__latitude']
                        } }, row)));
                return res.status(200).send(accommodations_list);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/accommodations/specific-list/:place_id')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const place_id = req.params.place_id.toString();
            const accommodations_list = [];
            try {
                const result = yield accounts_db_1.accountsDb.query(`SELECT * FROM accommodations WHERE place_id = :place_id`, { place_id: place_id });
                for (const row of result.rows)
                    accommodations_list.push(new models_1.Accommodation(Object.assign({ location_details: {
                            street: row['location_details__street'],
                            city: row['location_details__city'],
                            postal_code: row['location_details__postal_code'],
                            state: row['location_details__state'],
                            country: row['location_details__country'],
                            longitude: row['location_details__longitude'],
                            latitude: row['location_details__latitude']
                        } }, row)));
                return res.status(200).send(accommodations_list);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/accommodations/new')
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const new_accommodation = new models_1.Accommodation(req.body.accommodation);
            const secretary = new models_1.Secretariat(((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.secretary) || ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.secretary) || null);
            try {
                const response = yield secretary.addNewAccommodation(new_accommodation);
                if (response.code === 200)
                    return res.status(200).send(response);
                return utils_service_1.utilsService.systemErrorHandler(response, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/accommodations/acm/:accommodation_id')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const accommodation_id = req.params.accommodation_id.toString();
            try {
                const accommodation_result = yield accounts_db_1.accountsDb.query(`SELECT * FROM accommodations WHERE accommodation_id = :accommodation_id`, { accommodation_id: accommodation_id });
                if (accommodation_result.rowsCount === 0)
                    return res.status(200).send(null);
                return res.status(200).send(new models_1.Accommodation(Object.assign({ location_details: {
                        street: accommodation_result.rows[0]['location_details__street'],
                        city: accommodation_result.rows[0]['location_details__city'],
                        postal_code: accommodation_result.rows[0]['location_details__postal_code'],
                        state: accommodation_result.rows[0]['location_details__state'],
                        country: accommodation_result.rows[0]['location_details__country'],
                        longitude: accommodation_result.rows[0]['location_details__longitude'],
                        latitude: accommodation_result.rows[0]['location_details__latitude']
                    } }, accommodation_result.rows[0])));
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }))
            .put(utils_service_1.utilsService.checkAuthSecretary, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const existing_accommodation = new models_1.Accommodation(req.body);
            existing_accommodation.accommodation_id = req.params.accommodation_id.toString();
            const secretary = new models_1.Secretariat(req.session.secretary);
            try {
                const response = yield secretary.updateExistingAccommodation(existing_accommodation);
                if (response.code === 200)
                    return res.status(200).send(response);
                return utils_service_1.utilsService.systemErrorHandler(response, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }))
            .delete(utils_service_1.utilsService.checkAuthSecretary, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const accommodation_id = req.params.accommodation_id.toString();
            const secretary = new models_1.Secretariat(req.session.secretary);
            try {
                const response = yield secretary.deleteExistingAccommodation(accommodation_id);
                return res.status(200).send(response);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
    }
}
exports.AccommodationRoutes = AccommodationRoutes;
//# sourceMappingURL=accommodation.js.map