import { utilsService } from './utils.service';


class RegistrationService {


    checkPassword(password: string): boolean {

        const isUpperCase = new RegExp(/(?=.*[A-Z])/g);
        const isSpecialChar = new RegExp(/(?=.*[!@#$%^&*])/g);
        const isLowerCase = new RegExp(/(?=.*[a-z])/g);
        const isNumeric = new RegExp(/(?=.*[0-9])/g);


        if (password.match(isUpperCase) && password.match(isSpecialChar) && password.match(isLowerCase) && password.match(isNumeric))
            return true;

        return false;

    }


}



export const registrationService = new RegistrationService();
