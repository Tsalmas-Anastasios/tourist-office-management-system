"use strict"



const check_session = () => {

    const session_data = JSON.parse(localStorage.getItem('session_data'));


    if (!session_data?.user?.account_id)
        window.location.href = '../login.html';


    if (session_data.user.account_type !== 'secretariat' && session_data.user.account_type !== 'travel_agent')
        document.getElementById('body').innerHTML = 'Δεν έχετε δικαιώματα χρήσης της συγκεκριμένης λειτουργίας';



}



check_session();
