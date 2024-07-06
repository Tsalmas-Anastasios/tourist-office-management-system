"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanBooking = void 0;
const Customer_1 = require("./Customer");
const Secretariat_1 = require("./Secretariat");
const TravelAgent_1 = require("./TravelAgent");
class PlanBooking {
    constructor(props) {
        this.booking_id = (props === null || props === void 0 ? void 0 : props.booking_id) || null;
        this.plan_id = (props === null || props === void 0 ? void 0 : props.plan_id) || null;
        this.customer_id = (props === null || props === void 0 ? void 0 : props.customer_id) || null;
        this.secretary_id = (props === null || props === void 0 ? void 0 : props.secretary_id) || null;
        this.travel_agent_id = (props === null || props === void 0 ? void 0 : props.travel_agent_id) || null;
        this.main_customer = (props === null || props === void 0 ? void 0 : props.main_customer) || new Customer_1.Customer();
        this.secretary = (props === null || props === void 0 ? void 0 : props.secretary) || new Secretariat_1.Secretariat();
        this.travel_agent = (props === null || props === void 0 ? void 0 : props.travel_agent) || new TravelAgent_1.TravelAgent();
        this.booking_dates_start = (props === null || props === void 0 ? void 0 : props.booking_dates_start) || null;
        this.booking_dates_end = (props === null || props === void 0 ? void 0 : props.booking_dates_end) || null;
        this.paid = (props === null || props === void 0 ? void 0 : props.paid) ? true : false;
        this.card_number = (props === null || props === void 0 ? void 0 : props.card_number) || null;
    }
}
exports.PlanBooking = PlanBooking;
//# sourceMappingURL=Booking.js.map