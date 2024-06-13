"use strict"




const getPlacesList = async () => {

    try {

        const response = await fetch('https://api.st.tsalmas.com/api/places');
        const places_list = await response.json();



        return places_list;

    } catch (error) {
        toastr.error('Κάτι πήγε στραβά, δοκιμάστε ξανά αργότερα');
        return;
    }

}




const createSelectFieldPlacesUi = (places_list) => {

    let ui_string = '';
    for (const place of places_list)
        ui_string += `<option value="${place.place_id}">${place.city}, ${place.postal_code}, ${place.state} - ${place.country}</option>`


    ui_string = `
        <select name="accommodationPlaceId" id="accommodationPlaceId" class="form-control" onchange="checkRequiredFieldsAccommodationForm_check()">
            <option value="" disabled selected>Επιλογή...</option>
            ${ui_string}
        </select>
    `;



    return ui_string;

}




getPlacesList()
    .then((places_list) => createSelectFieldPlacesUi(places_list))
    .then((ui_string) => document.getElementById('accomodation-place-select-area').innerHTML = ui_string)
    .catch((error) => toastr.error('Κάτι πήγε στραβά, δοκιμάστε ξανά αργότερα'));