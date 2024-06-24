"use strict"





const getAccommodations = async () => {

    try {

        const response = await fetch('https://localhost:8080/api/accommodations');
        const accommodations_list = await response.json();

        return accommodations_list;

    } catch (error) {
        toastr.error('Κάτι πήγε στραβά, δοκιμάστε ξανά αργότερα');
        return;
    }

}






const createSelectUi = (accommodations_list) => {

    let ui_string = '';
    for (const accommodation of accommodations_list)
        ui_string += `<option value="${accommodation.accommodation_id}&${accommodation.place_id}">${accommodation.title} (${accommodation.title_internal})</option>`


    ui_string = `
        <select name="accommodationId" id="accommodationId" class="form-control" onchange="checkRequiredFieldsAccommodationForm();">
            <option value="" disabled selected>Επιλογή...</option>
            ${ui_string}
        </select>
    `;



    return ui_string;

}







getAccommodations()
    .then((accommodations_list) => createSelectUi(accommodations_list))
    .then((ui_string) => document.getElementById('accommodationListArea').innerHTML = ui_string)
    .catch((error) => toastr.error('Κάτι πήγε στραβά, δοκιμάστε ξανά αργότερα'));