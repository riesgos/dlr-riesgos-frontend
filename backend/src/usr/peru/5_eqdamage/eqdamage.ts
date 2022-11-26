import { Datum, Step } from "../../../scenarios/scenarios";
import { getFragility, getDamage } from "../wpsServices";


async function calculateDamage(inputs: Datum[]) {

    const eqSimXmlRef = inputs.find(i => i.id === 'eqSimXmlRef')!;
    const exposureModelRef = inputs.find(i => i.id === 'exposureRef')!;
    const fragilityRef = await getFragility('SARA_v1.0');
    
    const { wms, summary } = await getDamage('SARA_v1.0', fragilityRef, eqSimXmlRef.value, exposureModelRef.value);
  
    return [{
        id: 'eqDamageWms',
        value: wms
    }, {
        id: 'eqDamageSummary',
        value: summary
    }];
}



export const step: Step = {
    id: 'EqDamage',
    title: 'Multihazard_damage_estimation/Earthquake',
    description: 'eq_damage_svc_description',
    inputs: [{
        id: 'eqSimXmlRef'
    }, {
        id: 'exposureRef',
    }],
    outputs: [{
        id: 'eqDamageWms'
    }, {
        id: 'eqDamageSummary'
    }],
    function: calculateDamage
};

