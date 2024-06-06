import { config } from '../config';
import { TravelPlan } from '../models';
import { utilsService } from './utils.service';
import { accountsDb } from './connectors/db/accounts-db';






export async function createNewPlan(new_plan: TravelPlan): Promise<any> {

    if (!new_plan?.title || !new_plan?.title_internal || !new_plan?.price || !new_plan?.category
        || !new_plan?.small_description || !new_plan?.description || !new_plan?.date_range
        || !new_plan?.start_date || !new_plan?.end_date || !new_plan?.starting_type || !new_plan?.means_of_transport_arrival
        || !new_plan?.means_of_transport_return || !new_plan?.place_id || !new_plan?.accommodation_id)
        return Promise.resolve({ code: 400, type: 'bad_request', message: 'Data to create the plan are missing' });




    try {

        new_plan.plan_id = utilsService.generateId({ alphabet: config.nanoid_basic_alphabet, length: config.plan_id_length });
        const insertion_result = await accountsDb.query(`
            INSERT INTO
                plans
            SET
                plan_id = :plan_id,
                title = :title,
                title_internal = :title_internal,
                price = :price,
                ${new_plan?.booking_type ? `booking_type = '${new_plan.booking_type}',` : ``}
                category = :category,
                ${new_plan?.persons ? `persons = '${new_plan.persons}',` : ``}
                ${new_plan?.adults ? `adults = ${new_plan.adults},` : ``}
                ${new_plan?.children ? `children = ${new_plan.children},` : ``}
                ${new_plan?.infants ? `infants = ${new_plan.infants},` : ``}
                small_description = :small_description,
                description = :description,
                date_range = :date_range,
                start_date = :start_date,
                end_date = :end_date,
                ${new_plan?.min_days ? `min_days = ${new_plan.min_days},` : ``}
                ${new_plan?.max_days ? `max_days = ${new_plan.max_days},` : ``}
                ${new_plan?.cancelation_policy ? `cancelation_policy = '${new_plan.cancelation_policy}',` : ``}
                available = ${new_plan?.available ? 1 : 0},
                ${new_plan?.available_from_date ? `available_from_date = '${new_plan.available_from_date}',` : ``}
                ${new_plan?.available_until_date ? `available_until_date = '${new_plan.available_until_date}',` : ``}
                starting_type = :starting_type,
                adults_only = ${new_plan?.adults_only ? 1 : 0},
                family_friendly = ${new_plan?.family_friendly ? 1 : 0},
                ${new_plan?.area_description ? `area_description = '${new_plan.area_description}',` : ``}
                ${new_plan?.other_important_info ? `other_important_info = '${new_plan.other_important_info}',` : ``}
                ${new_plan?.means_of_transport_arrival.type ? `means_of_transport_arrival.type = '${new_plan.means_of_transport_arrival.type}',` : ``}
                ${new_plan?.means_of_transport_arrival.company_name ? `means_of_transport_arrival.company_name = '${new_plan.means_of_transport_arrival.company_name}',` : ``}
                ${new_plan?.means_of_transport_arrival.start_time ? `means_of_transport_arrival.start_time = '${new_plan.means_of_transport_arrival.start_time}',` : ``}
                ${new_plan?.means_of_transport_arrival.arrival_time ? `means_of_transport_arrival.arrival_time = '${new_plan.means_of_transport_arrival.arrival_time}',` : ``}
                ${new_plan?.means_of_transport_arrival.number ? `means_of_transport_arrival.number = '${new_plan.means_of_transport_arrival.number}',` : ``}
                ${new_plan?.means_of_transport_return.type ? `means_of_transport_return.type = '${new_plan.means_of_transport_return.type}',` : ``}
                ${new_plan?.means_of_transport_return.company_name ? `means_of_transport_return.company_name = '${new_plan.means_of_transport_return.company_name}',` : ``}
                ${new_plan?.means_of_transport_return.start_time ? `means_of_transport_return.start_time = '${new_plan.means_of_transport_return.start_time}',` : ``}
                ${new_plan?.means_of_transport_return.arrival_time ? `means_of_transport_return.arrival_time = '${new_plan.means_of_transport_return.arrival_time}',` : ``}
                ${new_plan?.means_of_transport_return.number ? `means_of_transport_return.number = '${new_plan.means_of_transport_return.number}',` : ``}
                ${new_plan?.discount?.code_type ? `discount.code_type = '${new_plan.discount.code_type}',` : ``}
                ${new_plan?.discount?.code_value ? `discount.code_value = '${new_plan.discount.code_value}',` : ``}
                discount.enabled = ${new_plan?.discount?.enabled ? 1 : 0},
                ${new_plan?.discount?.type ? `discount.type = '${new_plan.discount.type}',` : ``}
                ${new_plan?.discount?.value ? `discount.value = ${new_plan.discount.value},` : ``}
                place_id = :place_id,
                accommodation_id = :accommodation_id
        `, new_plan);




        return Promise.resolve({
            code: 200,
            type: 'plan_created',
            plan_id: new_plan.place_id
        });



    } catch (error) {
        return Promise.reject(error);
    }

}





