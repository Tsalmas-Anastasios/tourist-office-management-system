"use strict"




const checkRequiredFieldsAccommodationForm = () => {

    const required_fields = {
        title: document.getElementById('title')?.value || null,
        internalTitle: document.getElementById('internalTitle')?.value || null,
        price: document.getElementById('price')?.value || null,
        category: document.getElementById('category')?.value || null,
        bookingType: document.getElementById('bookingType')?.value || null,
        smallDescription: document.getElementById('smallDescription')?.value || null,
        description: document.getElementById('description')?.value || null,
        minDays: document.getElementById('minDays')?.value || null,
        maxDays: document.getElementById('maxDays')?.value || null,
        meansOfTransportArrival_type: document.getElementById('meansOfTransportArrival_type')?.value || null,
        meansOfTransportArrival_companyName: document.getElementById('meansOfTransportArrival_companyName')?.value || null,
        meansOfTransportArrival_startTime: document.getElementById('meansOfTransportArrival_startTime')?.value || null,
        meansOfTransportArrival_arrivalTime: document.getElementById('meansOfTransportArrival_arrivalTime')?.value || null,
        meansOfTransportArrival_number: document.getElementById('meansOfTransportArrival_number')?.value || null,
        meansOfTransportReturn_type: document.getElementById('meansOfTransportReturn_type')?.value || null,
        meansOfTransportReturn_companyName: document.getElementById('meansOfTransportReturn_companyName')?.value || null,
        meansOfTransportReturn_startTime: document.getElementById('meansOfTransportReturn_startTime')?.value || null,
        meansOfTransportReturn_arrivalTime: document.getElementById('meansOfTransportReturn_arrivalTime')?.value || null,
        meansOfTransportReturn_number: document.getElementById('meansOfTransportReturn_number')?.value || null,
        accommodation: document.getElementById('accommodationId')?.value || null,
    };




    let flag = false;
    for (const el_val of Object.values(required_fields))
        if (!el_val || el_val === null || el_val === '') {
            flag = true;
            break;
        }





    try {

        if (flag)
            throw new Error();


        document.getElementById('planCreationFormSubmitButton').disabled = false;
        document.getElementById('planUpdateFormSubmitButton').disabled = false;

    } catch (error) {
        document.getElementById('planCreationFormSubmitButton').disabled = true;
        document.getElementById('planUpdateFormSubmitButton').disabled = true;
        toastr.warning('Παρακαλώ συμπληρώστε πρώτα όλα τα απαραίτητα πεδία (*)');
        return;
    }



}