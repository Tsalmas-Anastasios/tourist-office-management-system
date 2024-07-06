"use strict"



const getPlans = async () => {
    try {
        const response = await fetch('https://api.st.tsalmas.com/api/plans');
        const response_data = await response.json();
        return response_data;
    } catch (error) {
        return [];
    }

}










const create_plans_ui = (plans_list) => {

    let plans_collapse_string = '';



    let plans_counter = 0;
    for (const plan of plans_list) {
        plans_collapse_string += `
            <div class="plan-collapse-area mt-4" id="collapse_area+${plans_counter}">
    
                <a class="p-3 d-block plan-collapse-button-open rounded" data-bs-toggle="collapse" href="#plan_collapse_object_${plans_counter}" role="button" aria-expanded="false"
                    aria-controls="plan_collapse_object_${plans_counter}">
    
    
                    <div class="d-flex justify-content-between">
    
                        <div>
                            <h3>
                                ${plan.title},
                                <small class="text-muted">
                                    ${plan.category}
                                </small>
                            </h3>
    
                            <h5>${plan.small_description}</h5>


                            <p class="text-muted">
                                ${plan?.adults_only ? `
                                    <i class="fas fa-user-alt"></i>
                                    Πακέτο για Ενήλικες
                                ` : plan?.family_friendly ? `
                                    <i class="fas fa-user-check"></i>
                                    Πακέτο φιλικό προς τις οικογένειες
                                ` : ``}
                            </p>

                            <small class="text-muted">
                                ${plan.booking_type === 'direct' ? `
                                    <i class="fas fa-check-circle"></i>
                                    Direct booking
                                ` : `
                                    <i class="fas fa-calendar-alt"></i>
                                    On request
                                `}
                            </small>
                        </div>
    
    
                        <div class="text-end">
                            ${plan.price} € / άτομο
                            ${plan?.discount?.enabled ? `
                                (${plan.discount.value}
                                ${plan.discount.type === 'fixed' ? '€' : '%'} OFF)
                            ` : ``}

                            <div class="row mt-2">
                                <div class="col-12 text-muted text-end">
                                    έως ${plan.persons} άτομα
                                </div>
                            </div>

                            <div class="row mt-2">
                                <div class="col-12">
                                    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#bookPlanCustomerModalAreaFormArea" onclick="parsePlanData('${plan.plan_id}')">
                                        Κράτηση!
                                    </button>
                                </div>
                            </div>
                        </div>
    
                    </div>
    
                </a>
    
    
    
                <div class="collapse" id="plan_collapse_object_${plans_counter}">
                    <div class="card card-body">
                    

                        <div class="row"> 

                            <div class="col-12 col-sm-12 col-md-4 col-lg-3">

                                <label class="mb-0">Ελάχιστες μέρες</label>
                                <p>${plan?.min_days || `Μ/Δ`}</p>

                            </div>


                            <div class="col-12 col-sm-12 col-md-4 col-lg-3">

                                <label class="mb-0">Μέγιστες μέρες</label>
                                <p>${plan?.max_days || `Μ/Δ`}</p>

                            </div>

                        </div>




                        <div class="row">

                            <div class="col-12">
                                <h4>Περιγραφή πακέτου</h4>
                                <p>${plan.description}</p>
                            </div>

                        </div>




                        <div class="row mt-4">

                            <div class="col-12 d-flex align-items-center">
                                <h4 class="me-2">Μετακίνηση</h4>
                                <small class="text-muted">Περιέχεται στο κόστος του πακέτου</small>
                            </div>


                            <div class="col-12 mt-3">
                                <div class="row">

                                
                                    <div class="col-12 col-sm-12 col-md-6 p-4">
                                        <div class="row">


                                            <div class="col-12 text-center">
                                                <h6 style="text-decoration: underline;">Άφιξη στον προορισμό</h6>
                                            </div>



                                            <div class="col-12">

                                                <div class="row">

                                                    <div class="col-12">
                                                        <strong>
                                                            ${plan.means_of_transport_arrival.type === 'airline' ? `
                                                                <i class="fas fa-plane"></i>
                                                                Αεροπορικό ταξίδι
                                                            ` : plan.means_of_transport_arrival.type === 'ship' ? `
                                                                <i class="fas fa-ship"></i>
                                                                Ταξίδι με πλοίο
                                                            ` : plan.means_of_transport_arrival.type === 'train' ? `
                                                                <i class="fas fa-train"></i>
                                                                Ταξίδι με τρένο
                                                            ` : plan.means_of_transport_arrival.type === 'bus' ? `
                                                                <i class="fas fa-bus"></i>
                                                                Ταξίδι με λεωφορείο
                                                            ` : ``}
                                                        </strong>
                                                    </div>

                                                </div>

                                            </div>



                                            <div class="col-12 mt-4">

                                                <!--
                                                    <label class="mb-1 d-block">
                                                        <strong>Πληροφορίες ταξιδιού</strong>
                                                    </label>
                                                -->


                                                <table class="table table-striped">
                                                    <tbody>

                                                        <tr>
                                                            <td><strong>Εταιρία</strong></td>
                                                            <td>${plan.means_of_transport_arrival.company_name}</td>
                                                        <tr>

                                                        <tr>
                                                            <td><strong>Αριθμός ταξιδιού</strong></td>
                                                            <td>${plan.means_of_transport_arrival.number}</td>
                                                        <tr>

                                                        <tr>
                                                            <td><strong>Ώρα αναχώρησης</strong></td>
                                                            <td>${plan.means_of_transport_arrival.start_time}</td>
                                                        <tr>

                                                        <tr>
                                                            <td><strong>Ώρα άφιξης</strong></td>
                                                            <td>${plan.means_of_transport_arrival.arrival_time}</td>
                                                        <tr>

                                                    </tbody>
                                                </table>

                                            </div>



                                        </div>
                                    </div>




                                    <div class="col-12 col-sm-12 col-md-6 p-4">
                                        <div class="row">


                                            <div class="col-12 text-center">
                                                <h6 style="text-decoration: underline;">Επιστροφή από τον προορισμό</h6>
                                            </div>



                                            <div class="col-12">

                                                <div class="row">

                                                    <div class="col-12">
                                                        <strong>
                                                            ${plan.means_of_transport_return.type === 'airline' ? `
                                                                <i class="fas fa-plane"></i>
                                                                Αεροπορικό ταξίδι
                                                            ` : plan.means_of_transport_return.type === 'ship' ? `
                                                                <i class="fas fa-ship"></i>
                                                                Ταξίδι με πλοίο
                                                            ` : plan.means_of_transport_return.type === 'train' ? `
                                                                <i class="fas fa-train"></i>
                                                                Ταξίδι με τρένο
                                                            ` : plan.means_of_transport_return.type === 'bus' ? `
                                                                <i class="fas fa-bus"></i>
                                                                Ταξίδι με λεωφορείο
                                                            ` : ``}
                                                        </strong>
                                                    </div>

                                                </div>

                                            </div>



                                            <div class="col-12 mt-4">

                                                <!--
                                                    <label class="mb-1 d-block">
                                                        <strong>Πληροφορίες ταξιδιού</strong>
                                                    </label>
                                                -->


                                                <table class="table table-striped">
                                                    <tbody>

                                                        <tr>
                                                            <td><strong>Εταιρία</strong></td>
                                                            <td>${plan.means_of_transport_return.company_name}</td>
                                                        <tr>

                                                        <tr>
                                                            <td><strong>Αριθμός ταξιδιού</strong></td>
                                                            <td>${plan.means_of_transport_return.number}</td>
                                                        <tr>

                                                        <tr>
                                                            <td><strong>Ώρα αναχώρησης</strong></td>
                                                            <td>${plan.means_of_transport_return.start_time}</td>
                                                        <tr>

                                                        <tr>
                                                            <td><strong>Ώρα άφιξης</strong></td>
                                                            <td>${plan.means_of_transport_return.arrival_time}</td>
                                                        <tr>

                                                    </tbody>
                                                </table>

                                            </div>



                                        </div>
                                    </div>



                                </div>


                            </div>

                        </div>






                        <div class="row mt-4">

                            <div class="col-12 d-flex align-items-center">
                                <h4 class="me-2">Διαμονή</h4>
                                <small class="text-muted">Περιέχεται στο κόστος του πακέτου</small>
                            </div>



                            <div class="col-12">
                                <div class="row">


                                    <div class="col-12 col-sm-12 col-md-6">
                                        <div class="row">


                                            <div class="col-12 text-center">
                                                <h6 style="text-decoration: underline;">Τοποθεσία</h6>
                                            </div>



                                            <div class="col-12">

                                                <table class="table table-striped">
                                                    <tbody>

                                                        <tr>
                                                            <td><strong>Χώρα</strong></td>
                                                            <td>${plan?.place_details?.country || `Μ/Δ`}</td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Πόλη</strong></td>
                                                            <td>${plan?.place_details?.city || `Μ/Δ`}</td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>State</strong></td>
                                                            <td>${plan?.place_details?.state || `Μ/Δ`}</td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Οδός</strong></td>
                                                            <td>${plan?.place_details?.street || `Μ/Δ`}</td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Ταχ. κώδικας</strong></td>
                                                            <td>${plan?.place_details?.postal_code || `Μ/Δ`}</td>
                                                        </tr>

                                                    </tbody>
                                                </table>

                                            </div>


                                        </div>
                                    </div>




                                    <div class="col-12 col-sm-12 col-md-6">
                                        <div class="row">


                                            <div class="col-12 d-flex align-items-center justify-content-center">
                                                <h6 style="text-decoration: underline;">Διαμονή</h6>
                                                <small class="text-muted ms-2">
                                                    ${plan?.accommodation_details?.type ? plan?.accommodation_details?.type === 'hotel' ? `
                                                        <i class="fas fa-hotel"></i>
                                                        Ξενοδοχείο
                                                    ` : plan?.accommodation_details?.type === 'property' ? `
                                                        <i class="fas fa-home"></i>
                                                        Bnb κατάλυμα
                                                    ` : `` : ``}
                                                </small>
                                            </div>



                                            <div class="col-12">

                                                <table class="table table-striped">
                                                    <tbody>

                                                        <tr>
                                                            <td><strong>Τίτλος</strong></td>
                                                            <td>${plan?.accommodation_details?.title || `Μ/Δ`}</td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Οδός</strong></td>
                                                            <td>${plan?.accommodation_details?.location_details?.street || `Μ/Δ`}</td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Ταχ. κώδικας</strong></td>
                                                            <td>${plan?.accommodation_details?.location_details?.postal_code || `Μ/Δ`}</td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Ενήλικες αποδεχτοί</strong></td>
                                                            <td>${plan?.accommodation_details?.accept_adults ? `ΝΑΙ` : `ΟΧΙ`}</td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Παιδιά αποδεχτά</strong></td>
                                                            <td>${plan?.accommodation_details?.accept_children ? `ΝΑΙ` : `ΟΧΙ`}</td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Βρέφη αποδεχτά</strong></td>
                                                            <td>${plan?.accommodation_details?.accept_infants ? `ΝΑΙ` : `ΟΧΙ`}</td>
                                                        </tr>

                                                    </tbody>
                                                </table>

                                            </div>


                                        </div>
                                    </div>


                                </div>
                            </div>

                        </div>





                        ${plan?.area_description ? `
                            <div class="row">

                                <div class="col-12">
                                    <h5>Περιγραφή περιοχής</h5>
                                    <p>${plan.area_description}</p>
                                </div>

                            </div>
                        ` : ``}




                        ${plan?.cancelation_policy ? `
                            <div class="row">

                                <div class="col-12">
                                    <h5>Πολιτική ακύρωσης πακέτου</h5>
                                    <p>${plan.cancelation_policy}</p>
                                </div>

                            </div>
                        ` : ``}




                        ${plan?.other_important_info ? `
                            <div class="row">

                                <div class="col-12">
                                    <h5>Άλλες πληροφορίες</h5>
                                    <p>${plan.other_important_info}</p>
                                </div>

                            </div>
                        ` : ``}
                    



                        <div class="row mt-5 mb-4 text-center">
                            <div class="col-12">
                                    
                                <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#bookPlanCustomerModalAreaFormArea" onclick="parsePlanData('${plan.plan_id}')">
                                    Κράτηση!
                                </button>

                            </div>
                        </div>
                    
                    </div>
                </div>
    
            </div>
        `;


        plans_counter++;
    }



    return plans_collapse_string;

}





