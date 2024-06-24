"use strict"




const submitNewAccommodationForm = async () => {


    const new_accommodation = {
        place_id: document.getElementById('accommodationPlaceId')?.value || null,
        title: document.getElementById('accommodationTitle')?.value || null,
        title_internal: document.getElementById('accommodationTitleInternal')?.value || null,
        type: document.getElementById('accommodationType')?.value || null,

        location_details: {
            street: document.getElementById('accommodationLocationDetails_street')?.value || null,
            city: document.getElementById('accommodationLocationDetails_city')?.value || null,
            postal_code: document.getElementById('accommodationLocationDetails_postal_code')?.value || null,
            state: document.getElementById('accommodationLocationDetails_state')?.value || null,
            country: document.getElementById('accommodationLocationDetails_country')?.value || null,
        },

        accept_adults: true,
        accept_children: document.getElementById('accommodationAcceptChildren')?.checked ? true : false,
        accept_infants: document.getElementById('accommodationAcceptInfants')?.checked ? true : false
    };





    try {

        const response = await fetch('https://localhost:8080/api/accommodations/new', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ accommodation: new_accommodation, secretary: JSON.parse(localStorage.getItem('session_data')).secretariat_data })
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
