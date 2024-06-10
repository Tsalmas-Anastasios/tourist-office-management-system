const validateForm = () => {

    const username = document.getElementById('username')?.value || '';
    const password = document.getElementById('password')?.value || '';
    const submit_btn = document.getElementById('submit-btn');


    if (username === '' || password === '')
        submit_btn.disabled = true;
    else
        submit_btn.disabled = false;

}