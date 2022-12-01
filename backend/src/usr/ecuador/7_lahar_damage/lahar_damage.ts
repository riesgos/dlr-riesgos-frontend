import { Datum, Step } from "../../../scenarios/scenarios";
import { getVolcanusAshfallDamage, getFragility, getDamage, getDamageJson } from "../../wpsServices";


async function calcDamage(data: Datum[]) {

    const exposureRef = data.find(d => d.id === 'laharExposureEcuadorRef')!.value;
    const intensityXmlRef = data.find(d => d.id === 'laharShakemapRefs')!.value.velRef;

    const vulnerabilityRef = await getFragility('Mavrouli_et_al_2014');
    const { damageRef, summary, json } = await getDamageJson('Mavrouli_et_al_2014', vulnerabilityRef, intensityXmlRef, exposureRef);

    return [{
        id: 'laharDamage',
        value: json,
    }, {
        id: 'laharDamageRef',
        value: damageRef
    }];
}

export const step: Step = {
    id: 'LaharDamage',
    title: 'Lahar Damage',
    description: 'lahar_damage_service_description',
    inputs: [{
        id: 'laharShakemapRefs'
    }, {
        id: 'laharExposureEcuadorRef'
    }],
    outputs: [{
        id: 'laharDamage'
    }, {
        id: 'laharDamageRef'
    }],
    function: calcDamage
};