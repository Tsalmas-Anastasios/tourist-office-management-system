"use_strict"




const checkRequiredFieldsAccommodationForm_check = () => {


    const form_fields = {
        place_id: document.getElementById('accommodationPlaceId')?.value || null,
        title: document.getElementById('accommodationTitle')?.value || null,
        title_internal: document.getElementById('accommodationTitleInternal')?.value || null,
        type: document.getElementById('accommodationType')?.value || null,
        location_details__street: document.getElementById('accommodationLocationDetails_street')?.value || null,
        location_details__city: document.getElementById('accommodationLocationDetails_city')?.value || null,
        location_details__postal_code: document.getElementById('accommodationLocationDetails_postal_code')?.value || null,
        location_details__state: document.getElementById('accommodationLocationDetails_state')?.value || null,
        location_details__country: document.getElementById('accommodationLocationDetails_country')?.value || null,
    };




    let flag = false;
    for (const field of Object.values(form_fields))
        if (!field || field === null || field === '') {
            flag = true;
            break;
        }






    try {

        if (flag)
            throw new Error();


        document.getElementById('newplanCreationFormSubmitButtonSubmit').disabled = false;

    } catch (error) {
        document.getElementById('newplanCreationFormSubmitButtonSubmit').disabled = true;
        toastr.warning('Παρακαλώ συμπληρώστε πρώτα όλα τα απαραίτητα πεδία (*)');
        return;
    }



}
