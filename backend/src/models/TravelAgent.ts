export class TravelAgent {

    account_id?: string;
    travel_agent_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth?: string | Date;

    id_number?: string;
    id_type?: 'id_card' | 'passport';

    place_of_residence?: {
        street?: string;
        city?: string;
        postal_code?: string;
        state?: string;
        country?: string;
        longitude?: number;
        latitude?: number;
    };

    start_date?: string | Date;
    still_working?: boolean;

    office_details?: {
        email?: string;
        phone?: string;
    };


    // organized_plans: plan[]

    updated_at?: string | Date;
    created_at?: string | Date;

    constructor(props?: TravelAgent) {

        this.account_id = props?.account_id || null;
        this.travel_agent_id = props?.travel_agent_id || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.email = props?.email || null;
        this.phone = props?.phone || null;
        this.date_of_birth = props?.date_of_birth || null;
        this.id_number = props?.id_number || null;
        this.id_type = props?.id_type || null;

        this.place_of_residence = props?.place_of_residence || null;

        this.start_date = props?.start_date || null;
        this.still_working = props?.still_working ? true : false;

        this.office_details = props?.office_details || null;

        this.updated_at = props?.updated_at || null;
        this.created_at = props?.created_at || null;

    }

}
