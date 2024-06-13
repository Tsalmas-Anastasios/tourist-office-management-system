const deletePlan = async (plan_id) => {

    try {

        const response = await fetch(`https://api.st.tsalmas.com/api/plans/p/${plan_id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ user: JSON.parse(localStorage.getItem('session_data')).user })
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

}