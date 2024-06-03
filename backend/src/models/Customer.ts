export class Customer {

    account_id?: string;
    customer_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    age?: number;
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


    // plans_history?: plans[]

    updated_at?: string | Date;
    created_at?: string | Date;


    constructor(props?: Customer) {

        this.account_id = props?.account_id || null;
        this.customer_id = props?.customer_id || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.email = props?.email || null;
        this.phone = props?.phone || null;
        this.age = props?.age || null;
        this.date_of_birth = props?.date_of_birth || null;
        this.id_number = props?.id_number || null;
        this.id_type = props?.id_type || null;

        this.place_of_residence = props?.place_of_residence || null;

        this.updated_at = props?.updated_at || null;
        this.created_at = props?.created_at || null;

    }


}
