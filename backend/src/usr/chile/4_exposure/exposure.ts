import { Datum, Step } from "../../../scenarios/scenarios";
import { Bbox, getExposureModelWms } from "../../wpsServices";

async function getExposure(inputs: Datum[]) {

    const exposureSelection = inputs.find(i => i.id === 'exposureModelNameChile')!;

    const bbox: Bbox = {
        crs: 'EPSG:4326',
        lllon: -73,
        urlon:  -70,
        lllat: -35,
        urlat: -32
    }

    const { exposureWms, exposureRef, exposureMetadata } = await getExposureModelWms(exposureSelection.value, 'SARA_v1.0', bbox);
  
    return [{
        id: 'exposureWmsChile',
        value: exposureWms
    }, {
        id: 'exposureMetaChile',
        value: exposureMetadata
    }, {
        id: 'exposureRefChile',
        value: exposureRef
    }]
}



export const step: Step = {
    id: 'ExposureChile',
    title: 'Exposure',
    description: 'exposure_process_description',
    inputs: [{
        id: 'exposureModelNameChile',
        options: [
            'ValpCVTBayesian',
            'ValpCommuna',
            'ValpRegularOriginal',
            'ValpRegularGrid',
            'ValpOBM23Comunas',
            'ValpOBM23Region'
         ]
    }],
    outputs: [{
        id: 'exposureWmsChile'
    }, {
        id: 'exposureRefChile'
    }, {
        id: 'exposureMetaChile'
    }],
    function: getExposure
};
