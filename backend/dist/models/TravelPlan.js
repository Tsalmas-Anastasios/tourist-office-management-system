"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelPlan = void 0;
class TravelPlan {
    constructor(props) {
        this.plan_id = (props === null || props === void 0 ? void 0 : props.plan_id) || null;
        this.title = (props === null || props === void 0 ? void 0 : props.title) || null;
        this.title_internal = (props === null || props === void 0 ? void 0 : props.title_internal) || null;
        this.price = (props === null || props === void 0 ? void 0 : props.price) || null;
        this.booking_type = (props === null || props === void 0 ? void 0 : props.booking_type) || null;
        this.category = (props === null || props === void 0 ? void 0 : props.category) || null;
        this.persons = (props === null || props === void 0 ? void 0 : props.persons) || 1;
        this.adults = (props === null || props === void 0 ? void 0 : props.adults) || 1;
        this.children = (props === null || props === void 0 ? void 0 : props.children) || 0;
        this.infants = (props === null || props === void 0 ? void 0 : props.infants) || 0;
        this.small_description = (props === null || props === void 0 ? void 0 : props.small_description) || null;
        this.description = (props === null || props === void 0 ? void 0 : props.description) || null;
        this.date_range = (props === null || props === void 0 ? void 0 : props.date_range) || [];
        this.start_date = (props === null || props === void 0 ? void 0 : props.start_date) || null;
        this.end_date = (props === null || props === void 0 ? void 0 : props.end_date) || null;
        this.min_days = (props === null || props === void 0 ? void 0 : props.min_days) || null;
        this.max_days = (props === null || props === void 0 ? void 0 : props.max_days) || null;
        this.cancelation_policy = (props === null || props === void 0 ? void 0 : props.cancelation_policy) || null;
        this.available = (props === null || props === void 0 ? void 0 : props.available) ? true : false;
        this.available_from_date = (props === null || props === void 0 ? void 0 : props.available_from_date) || null;
        this.available_until_date = (props === null || props === void 0 ? void 0 : props.available_until_date) || null;
        this.starting_type = (props === null || props === void 0 ? void 0 : props.starting_type) || null;
        this.adults_only = (props === null || props === void 0 ? void 0 : props.adults_only) ? true : false;
        this.family_friendly = (props === null || props === void 0 ? void 0 : props.family_friendly) ? true : false;
        this.area_description = (props === null || props === void 0 ? void 0 : props.area_description) || null;
        this.other_important_info = (props === null || props === void 0 ? void 0 : props.other_important_info) || null;
        this.means_of_transport_arrival = (props === null || props === void 0 ? void 0 : props.means_of_transport_arrival) || null;
        this.means_of_transport_return = (props === null || props === void 0 ? void 0 : props.means_of_transport_return) || null;
        this.place_id = (props === null || props === void 0 ? void 0 : props.place_id) || null;
        this.accommodation_id = (props === null || props === void 0 ? void 0 : props.accommodation_id) || null;
        this.discount = (props === null || props === void 0 ? void 0 : props.discount) || null;
        this.place_details = (props === null || props === void 0 ? void 0 : props.place_details) || null;
        this.accommodation_details = (props === null || props === void 0 ? void 0 : props.accommodation_details) || null;
    }
}
exports.TravelPlan = TravelPlan;
//# sourceMappingURL=TravelPlan.js.map