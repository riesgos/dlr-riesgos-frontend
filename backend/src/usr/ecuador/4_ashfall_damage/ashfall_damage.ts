import { Datum, Step } from "../../../scenarios/scenarios";
import { getVolcanusAshfallDamage, getFragility } from "../../wpsServices";


async function calcDamage(data: Datum[]) {

    const exposureRef = data.find(d => d.id === 'ashfallExposureEcuadorRef')!.value;
    const intensity = data.find(d => d.id === 'ashfallPoints')!.value;

    const vulnerabilityRef = await getFragility('Torres_Corredor_et_al_2017');
    const { damage, damageRef } = await getVolcanusAshfallDamage(intensity, exposureRef, vulnerabilityRef);

    return [{
        id: 'ashfallDamage',
        value: damage,
    }, {
        id: 'ashfallDamageRef',
        value: damageRef
    }];
}

export const step: Step = {
    id: 'AshfallDamage',
    title: 'Ashfall Damage',
    description: 'ashfall_damage_service_description',
    inputs: [{
        id: 'ashfallPoints'
    }, {
        id: 'ashfallExposureEcuadorRef'
    }],
    outputs: [{
        id: 'ashfallDamage'
    }, {
        id: 'ashfallDamageRef'
    }],
    function: calcDamage
};