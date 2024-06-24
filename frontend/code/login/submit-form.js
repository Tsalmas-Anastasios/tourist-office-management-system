"use strict"










const submitLoginForm = async () => {

    const form_data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    console.log(form_data);



    // send the request to logged in to the server
    try {

        const response = await fetch('https://api.st.tsalmas.com/api/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(form_data),
        });


        const r = await response.json();


        if (!r?.code) {
            localStorage.setItem("session_data", JSON.stringify(r));
            window.location.href = '../../index.html';
        } else              // handle the returned errors
            if (r.code === 400)
                toastr.error('Λανθασμένος κωδικός πρόσβασης');
            else if (r.code === 401)
                toastr.error('Ο χρήστης δεν έχει ενεργοποιηθεί');
            else if (r.code === 403 || r.code === 500)
                toastr.error('Λείπουν τα στοιχεία σύνδεσης');
            else if (r.code === 404)
                toastr.error('Δεν υπάρχει χρήστης με αυτα τα στοιχεία σύνδεσης');





    } catch (error) {
        // handle the returned errors
        console.log(error);
    }



}