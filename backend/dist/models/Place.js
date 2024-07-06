"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Place = void 0;
class Place {
    constructor(props) {
        this.place_id = (props === null || props === void 0 ? void 0 : props.place_id) || null;
        this.country = (props === null || props === void 0 ? void 0 : props.country) || null;
        this.city = (props === null || props === void 0 ? void 0 : props.city) || null;
        this.postal_code = (props === null || props === void 0 ? void 0 : props.postal_code) || null;
        this.state = (props === null || props === void 0 ? void 0 : props.state) || null;
        this.street = (props === null || props === void 0 ? void 0 : props.street) || null;
        this.longitude = (props === null || props === void 0 ? void 0 : props.longitude) || null;
        this.latitude = (props === null || props === void 0 ? void 0 : props.latitude) || null;
    }
}
exports.Place = Place;
//# sourceMappingURL=Place.js.map