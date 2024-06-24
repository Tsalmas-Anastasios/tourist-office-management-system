"use strict"




const getBookings = async () => {

    const user = JSON.parse(localStorage.getItem('session_data'));


    try {

        const response = await fetch(`https://localhost:8080/api/bookings/cs/${user.user.account_id}`);
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
                                <a href="#" class="btn btn-primary" id="infoButtonBooking_${bookings_counter}">
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
        `;

        bookings_counter++;
    }




    return bookings_ui_string;


}






getBookings()
    .then((list) => createBookingsUiCardsList(list))
    .then((ui_string) => document.getElementById('bookings-list-area').innerHTML = ui_string)
    .catch((error) => document.getElementById('bookings-list-area').innerHTML = 'Προέκυψε κάποιο σφάλμα. Παρακαλώ δοκιμάστε ξανά αργότερα');