const plans_collapse_string = getPlans()
    .then((list) => create_plans_ui(list))
    .then((string) => document.getElementById('plans-area').innerHTML = string)
    .catch((error) => document.getElementById('plans-area').innerHTML = 'Προέκυψε κάποιο σφάλμα. Παρακαλώ δοκιμάστε ξανά αργότερα');






const parsePlanData = async (plan_id) => {

    const plan_id_input = document.getElementById('plan_id');
    const error_message = {
        area: document.getElementById('error-message-area'),
        text: document.getElementById('error-message-text')
    };
    const form = {
        area: document.getElementById('booking-form-area')
    };
    const customer_data = {
        type: document.getElementById('customer-type'),
        id: document.getElementById('customer-id')
    };
    const book_now_modal_button = document.getElementById('book-now-modal-button');




    // check if the user exists
    let response_logged_in;
    try {

        const response = localStorage.getItem("session_data");
        response_logged_in = JSON.parse(response);

        if (!response_logged_in?.user?.account_id)
            throw new Error();

    } catch (error) {
        plan_id_input.value = 'no_user';

        error_message.area.style.display = 'block';
        error_message.text.innerHTML = 'Συνδεθείτε πρώτα πριν συνεχίσετε!';
        form.area.style.display = 'none';
        book_now_modal_button.style.display = 'none';

        return;
    }
    // check if the user exists



    error_message.area.style.display = 'nonw';
    error_message.text.innerHTML = '';
    form.area.style.display = 'block';
    book_now_modal_button.style.display = 'block';



    let plan;
    try {
        const response = await fetch(`https://api.st.tsalmas.com/api/plans/p/${plan_id}`);
        plan = await response.json();
    } catch (error) {
        return;
    }

    plan_id_input.value = plan.plan_id;


    customer_data.type.value = response_logged_in.user.account_type;

    if (customer_data.type.value === 'secretariat')
        customer_data.id.value = response_logged_in.secretariat_data.secretariat_id;
    else if (customer_data.type.value === 'travel_agent')
        customer_data.id.value = response_logged_in.travel_agent.travel_agent_id;
    else
        customer_data.id.value = response_logged_in.customer_data.customer_id;




    if (customer_data.type.value === 'secretariat') {

        let customers_list;
        try {

            const response = await fetch('https://api.st.tsalmas.com/api/customers');
            customers_list = await response.json();

        } catch (error) {
            toastr.error('Κάτι πήγε στραβά! Προσπαθήστε ξανά αργότερα');
            return;
        }



        let customers_list_string = '';
        for (const customer of customers_list)
            customers_list_string += `<option value="${customer.customer_id}">${customer.first_name} ${customer.last_name}</option>`



        document.getElementById('chooseSecretaryCustomerID_area').style.display = 'block';
        document.getElementById('chooseSecretaryCustomerID_area').innerHTML = `
            <div class="form-group">

                <label for="chooseSecretaryCustomerID" class="mb-0">
                    Για λογαριασμό πελάτη...
                </label>
                <select name="chooseSecretaryCustomerID" id="chooseSecretaryCustomerID" class="form-control" onchange="customerChoosement()">
                    <option value="" disabled selected>Επιλογή πελάτη...</option>
                    ${customers_list_string}
                </select>



                <div>
                    <small class="text-muted">
                        Αν δεν επιλεγεί πελάτης, η κράτηση γίνεται για τον συνδεδεμένο λογαριασμό και χρεώνεται σε αυτόν.
                    </small>
                </div>

            </div>
        `;

    } else {
        document.getElementById('chooseSecretaryCustomerID_area').style.display = 'none';
        document.getElementById('chooseSecretaryCustomerID_area').innerHTML = '';
    }

}







// secretary choose a customer on the form
const customerChoosement = () => {

    const customer_select_el = document.getElementById('chooseSecretaryCustomerID');
    document.getElementById('customer-type').value = 'customer';
    document.getElementById('customer-id').value = customer_select_el.value;



    return;

}
