import { Datum, Step } from "../../../scenarios/scenarios";
import { getExposureModel, getFragility, getDamage } from "../wpsServices";


async function calculateDamage(inputs: Datum[]) {

    const eqSimXml = inputs.find(i => i.id === 'eqSimXml')!;
    const exposureModel = inputs.find(i => i.id === 'exposure')!;

    const fragility = await getFragility('SARA_v1.0');
    const { wms, summary } = await getDamage('SARA_v1.0', fragility, eqSimXml.value, exposureModel.value);
  
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
    title: 'Earthquake Damage',
    description: 'Simulates damages to residential buildings',
    inputs: [{
        id: 'eqSimXml'
    }, {
        id: 'exposure',
    }],
    outputs: [{
        id: 'eqDamageWms'
    }, {
        id: 'eqDamageSummary'
    }],
    function: calculateDamage
};
