import { Datum, Step } from "../../../scenarios/scenarios";
import { getExposureModel } from "../wpsServices";


async function getExposure(inputs: Datum[]) {

    const exposureSelection = inputs.find(i => i.id === 'exposureModelName')!;

    const exposureModel = await getExposureModel(exposureSelection.value, 'SARA_v1.0');
  
    return [{
        id: 'exposure',
        value: exposureModel
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
    }],
    function: getExposure
};
