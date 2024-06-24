"use strict"



const submitFormNewPlace = async () => {


    const new_place = {
        country: document.getElementById('placeCountry')?.value || null,
        city: document.getElementById('placeCity')?.value || null,
        postal_code: document.getElementById('placePostalCode')?.value || null,
        state: document.getElementById('placeState')?.value || null,
    };



    try {

        const response = await fetch('https://localhost:8080/api/places/new', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ place: new_place, secretary: JSON.parse(localStorage.getItem('session_data')).secretariat_data })
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
