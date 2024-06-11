"use strict"


const submitBookingForm = async () => {


    if (!checkRequiredFields()) {
        toastr.warning('Συμπληρώστε όλα τα πεδία της φόρμας πριν συνεχίσετε');
        return;
    }





    const form_request_data = {
        customer_type: document.getElementById('customer-type').value,
        plan_id: document.getElementById('plan_id').value,
        booking_dates_start: document.getElementById('departureDate').value,
        booking_dates_end: document.getElementById('returnDate').value,
        card_number: document.getElementById('cardNumber').value
    };


    if (form_request_data.customer_type === 'secretariat')
        form_request_data.secretary_id = document.getElementById('customer-id').value;
    else if (form_request_data.customer_type === 'travel_agent')
        form_request_data.travel_agent_id = document.getElementById('customer-id').value;
    else
        form_request_data.customer_id = document.getElementById('customer-id').value;




    // save the plan
    try {

        const booking = { booking: form_request_data };
        if (JSON.parse(localStorage.getItem('session_data')).user.account_type === 'secretariat'
            && form_request_data.customer_type === 'customer')
            booking.secretary = JSON.parse(localStorage.getItem('session_data')).secretariat;
        else
            booking.user = JSON.parse(localStorage.getItem('session_data')).user;



        const response = await fetch('https://localhost:8080/api/bookings/new', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(booking),
        });



        const object_response = await response.json();

        if (object_response.code === 500)
            throw new Error();



        toastr.success('Το πακέτο, κρατήθηκε με επιτυχία');

        document.forms.bookPlanCustomerModalAreaFormArea_formObject.reset();

    } catch (error) {
        toastr.error('Κάτι πήγε στραβά! Προσπαθήστε ξανά αργότερα');
    }

}




const checkRequiredFields = () => {

    const form_data = {
        plan_id: document.getElementById('plan_id')?.value || null,
        customer_type: document.getElementById('customer-type')?.value || null,
        customer_id: document.getElementById('customer-id')?.value || null,
        booking_dates_start: document.getElementById('departureDate')?.value || null,
        booking_dates_end: document.getElementById('returnDate')?.value || null,
        card_number: document.getElementById('cardNumber')?.value || null,
        cardExpireDate: document.getElementById('cardExpiredDate')?.value || null,
        card_cvv: document.getElementById('cardCVV')?.value || null
    };




    for (const element_value of Object.values(form_data))
        if (!element_value || element_value === null || element_value === '')
            return false;


    return true;


}