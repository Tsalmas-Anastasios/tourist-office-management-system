"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accommodation = void 0;
class Accommodation {
    constructor(props) {
        this.accommodation_id = (props === null || props === void 0 ? void 0 : props.accommodation_id) || null;
        this.place_id = (props === null || props === void 0 ? void 0 : props.place_id) || null;
        this.title = (props === null || props === void 0 ? void 0 : props.title) || null;
        this.title_internal = (props === null || props === void 0 ? void 0 : props.title_internal) || null;
        this.type = (props === null || props === void 0 ? void 0 : props.type) || null;
        this.location_details = (props === null || props === void 0 ? void 0 : props.location_details) || null;
        this.accept_adults = (props === null || props === void 0 ? void 0 : props.accept_adults) ? true : false;
        this.accept_children = (props === null || props === void 0 ? void 0 : props.accept_children) ? true : false;
        this.accept_infants = (props === null || props === void 0 ? void 0 : props.accept_infants) ? true : false;
    }
}
exports.Accommodation = Accommodation;
//# sourceMappingURL=Accommodation.js.map