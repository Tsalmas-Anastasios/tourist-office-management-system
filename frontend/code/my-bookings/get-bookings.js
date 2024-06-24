"use strict"




const getBookings = async () => {

    const user = JSON.parse(localStorage.getItem('session_data'));


    try {

        const response = await fetch(`https://api.st.tsalmas.com/api/bookings/cs/${user.user.account_id}`);
        const response_data = await (response.json());

        return response_data;

    } catch (error) {
        return [];
    }

}







const createBookingsUiCardsList = (bookings_list) => {


    let bookings_ui_string = '';


    let bookings_counter = 0;
    for (const booking of bookings_list) {
        bookings_ui_string += `
            <div class="col-12 col-sm-12 col-md-4 col-lg-3 pt-2 pb-2" id="booking_${bookings_counter}">

                <div class="card">
                    <div class="card-body">

                        <div class="row">
                            <div class="col-12">
                                <h4 class="card-title pb-0 mb-0">${booking.plan.title}</h4>
                            </div>
                            <div class="col-12 text-end">
                                <div class="badge text-bg-success">Πληρωμένο</div>
                            </div>
                        </div>

                        <h5 class="card-text">${booking.plan.small_description}</h5>
                        <p class="card-text">
                            ${booking.booking.booking_dates_start} - ${booking.booking.booking_dates_end}
                        </p>


                        <div class="row mt-4">
                            <div class="col-12 text-end">
                                <a href="#" class="btn btn-primary" id="infoButtonBooking_${bookings_counter}" data-bs-toggle="modal" data-bs-target="#bookingPlanDetailsModal_${bookings_counter}">
                                    <i class="fas fa-info-circle"></i>
                                    Πληροφορίες πακέτου
                                </a>
                            </div>
                            <div class="col-12 text-end mt-2">
                                <a href="#" class="btn btn-danger" id="deleteButtonBooking+${bookings_counter}" onclick="deleteBookingCustomer('${booking.booking.booking_id}')">
                                    <i class="fas fa-times-circle"></i>
                                    Ακύρωση πακέτου
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

            </div>





            <div class="modal fade" id="bookingPlanDetailsModal_${bookings_counter}" tabindex="-1" aria-labelledby="bookingPlanDetailsModal_${bookings_counter}Label" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">

                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="bookingPlanDetailsModal_${bookings_counter}Label">Πληροφορίες πακέτου</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>




                        <div class="modal-body">



                            <div class="row"> 

                                <div class="col-12 col-sm-12 col-md-4 col-lg-3">

                                    <label class="mb-0">Ελάχιστες μέρες</label>
                                    <p>${booking.plan?.min_days || `Μ/Δ`}</p>

                                </div>


                                <div class="col-12 col-sm-12 col-md-4 col-lg-3">

                                    <label class="mb-0">Μέγιστες μέρες</label>
                                    <p>${booking.plan?.max_days || `Μ/Δ`}</p>

                                </div>

                            </div>




                            <div class="row">

                                <div class="col-12">
                                    <h4>Περιγραφή πακέτου</h4>
                                    <p>${booking.plan.description}</p>
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
                                                                ${booking.plan.means_of_transport_arrival.type === 'airline' ? `
                                                                    <i class="fas fa-plane"></i>
                                                                    Αεροπορικό ταξίδι
                                                                ` : booking.plan.means_of_transport_arrival.type === 'ship' ? `
                                                                    <i class="fas fa-ship"></i>
                                                                    Ταξίδι με πλοίο
                                                                ` : booking.plan.means_of_transport_arrival.type === 'train' ? `
                                                                    <i class="fas fa-train"></i>
                                                                    Ταξίδι με τρένο
                                                                ` : booking.plan.means_of_transport_arrival.type === 'bus' ? `
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
                                                                <td>${booking.plan.means_of_transport_arrival.company_name}</td>
                                                            <tr>

                                                            <tr>
                                                                <td><strong>Αριθμός ταξιδιού</strong></td>
                                                                <td>${booking.plan.means_of_transport_arrival.number}</td>
                                                            <tr>

                                                            <tr>
                                                                <td><strong>Ώρα αναχώρησης</strong></td>
                                                                <td>${booking.plan.means_of_transport_arrival.start_time}</td>
                                                            <tr>

                                                            <tr>
                                                                <td><strong>Ώρα άφιξης</strong></td>
                                                                <td>${booking.plan.means_of_transport_arrival.arrival_time}</td>
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
                                                                ${booking.plan.means_of_transport_return.type === 'airline' ? `
                                                                    <i class="fas fa-plane"></i>
                                                                    Αεροπορικό ταξίδι
                                                                ` : booking.plan.means_of_transport_return.type === 'ship' ? `
                                                                    <i class="fas fa-ship"></i>
                                                                    Ταξίδι με πλοίο
                                                                ` : booking.plan.means_of_transport_return.type === 'train' ? `
                                                                    <i class="fas fa-train"></i>
                                                                    Ταξίδι με τρένο
                                                                ` : booking.plan.means_of_transport_return.type === 'bus' ? `
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
                                                                <td>${booking.plan.means_of_transport_return.company_name}</td>
                                                            <tr>

                                                            <tr>
                                                                <td><strong>Αριθμός ταξιδιού</strong></td>
                                                                <td>${booking.plan.means_of_transport_return.number}</td>
                                                            <tr>

                                                            <tr>
                                                                <td><strong>Ώρα αναχώρησης</strong></td>
                                                                <td>${booking.plan.means_of_transport_return.start_time}</td>
                                                            <tr>

                                                            <tr>
                                                                <td><strong>Ώρα άφιξης</strong></td>
                                                                <td>${booking.plan.means_of_transport_return.arrival_time}</td>
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
                                                                <td>${booking.plan?.place_details?.country || `Μ/Δ`}</td>
                                                            </tr>

                                                            <tr>
                                                                <td><strong>Πόλη</strong></td>
                                                                <td>${booking.plan?.place_details?.city || `Μ/Δ`}</td>
                                                            </tr>

                                                            <tr>
                                                                <td><strong>State</strong></td>
                                                                <td>${booking.plan?.place_details?.state || `Μ/Δ`}</td>
                                                            </tr>

                                                            <tr>
                                                                <td><strong>Οδός</strong></td>
                                                                <td>${booking.plan?.place_details?.street || `Μ/Δ`}</td>
                                                            </tr>

                                                            <tr>
                                                                <td><strong>Ταχ. κώδικας</strong></td>
                                                                <td>${booking.plan?.place_details?.postal_code || `Μ/Δ`}</td>
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
                                                        ${booking.plan?.accommodation_details?.type ? booking.plan?.accommodation_details?.type === 'hotel' ? `
                                                            <i class="fas fa-hotel"></i>
                                                            Ξενοδοχείο
                                                        ` : booking.plan?.accommodation_details?.type === 'property' ? `
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
                                                                <td>${booking.plan?.accommodation_details?.title || `Μ/Δ`}</td>
                                                            </tr>

                                                            <tr>
                                                                <td><strong>Οδός</strong></td>
                                                                <td>${booking.plan?.accommodation_details?.location_details?.street || `Μ/Δ`}</td>
                                                            </tr>

                                                            <tr>
                                                                <td><strong>Ταχ. κώδικας</strong></td>
                                                                <td>${booking.plan?.accommodation_details?.location_details?.postal_code || `Μ/Δ`}</td>
                                                            </tr>

                                                            <tr>
                                                                <td><strong>Ενήλικες αποδεχτοί</strong></td>
                                                                <td>${booking.plan?.accommodation_details?.accept_adults ? `ΝΑΙ` : `ΟΧΙ`}</td>
                                                            </tr>

                                                            <tr>
                                                                <td><strong>Παιδιά αποδεχτά</strong></td>
                                                                <td>${booking.plan?.accommodation_details?.accept_children ? `ΝΑΙ` : `ΟΧΙ`}</td>
                                                            </tr>

                                                            <tr>
                                                                <td><strong>Βρέφη αποδεχτά</strong></td>
                                                                <td>${booking.plan?.accommodation_details?.accept_infants ? `ΝΑΙ` : `ΟΧΙ`}</td>
                                                            </tr>

                                                        </tbody>
                                                    </table>

                                                </div>


                                            </div>
                                        </div>


                                    </div>
                                </div>

                            </div>





                            ${booking.plan?.area_description ? `
                                <div class="row">

                                    <div class="col-12">
                                        <h5>Περιγραφή περιοχής</h5>
                                        <p>${booking.plan.area_description}</p>
                                    </div>

                                </div>
                            ` : ``}




                            ${booking.plan?.cancelation_policy ? `
                                <div class="row">

                                    <div class="col-12">
                                        <h5>Πολιτική ακύρωσης πακέτου</h5>
                                        <p>${booking.plan.cancelation_policy}</p>
                                    </div>

                                </div>
                            ` : ``}




                            ${booking.plan?.other_important_info ? `
                                <div class="row">

                                    <div class="col-12">
                                        <h5>Άλλες πληροφορίες</h5>
                                        <p>${booking.plan.other_important_info}</p>
                                    </div>

                                </div>
                            ` : ``}
                        

                        </div>

                    </div>
                </div>
            </div>
        `;

        bookings_counter++;
    }





    return bookings_ui_string;


}






getBookings()
    .then((list) => createBookingsUiCardsList(list))
    .then((ui_string) => document.getElementById('bookings-list-area').innerHTML = ui_string)
    .catch((error) => document.getElementById('bookings-list-area').innerHTML = 'Προέκυψε κάποιο σφάλμα. Παρακαλώ δοκιμάστε ξανά αργότερα');
