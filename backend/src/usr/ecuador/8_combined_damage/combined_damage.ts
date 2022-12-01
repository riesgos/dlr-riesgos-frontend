import { Datum, Step } from "../../../scenarios/scenarios";
import { getDamageJson, getFragility } from "../../wpsServices";


async function combinedDamage(data: Datum[]) {

    const intensityXmlRef = data.find(d => d.id === 'laharShakemapRefs')!.value.velRef;
    const currentExposureRef = data.find(d => d.id === 'ashfallDamageRef')!.value;
    const fragilityRef = await getFragility('Mavrouli_et_al_2014');

    const {damageRef, json, summary} = await getDamageJson('Torres_Corredor_et_al_2017', fragilityRef, intensityXmlRef, currentExposureRef);

    const ashfallDamage = data.find(d => d.id === 'ashfallDamage')!.value;
    for (let i = 0; i < json.features.length; i++) {
        json.features[i].properties['loss_value'] += ashfallDamage.features[i].properties['loss_value'];
    }

    return [{
        id: 'combinedDamageEcuador',
        value: json
    }];
}


export const step: Step = {
    id: 'CombinedDamageEcuador',
    title: 'LaharAndAshfallDamage',
    description: 'ashfall_and_lahar_damage_service_description',
    inputs: [{
        id: 'laharShakemapRefs'
    }, {
        id: 'ashfallDamageRef'
    }, {
        id: 'ashfallDamage'
    }],
    outputs: [{
        id: 'combinedDamageEcuador'
    }],
    function: combinedDamage
}