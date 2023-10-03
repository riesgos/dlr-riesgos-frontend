import { Datum, Step } from "../../../scenarios/scenarios";


async function tsunamiSimulation(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const id = selectedEq.features[0].id.replace("peru_", "").replace("quakeml:quakeledger/", "");

    const wms = [
        `http://localhost:8080/geoserver/riesgos/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AarrivalTimes_${id}`,
        `http://localhost:8080/geoserver/riesgos/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AepiCenter_${id}`,
        `http://localhost:8080/geoserver/riesgos/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AmwhLand_global_${id}`,
        `http://localhost:8080/geoserver/riesgos/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AmwhLand_local_${id}`,
        `http://localhost:8080/geoserver/riesgos/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3Amwh_${id}`
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
