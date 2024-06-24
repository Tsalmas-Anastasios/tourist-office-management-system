"use strict"




const editPlanDetails = async (plan_id) => {

    try {

        const response = await fetch(`https://localhost:8080/api/plans/p/${plan_id}`);
        const plan_details = await response.json();





        // put the data in the input fields
        if (!plan_details?.plan_id)
            throw new Error();


        console.log(plan_details);


        document.getElementById('title').value = plan_details?.title || null;
        document.getElementById('internalTitle').value = plan_details?.title_internal || null;
        document.getElementById('price').value = plan_details?.price || null;
        document.getElementById('bookingType').value = plan_details?.booking_type || null;
        document.getElementById('category').value = plan_details?.category || null;
        document.getElementById('adults').value = plan_details?.adults || null;
        document.getElementById('children').value = plan_details?.children || null;
        document.getElementById('infants').value = plan_details?.infants || null;
        document.getElementById('smallDescription').value = plan_details?.small_description || null;
        document.getElementById('description').value = plan_details?.description || null;

        document.getElementById('minDays').value = plan_details?.min_days || null;
        document.getElementById('maxDays').value = plan_details?.max_days || null;
        document.getElementById('cancellationPolicy').value = plan_details?.cancelation_policy || null;
        document.getElementById('familyFriendly').checked = plan_details?.family_friendly ? true : false || true;
        document.getElementById('adultsOnly').checked = plan_details?.adults_only ? true : false;

        document.getElementById('areaDescription').value = plan_details.area_description;
        document.getElementById('otherImportantInfo').value = plan_details.other_important_info;

        // means of transport - arrival
        document.getElementById('meansOfTransportArrival_type').value = plan_details?.means_of_transport_arrival?.type || null;
        document.getElementById('meansOfTransportArrival_companyName').value = plan_details?.means_of_transport_arrival?.company_name || null;
        document.getElementById('meansOfTransportArrival_startTime').value = plan_details?.means_of_transport_arrival?.start_time || null;
        document.getElementById('meansOfTransportArrival_arrivalTime').value = plan_details?.means_of_transport_arrival?.arrival_time || null;
        document.getElementById('meansOfTransportArrival_number').value = plan_details?.means_of_transport_arrival?.number || null;

        // means of transport - return
        document.getElementById('meansOfTransportReturn_type').value = plan_details?.means_of_transport_return?.type || null;
        document.getElementById('meansOfTransportReturn_companyName').value = plan_details?.means_of_transport_return?.company_name || null;
        document.getElementById('meansOfTransportReturn_startTime').value = plan_details?.means_of_transport_return?.start_time || null;
        document.getElementById('meansOfTransportReturn_arrivalTime').value = plan_details?.means_of_transport_return?.arrival_time || null;
        document.getElementById('meansOfTransportReturn_number').value = plan_details?.means_of_transport_return?.number || null;

        document.getElementById('accommodationId').value = `${plan_details?.accommodation_id || null}&${plan_details?.place_id}`;

        document.getElementById('plan_id').value = plan_details.plan_id;


        // hide the creation button & show the edit button
        document.getElementById('planCreationFormSubmitButton').style.display = 'none';
        document.getElementById('planUpdateFormSubmitButton').style.display = 'block';

    } catch (error) {
        toastr.error('Κάτι πήγε στραβά, προσπαθήστε ξανά αργότερα!');
        return;
    }

}






// update existing plan
const updateExistingPlan = async () => {


    const plan_details = {

        plan_id: document.getElementById('plan_id').value,
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


    plan_details.persons = Number(plan_details.adults) + Number(plan_details.children) + Number(plan_details.infants);


    // update existing plan
    try {

        const response = await fetch(`https://localhost:8080/api/plans/p/${plan_details.plan_id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ plan: plan_details, user: JSON.parse(localStorage.getItem('session_data')) })
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
        toastr.error('Κάτι πήγε στραβά! Δοκιμάστε ξανά αργότερα');
        return;
    }


}