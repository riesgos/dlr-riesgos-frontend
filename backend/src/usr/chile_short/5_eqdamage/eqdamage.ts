import { Datum, Step } from "../../../scenarios/scenarios";
import { getFragility, getDamage } from "../../wpsServices";


async function calculateDamage(inputs: Datum[]) {

    const eqSimXmlRef = inputs.find(i => i.id === 'eqSimXmlRefChile')!;
    const exposureModelRef = inputs.find(i => i.id === 'exposureRefChile')!;
    const fragilityRef = await getFragility('SARA_v1.0');
    
    const { wms, summary, damageRef } = await getDamage('SARA_v1.0', fragilityRef, eqSimXmlRef.value, exposureModelRef.value);
  
    return [{
        id: 'eqDamageWmsChile',
        value: wms
    }, {
        id: 'eqDamageSummaryChile',
        value: summary
    }, {
        id: 'eqDamageRefChile',
        value: damageRef
    // }, {
    //     id: 'eqDamageShapefileChile',
    //     value: shapefile
    }];
}



export const step: Step = {
    id: 'EqDamageChile',
    title: 'Multihazard_damage_estimation/Earthquake',
    description: 'eq_damage_svc_description',
    inputs: [{
        id: 'eqSimXmlRefChile'
    }, {
        id: 'exposureRefChile',
    }],
    outputs: [{
        id: 'eqDamageWmsChile'
    }, {
        id: 'eqDamageSummaryChile'
    }, {
        id: 'eqDamageRefChile'
    // }, {
    //     id: 'eqDamageShapefileChile'
    }],
    function: calculateDamage
};

