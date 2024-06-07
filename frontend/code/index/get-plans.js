const getPlans = async () => {

    try {
        const response = await fetch('https://localhost:8080/api/plans');
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

                            <div class="row mt-2">
                                <div class="col-12 text-muted text-end">
                                    έως ${plan.persons} άτομα
                                </div>
                            </div>
                        </div>
    
                    </div>
    
                </a>
    
    
    
                <div class="collapse" id="plan_collapse_object_${plans_counter}">
                    <div class="card card-body">
                        Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant
                        trigger.
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
