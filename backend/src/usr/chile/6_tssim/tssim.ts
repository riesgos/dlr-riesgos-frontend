import { Datum, Step } from "../../../scenarios/scenarios";
import { getTsunami } from "../wpsServices";


async function tsunamiSimulation(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEqChile')!;

    const wms = await getTsunami(selectedEq.value.features[0]);
  
    return [{
        id: 'tsWmsChile',
        value: wms
    }];
}



export const step: Step = {
    id: 'TsunamiChile',
    title: 'TS-Service',
    description: 'TsShortDescription',
    inputs: [{
        id: 'selectedEqChile'
    }],
    outputs: [{
        id: 'tsWmsChile'
    }],
    function: tsunamiSimulation
};
