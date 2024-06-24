const deleteBookingCustomer = async (booking_id) => {

    Swal.fire({
        icon: 'question',
        title: 'Ακύρωση κράτησης',
        html: 'Είστε σίγουρος/-η ότι θέλετε να ακυρώσετε την κράτηση του πακέτου;',
        confirmButtonColor: '#cc0000',
        confirmButtonText: 'Ακύρωση πακέτου',
        showCancelButton: true,
        reverseButtons: true,
        focusCancel: true
    }).then(async (result) => {

        if (!result.isConfirmed)
            return;



        const account_id = JSON.parse(localStorage.getItem('session_data')).user.account_id;

        try {

            const response = await fetch(`https://api.st.tsalmas.com/api/bookings/cs/${account_id}/${booking_id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ user: JSON.parse(localStorage.getItem('session_data')) })
            });
            const dec_res = await response.json();


            if (dec_res?.code)
                if (dec_res.code === 200)
                    window.location.reload();
                else
                    throw new Error();
            else
                throw new Error();

        } catch (error) {
            toastr.error('Κάτι πήγε στραβά! Προσπαθήστε ξανά αργότερα');
            return;
        }

    });


}