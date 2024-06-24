"use strict"



const createTravelAgent = async () => {


    const travel_agent_data = {
        first_name: document.getElementById('firstName')?.value || null,
        last_name: document.getElementById('lastName')?.value || null,
        email: document.getElementById('email')?.value || null,
        username: document.getElementById('username')?.value || null,
        password: document.getElementById('password')?.value || null,
        phone: document.getElementById('phone')?.value || null,
        date_of_birth: document.getElementById('dateOfBirth')?.value || null,
        id_number: document.getElementById('idNumber')?.value || null,
        id_type: document.getElementById('idType')?.value || null,

        place_of_residence: {
            street: document.getElementById('placeOfResidenceStreet')?.value || null,
            city: document.getElementById('placeOfResidenceCity')?.value || null,
            postal_code: document.getElementById('placeOfResidencePostalCode')?.value || null,
            state: document.getElementById('placeOfResidenceState')?.value || null,
            country: document.getElementById('placeOfResidenceCountry')?.value || null,
        },

        start_date: document.getElementById('startDate')?.value || null,

        office_details: {
            email: document.getElementById('officeDetailsEmail')?.value || null,
            phone: document.getElementById('officeDetailsPhone')?.value || null,
        }
    };





    try {

        const response = await fetch('https://localhost:8080/api/travel-agents/new', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ travel_agent: travel_agent_data, secretary: JSON.parse(localStorage.getItem('session_data')).secretariat_data })
        });
        const dec_res = await response.json();



        if (dec_res?.code)
            if (dec_res.code === 200)
                window.location.reload();
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





const checkRequiredFieldsTravelAgentForm = () => {


    const required_fields = {
        first_name: document.getElementById('firstName')?.value || null,
        last_name: document.getElementById('lastName')?.value || null,
        email: document.getElementById('email')?.value || null,
        username: document.getElementById('username')?.value || null,
        password: document.getElementById('password')?.value || null,
        confirm_password: document.getElementById('confirmPassword')?.value || null,
        phone: document.getElementById('phone')?.value || null,
    };



    let flag = false;
    for (const el_val of Object.values(required_fields))
        if (!el_val || el_val === '' || el_val === null) {
            flag = true;
            break;
        }




    try {

        if (flag)
            throw new Error('Συμπληρώστε όλα τα απαραίτητα πεδία πριν συνεχίσετε');

        if (required_fields.password !== required_fields.confirm_password)
            throw new Error('Οι κωδικοί πρόσβασης (κωδικός & επιβεβαίωση) δεν ταιριάζουν');



        document.getElementById('create-new-travel-agent-modal-button').disabled = false;

    } catch (error) {
        toastr.warning(error);
        document.getElementById('create-new-travel-agent-modal-button').disabled = true;
    }

}
