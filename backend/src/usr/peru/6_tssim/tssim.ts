import { Datum, Step } from "../../../scenarios/scenarios";
import { getTsunami } from "../../wpsServices";


async function tsunamiSimulation(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!;

    const wms = await getTsunami(selectedEq.value.features[0]);
  
    return [{
        id: 'tsWms',
        value: wms
    }];
}



export const step: Step = {
    id: 'Tsunami',
    title: 'TS-Service',
    description: 'TsShortDescription',
    inputs: [{
        id: 'selectedEq'
    }],
    outputs: [{
        id: 'tsWms'
    }],
    function: tsunamiSimulation
};
