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
exports.IndexRoutes = void 0;
const utils_service_1 = require("../lib/utils.service");
class IndexRoutes {
    routes(app) {
        app.route('/')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if ((_b = (_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.account_id)
                return res.status(200).send({
                    message: 'You are successfully authenticated to use the system!',
                    user: req.session.user,
                    session: req.session,
                    hash: utils_service_1.utilsService.generateHash(req.query.hash.toString())
                });
            return res.status(200).send({
                message: 'Hi, you are unauthorized to have access in this system!',
                hash: utils_service_1.utilsService.generateHash(req.query.hash.toString())
            });
        }));
        app.route('/hash')
            .get((req, res) => {
            return res.status(200).send({
                hash: utils_service_1.utilsService.generateHash(req.query.h.toString())
            });
        });
    }
}
exports.IndexRoutes = IndexRoutes;
//# sourceMappingURL=index.js.map