export async function updateExistingPlan(existing_plan: TravelPlan): Promise<any> {

    if (!existing_plan?.title || !existing_plan?.title_internal || !existing_plan?.price || !existing_plan?.category
        || !existing_plan?.small_description || !existing_plan?.description || !existing_plan?.date_range
        || !existing_plan?.start_date || !existing_plan?.end_date || !existing_plan?.starting_type || !existing_plan?.means_of_transport_arrival
        || !existing_plan?.means_of_transport_return || !existing_plan?.place_id || !existing_plan?.accommodation_id)
        return Promise.resolve({ code: 400, type: 'bad_request', message: 'Data to create the plan are missing' });




    try {

        const update_result = await accountsDb.query(`
            UPDATE
                plans
            SET
                title = :title,
                title_internal = :title_internal,
                price = :price,
                ${existing_plan?.booking_type ? `booking_type = '${existing_plan.booking_type}',` : ``}
                category = :category,
                ${existing_plan?.persons ? `persons = '${existing_plan.persons}',` : ``}
                ${existing_plan?.adults ? `adults = ${existing_plan.adults},` : ``}
                ${existing_plan?.children ? `children = ${existing_plan.children},` : ``}
                ${existing_plan?.infants ? `infants = ${existing_plan.infants},` : ``}
                small_description = :small_description,
                description = :description,
                date_range = :date_range,
                start_date = :start_date,
                end_date = :end_date,
                ${existing_plan?.min_days ? `min_days = ${existing_plan.min_days},` : ``}
                ${existing_plan?.max_days ? `max_days = ${existing_plan.max_days},` : ``}
                ${existing_plan?.cancelation_policy ? `cancelation_policy = '${existing_plan.cancelation_policy}',` : ``}
                available = ${existing_plan?.available ? 1 : 0},
                ${existing_plan?.available_from_date ? `available_from_date = '${existing_plan.available_from_date}',` : ``}
                ${existing_plan?.available_until_date ? `available_until_date = '${existing_plan.available_until_date}',` : ``}
                starting_type = :starting_type,
                adults_only = ${existing_plan?.adults_only ? 1 : 0},
                family_friendly = ${existing_plan?.family_friendly ? 1 : 0},
                ${existing_plan?.area_description ? `area_description = '${existing_plan.area_description}',` : ``}
                ${existing_plan?.other_important_info ? `other_important_info = '${existing_plan.other_important_info}',` : ``}
                ${existing_plan?.means_of_transport_arrival.type ? `means_of_transport_arrival.type = '${existing_plan.means_of_transport_arrival.type}',` : ``}
                ${existing_plan?.means_of_transport_arrival.company_name ? `means_of_transport_arrival.company_name = '${existing_plan.means_of_transport_arrival.company_name}',` : ``}
                ${existing_plan?.means_of_transport_arrival.start_time ? `means_of_transport_arrival.start_time = '${existing_plan.means_of_transport_arrival.start_time}',` : ``}
                ${existing_plan?.means_of_transport_arrival.arrival_time ? `means_of_transport_arrival.arrival_time = '${existing_plan.means_of_transport_arrival.arrival_time}',` : ``}
                ${existing_plan?.means_of_transport_arrival.number ? `means_of_transport_arrival.number = '${existing_plan.means_of_transport_arrival.number}',` : ``}
                ${existing_plan?.means_of_transport_return.type ? `means_of_transport_return.type = '${existing_plan.means_of_transport_return.type}',` : ``}
                ${existing_plan?.means_of_transport_return.company_name ? `means_of_transport_return.company_name = '${existing_plan.means_of_transport_return.company_name}',` : ``}
                ${existing_plan?.means_of_transport_return.start_time ? `means_of_transport_return.start_time = '${existing_plan.means_of_transport_return.start_time}',` : ``}
                ${existing_plan?.means_of_transport_return.arrival_time ? `means_of_transport_return.arrival_time = '${existing_plan.means_of_transport_return.arrival_time}',` : ``}
                ${existing_plan?.means_of_transport_return.number ? `means_of_transport_return.number = '${existing_plan.means_of_transport_return.number}',` : ``}
                ${existing_plan?.discount?.code_type ? `discount.code_type = '${existing_plan.discount.code_type}',` : ``}
                ${existing_plan?.discount?.code_value ? `discount.code_value = '${existing_plan.discount.code_value}',` : ``}
                discount.enabled = ${existing_plan?.discount?.enabled ? 1 : 0},
                ${existing_plan?.discount?.type ? `discount.type = '${existing_plan.discount.type}',` : ``}
                ${existing_plan?.discount?.value ? `discount.value = ${existing_plan.discount.value},` : ``}
                place_id = :place_id,
                accommodation_id = :accommodation_id
            WHERE
                plan_id = :plan_id
        `, existing_plan);




        return Promise.resolve({
            code: 200,
            type: 'plan_created',
            plan_id: existing_plan.place_id
        });



    } catch (error) {
        return Promise.reject(error);
    }

}





export async function deleteExistingPlan(plan_id: string): Promise<any> {


    try {

        const delete_result = await accountsDb.query(`DELETE FROM plans WHERE plan_id = :plan_id`, { plan_id: plan_id });


        return Promise.resolve({
            code: 200,
            type: 'plan_deleted',
        });


    } catch (error) {
        return Promise.reject(error);
    }


}
