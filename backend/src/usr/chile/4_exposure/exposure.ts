import { Datum, Step } from "../../../scenarios/scenarios";
import { getExposureModel } from "../wpsServices";


async function getExposure(inputs: Datum[]) {

    const exposureSelection = inputs.find(i => i.id === 'exposureModelNameChile')!;

    const { exposureModel, exposureRef } = await getExposureModel(exposureSelection.value, 'SARA_v1.0');
  
    return [{
        id: 'exposureChile',
        value: exposureModel
    }, {
        id: 'exposureRefChile',
        value: exposureRef
    }];
}



export const step: Step = {
    id: 'ExposureChile',
    title: 'Exposure',
    description: 'Picks exposure model',
    inputs: [{
        id: 'exposureModelNameChile',
        options: [
            'ValpCVTBayesian',
            'ValpCommuna'‚
            'ValpRegularOriginal',
            'ValpRegularGrid'
         ]
    }],
    outputs: [{
        id: 'exposureChile'
    }, {
        id: 'exposureRefChile'
    }],
    function: getExposure
};
