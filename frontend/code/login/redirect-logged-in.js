"use strict"


const session_data = JSON.parse(localStorage.getItem('session_data'));

if (session_data?.user?.account_id)
    window.location.href = '../../index.html';