import { Datum, Step } from "../../../scenarios/scenarios";
import config from "../../../config.json";

async function tsunamiSimulation(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const id = selectedEq.features[0].id.replace("peru_", "").replace("quakeml:quakeledger/", "");

    const wms = [
        `${config.services.cacheServer}?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AarrivalTimes_${id}`,
        `${config.services.cacheServer}?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AepiCenter_${id}`,
        `${config.services.cacheServer}?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AmwhLand_global_${id}`,
        `${config.services.cacheServer}?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AmwhLand_local_${id}`,
        `${config.services.cacheServer}?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3Amwh_${id}`
    ];
  
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
