import { Datum, Step } from "../../../scenarios/scenarios";


async function getExposure(inputs: Datum[]) {


    const exposureModel = "http://localhost:8080/geoserver/riesgos/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES=&LAYERS=riesgos:exposure";
  
    return [{
        id: 'exposure',
        value: exposureModel
    }];
}



export const step: Step = {
    id: 'Exposure',
    title: 'Exposure',
    description: 'exposure_process_description_peru',
    inputs: [],
    outputs: [{
        id: 'exposure'
    }],
    function: getExposure
};
