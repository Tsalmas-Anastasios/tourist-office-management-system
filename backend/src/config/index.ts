require('dotenv').config();


class Config {

    public nanoid_basic_alphabet: string;
    public nanoid_basic_length: number;


    constructor() {

        // basic nanoid alphabet
        this.nanoid_basic_alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^*~-_=';
        this.nanoid_basic_length = 16;

    }

}


export const config = new Config();
