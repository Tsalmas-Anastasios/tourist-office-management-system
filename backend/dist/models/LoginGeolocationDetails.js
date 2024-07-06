"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginGeolocationDetails = void 0;
class LoginGeolocationDetails {
    constructor(props) {
        this.login_id = (props === null || props === void 0 ? void 0 : props.login_id) || null;
        this.account_id = (props === null || props === void 0 ? void 0 : props.account_id) || null;
        this.session_id = (props === null || props === void 0 ? void 0 : props.session_id) || null;
        this.session_data = (props === null || props === void 0 ? void 0 : props.session_data) || null;
        this.ip_address = (props === null || props === void 0 ? void 0 : props.ip_address) || null;
        this.city = (props === null || props === void 0 ? void 0 : props.city) || null;
        this.city_geoname_id = (props === null || props === void 0 ? void 0 : props.city_geoname_id) || null;
        this.region = (props === null || props === void 0 ? void 0 : props.region) || null;
        this.region_iso_code = (props === null || props === void 0 ? void 0 : props.region_iso_code) || null;
        this.region_geoname_id = (props === null || props === void 0 ? void 0 : props.region_geoname_id) || null;
        this.country = (props === null || props === void 0 ? void 0 : props.country) || null;
        this.country_code = (props === null || props === void 0 ? void 0 : props.country_code) || null;
        this.country_geoname_id = (props === null || props === void 0 ? void 0 : props.country_geoname_id) || null;
        this.country_is_eu = (props === null || props === void 0 ? void 0 : props.country_is_eu) ? true : false;
        this.continent = (props === null || props === void 0 ? void 0 : props.continent) || null;
        this.continent_code = (props === null || props === void 0 ? void 0 : props.continent_code) || null;
        this.continent_geoname_id = (props === null || props === void 0 ? void 0 : props.continent_geoname_id) || null;
        this.longitude = (props === null || props === void 0 ? void 0 : props.longitude) || null;
        this.latitude = (props === null || props === void 0 ? void 0 : props.latitude) || null;
        this.security = (props === null || props === void 0 ? void 0 : props.security) || {
            is_vpn: false
        };
        this.timezone = (props === null || props === void 0 ? void 0 : props.timezone) || {
            name: null,
            abbreviation: null,
            gmt_offset: null,
            current_time: null,
            is_dst: false,
        };
        this.flag = (props === null || props === void 0 ? void 0 : props.flag) || {
            emoji: null,
            unicode: null,
            png: null,
            svg: null,
        };
        this.currency = (props === null || props === void 0 ? void 0 : props.currency) || {
            currency_name: null,
            currency_code: null,
        };
        this.connection = (props === null || props === void 0 ? void 0 : props.connection) || {
            autonomous_system_number: null,
            autonomous_system_organization: null,
            connection_type: null,
            isp_name: null,
            organization_name: null,
        };
    }
}
exports.LoginGeolocationDetails = LoginGeolocationDetails;
//# sourceMappingURL=LoginGeolocationDetails.js.map