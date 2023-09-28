import { Datum, Step } from "../../../scenarios/scenarios";



async function simulateEq(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const id = selectedEq.features[0].id.replace("peru_", "");
    const wms = `http://localhost:8080/geoserver/riesgos/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&LAYERS=riesgos%3Apga_${id}`;

    return [{
        id: 'eqSimWms',
        value: wms,
    }];
}



export const step: Step = {
    id: 'EqSimulation',
    title: 'Earthquake Simulation',
    description: 'EqSimulationShortText',
    inputs: [{
        id: 'selectedEq'
    }],
    outputs: [{
        id: 'eqSimWms'
    }],
    function: simulateEq
};