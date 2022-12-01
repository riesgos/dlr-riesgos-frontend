import { Datum, Step } from "../../../scenarios/scenarios";
import { Bbox, getExposureModel } from "../../wpsServices";



async function loadExposure(data: Datum[]) {
    
    const bbox: Bbox = {
        crs: 'EPSG:4326',
        lllat: -1,
        urlat: -0.4,
        lllon: -79,
        urlon: -78
    };

    const { exposureModel: laharExposureModel, exposureRef: laharExposureRef } = await getExposureModel('LatacungaRuralAreas', 'Mavrouli_et_al_2014', bbox);
    return [{
        id: 'laharExposureEcuador',
        value: laharExposureModel,
    }, {
        id: 'laharExposureEcuadorRef',
        value: laharExposureRef
    }];
}

export const step: Step = {
    id: 'LaharExposureEcuador',
    title: 'Lahar exposure model',
    description: 'lahar_exposure_process_description',
    inputs: [],
    outputs: [{
        id: 'laharExposureEcuador'
    }, {
        id: 'laharExposureEcuadorRef'
    }],
    function: loadExposure
}