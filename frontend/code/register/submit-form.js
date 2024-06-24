"use strict"




const submitRegisterCustomerForm = async () => {


    if (!checkRequiredFields())
        return;



    const register_fields = {
        first_name: document.getElementById('first_name')?.value || null,
        last_name: document.getElementById('last_name')?.value || null,
        email: document.getElementById('email')?.value || null,
        phone: document.getElementById('phone')?.value || null,
        username: document.getElementById('username')?.value || null,
        password: document.getElementById('password')?.value || null,
    };



    try {

        const response = await fetch('https://localhost:8080/api/auth/register-customer', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ customer: register_fields }),
        });
        const dec_res = await response.json();



        if (dec_res?.code)
            if (dec_res.code === 200)
                window.location.href = '../../please-activate-customer.html';
            else if (dec_res.code === 400)
                toastr.error('Λείπουν δεδομένα και δεν μπόρεσε να δημιουργηθεί νέος ταξιδιωτικός πράκτορας');
            else if (dec_res.code === 401)
                if (dec_res.type === 'username_exists')
                    toastr.error('Το username υπάρχει ήδη');
                else if (dec_res.type === 'email_exists')
                    toastr.error('Το email υπάρχει ήδη');
                else if (dec_res.type === 'phone_exists')
                    toastr.error('Το τηλέφωνο υπάρχει ήδη');
                else
                    throw new Error();
            else
                throw new Error();
        else
            throw new Error();

    } catch (error) {
        console.log(error);
        toastr.error('Κάτι πήγε στραβά! Δοκιμάστε ξανά αργότερα!');
    }

}
