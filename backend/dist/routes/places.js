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
exports.PlacesRoutes = void 0;
const utils_service_1 = require("../lib/utils.service");
const models_1 = require("../models");
const accounts_db_1 = require("../lib/connectors/db/accounts-db");
class PlacesRoutes {
    routes(app) {
        app.route('/api/places')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const places_list = [];
            try {
                const result = yield accounts_db_1.accountsDb.query(`SELECT * FROM places`);
                for (const row of result.rows)
                    places_list.push(new models_1.Place(row));
                return res.status(200).send(places_list);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/places/new')
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const new_place = new models_1.Place(req.body.place);
            const secretary = new models_1.Secretariat(((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.secretary) || ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.secretary) || null);
            try {
                const response = yield secretary.newPlace(new_place);
                if (response.code === 200)
                    return res.status(200).send(response);
                return utils_service_1.utilsService.systemErrorHandler(response, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
        app.route('/api/places/pl/:place_id')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            const place_id = req.params.place_id.toString();
            try {
                const place_result = yield accounts_db_1.accountsDb.query(`SELECT * FROM places WHERE place_id = :place_id`, { place_id: place_id });
                if (place_result.rowsCount === 0)
                    return res.status(200).send(null);
                return res.status(200).send(place_result.rows[0]);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }))
            .put(utils_service_1.utilsService.checkAuthSecretary, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const existing_place = new models_1.Place(req.body);
            existing_place.place_id = req.params.place_id.toString();
            const secretary = new models_1.Secretariat(req.session.secretary);
            try {
                const response = yield secretary.updateExistingPlace(existing_place);
                if (response.code === 200)
                    return res.status(200).send(response);
                return utils_service_1.utilsService.systemErrorHandler(response, res);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }))
            .delete(utils_service_1.utilsService.checkAuthSecretary, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const place_id = req.params.place_id.toString();
            const secretary = new models_1.Secretariat(req.session.secretary);
            try {
                const response = yield secretary.deleteExistingPlace(place_id);
                return res.status(200).send(response);
            }
            catch (error) {
                return utils_service_1.utilsService.systemErrorHandler({ code: 500, type: 'internal_server_error', message: (error === null || error === void 0 ? void 0 : error.message) || null }, res);
            }
        }));
    }
}
exports.PlacesRoutes = PlacesRoutes;
//# sourceMappingURL=places.js.map