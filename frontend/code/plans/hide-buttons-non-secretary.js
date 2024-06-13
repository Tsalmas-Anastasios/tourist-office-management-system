"use strict"



const check_remove_buttons_non_secretary_account_type = () => {

    const session_data = JSON.parse(localStorage.getItem('session_data'));


    if (session_data.user.account_type !== 'secretariat') {
        document.getElementById('addNewPlace').remove();
        document.getElementById('addNewAccommodation').remove();
    }



}



check_remove_buttons_non_secretary_account_type();
