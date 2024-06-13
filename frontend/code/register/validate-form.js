"use strict"




const checkRequiredFields = () => {


    const register_fields = {
        first_name: document.getElementById('first_name')?.value || null,
        last_name: document.getElementById('last_name')?.value || null,
        email: document.getElementById('email')?.value || null,
        phone: document.getElementById('phone')?.value || null,
        username: document.getElementById('username')?.value || null,
        password: document.getElementById('password')?.value || null,
        confirm_password: document.getElementById('confirm_password')?.value || null,
    };



    let flag = false;
    for (const el_val of Object.values(register_fields))
        if (!el_val || el_val === null || el_val === '') {
            flag = true;
            break;
        }





    try {

        if (flag)
            throw new Error('Συμπληρώστε όλα τα απαραίτητα πεδία πριν συνεχίσετε');

        if (register_fields.password !== register_fields.confirm_password)
            throw new Error('Οι κωδικοί πρόσβασης (κωδικός & επιβεβαίωση) δεν ταιριάζουν');



        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!pattern.test(register_fields.email))
            throw new Error('To email δεν είναι έγκυρο');


    } catch (error) {
        toastr.warning(error);
        return false;
    }



    return true;

}
