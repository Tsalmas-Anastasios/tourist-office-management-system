"use strict"



const submitFormNewPlan = async () => {


    const form_data = {

        title: document.getElementById('title').value,
        title_internal: document.getElementById('internalTitle').value,
        price: document.getElementById('price').value,
        booking_type: document.getElementById('bookingType').value,
        category: document.getElementById('category').value,
        persons: 0,
        adults: document.getElementById('adults')?.value || 1,
        children: document.getElementById('children')?.value || 0,
        infants: document.getElementById('infants')?.value || 0,
        small_description: document.getElementById('smallDescription').value,
        description: document.getElementById('description').value,

        min_days: document.getElementById('minDays').value,
        max_days: document.getElementById('maxDays').value,
        cancelation_policy: document.getElementById('cancellationPolicy').value,
        adults_only: document.getElementsByName('planTypeBooking').value === 'adults_only' ? true : false,
        family_friendly: document.getElementsByName('planTypeBooking').value === 'family_friendly' ? true : false,


        area_description: document.getElementById('areaDescription').value,
        other_important_info: document.getElementById('otherImportantInfo').value,


        means_of_transport_arrival: {
            type: document.getElementById('meansOfTransportArrival_type').value,
            company_name: document.getElementById('meansOfTransportArrival_companyName').value,
            start_time: document.getElementById('meansOfTransportArrival_startTime').value,
            arrival_time: document.getElementById('meansOfTransportArrival_arrivalTime').value,
            number: document.getElementById('meansOfTransportArrival_number').value,
        },

        means_of_transport_return: {
            type: document.getElementById('meansOfTransportReturn_type').value,
            company_name: document.getElementById('meansOfTransportReturn_companyName').value,
            start_time: document.getElementById('meansOfTransportReturn_startTime').value,
            arrival_time: document.getElementById('meansOfTransportReturn_arrivalTime').value,
            number: document.getElementById('meansOfTransportReturn_number').value,
        },

        place_id: document.getElementById('accommodationId').value.split('&')[1],
        accommodation_id: document.getElementById('accommodationId').value.split('&')[0]

    };



    form_data.persons = Number(form_data.adults) + Number(form_data.children) + Number(form_data.infants);




    // save new plan here
    try {

        const response = await fetch('https://api.st.tsalmas.com/api/plans/new', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ plan: form_data, user: JSON.parse(localStorage.getItem('session_data')) })
        });
        const dec_res = await response.json();




        if (dec_res?.code)
            if (dec_res.code === 200)
                window.location.reload();
            else
                throw new Error(dec_res);
        else
            throw new Error(dec_res);

    } catch (error) {
        console.log(error);
        toastr.error('Κάτι πήγε στραβά! Δοκιμάστε ξανά αργότερα!');
        return;
    }

}