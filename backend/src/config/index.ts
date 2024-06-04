require('dotenv').config();


class Config {

    public nanoid_basic_alphabet: string;
    public nanoid_basic_length: number;

    public account_id_length: number;
    public customer_id_length: number;


    constructor() {

        // basic nanoid alphabet
        this.nanoid_basic_alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^*~-_=';
        this.nanoid_basic_length = 16;

        this.account_id_length = 14;
        this.customer_id_length = 14;

    }

}


export const config = new Config();
