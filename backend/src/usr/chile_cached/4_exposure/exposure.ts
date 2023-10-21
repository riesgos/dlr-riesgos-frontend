import { Datum, Step } from "../../../scenarios/scenarios";
import config from "../../../config.json";

async function getExposure(inputs: Datum[]) {


    const exposureModel = `${config.services.cacheServer}?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES=&LAYERS=riesgos:exposure`;
  
    return [{
        id: 'exposureChile',
        value: exposureModel
    }];
}



export const step: Step = {
    id: 'ExposureChile',
    title: 'Exposure',
    description: 'exposure_process_description_peru',
    inputs: [],
    outputs: [{
        id: 'exposureChile'
    }],
    function: getExposure
};
