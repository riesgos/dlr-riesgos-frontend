import { Datum, Step } from "../../../scenarios/scenarios";
import config from '../../../config.json';


async function simulateEq(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEqChile')!.value;
    const id = selectedEq.features[0].id.replace("peru_", "").replace("quakeml:quakeledger/", "");
    const wms = `${config.services.cacheServer}?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&LAYERS=riesgos%3Apga_${id}`;

    return [{
        id: 'eqSimWmsChile',
        value: wms,
    }];
}



export const step: Step = {
    id: 'EqSimulationChile',
    title: 'Earthquake Simulation',
    description: 'EqSimulationShortText',
    inputs: [{
        id: 'selectedEqChile'
    }],
    outputs: [{
        id: 'eqSimWmsChile'
    }],
    function: simulateEq
};
