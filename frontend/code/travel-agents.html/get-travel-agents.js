const getTravelAgents = async () => {


    try {

        const response = await fetch('https://api.st.tsalmas.com/api/travel-agents');
        const travel_agents_list = await response.json();
        console.log(travel_agents_list);

        return travel_agents_list;

    } catch (error) {
        toastr.error('Κάτι πήγε στραβά! Προσπαθήστε ξανά αργότερα!');
        return [];
    }


}




const createTravelAgentsUiList = (travel_agents_list) => {


    let ui_string = '';
    for (const travel_agent of travel_agents_list)
        ui_string += `
            <tr>
                <td>${travel_agent.first_name} ${travel_agent.last_name}</td>
                <td>${travel_agent.email}</td>
                <td>${travel_agent.phone}</td>
                <td class="text-center">${travel_agent?.still_working ? `ΝΑΙ` : `ΟΧΙ`}</td>
                <td class="text-center">
                    <a href="javascript:void(0);" class="text-danger" onclick="deleteTravelAgent('${travel_agent.account_id}');">
                        <i class="fas fa-trash"></i>
                    </a>
                </td>
            </tr>
        `;



    ui_string = `
        <table class="table table-striped">
                
            <thead>
                <tr>
                    <th class="text-center">Ονοματεπώνυμο</th>
                    <th class="text-center">Email</th>
                    <th class="text-center">Τηλέφωνο</th>
                    <th class="text-center">Δουλεύει ακόμα</th>
                    <th class="text-center">Quick actions</th>
                </tr>
            </thead>

            <tbody>
                ${ui_string}
            </tbody>

        </table>
    `;



    return ui_string;

}





const deleteTravelAgent = async (travel_agent_id) => {


    try {

        const response = await fetch(`https://api.st.tsalmas.com/api/travel-agents/t/${travel_agent_id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ user: JSON.parse(localStorage.getItem('session_data')).user }),
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
        toastr.error('Κάτι πήγε στραβά! Προσπαθήστε ξανά αργότερα!')
    }

}




getTravelAgents()
    .then((travel_agents_list) => createTravelAgentsUiList(travel_agents_list))
    .then((ui_string) => document.getElementById('travel-agents-list-area').innerHTML = ui_string)
    .catch(() => toastr.error('Κάτι πήγε στραβά! Προσπαθήστε ξανά αργότερα!'))
