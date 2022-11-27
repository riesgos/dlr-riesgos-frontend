import { Datum, Step } from "../../../scenarios/scenarios";
import { Bbox, getExposureModel } from "../../wpsServices";


async function getExposure(inputs: Datum[]) {

    const exposureSelection = inputs.find(i => i.id === 'exposureModelName')!;

    const bbox: Bbox = {
        crs: 'EPSG:4326',
        lllon: -80.8,
        urlon:  -71.4,
        lllat: -20.2,
        urlat: -10.0
    }

    const { exposureModel, exposureRef } = await getExposureModel(exposureSelection.value, 'SARA_v1.0', bbox);
  
    return [{
        id: 'exposure',
        value: exposureModel
    }, {
        id: 'exposureRef',
        value: exposureRef
    }];
}



export const step: Step = {
    id: 'Exposure',
    title: 'Exposure',
    description: 'Picks exposure model',
    inputs: [{
        id: 'exposureModelName',
        options: [
            "LimaCVT1_PD30_TI70_5000",
            "LimaCVT2_PD30_TI70_10000",
            "LimaCVT3_PD30_TI70_50000",
            "LimaCVT4_PD40_TI60_5000",
            "LimaCVT5_PD40_TI60_10000",
            "LimaCVT6_PD40_TI60_50000",
            "LimaBlocks",
         ]
    }],
    outputs: [{
        id: 'exposure'
    }, {
        id: 'exposureRef'
    }],
    function: getExposure
};
