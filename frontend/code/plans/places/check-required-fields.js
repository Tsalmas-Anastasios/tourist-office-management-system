"use strict"




const checkRequiredFieldsPlaceFormFields = () => {

    const fields = {
        country: document.getElementById('placeCountry')?.value || null,
        city: document.getElementById('placeCity')?.value || null,
        postalCode: document.getElementById('placePostalCode')?.value || null,
        state: document.getElementById('placeState')?.value || null,
    };



    let flag = false;
    for (const el_val of Object.values(fields))
        if (!el_val || el_val === null || el_val === '') {
            flag = true;
            break;
        }






    try {

        if (flag)
            throw new Error();


        document.getElementById('newPlaceCreationFormSubmit').disabled = false;

    } catch (error) {
        document.getElementById('newPlaceCreationFormSubmit').disabled = true;
        toastr.warning('Παρακαλώ συμπληρώστε πρώτα όλα τα απαραίτητα πεδία (*)');
        return;
    }

}