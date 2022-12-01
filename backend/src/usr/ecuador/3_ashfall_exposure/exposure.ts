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

    const { exposureModel: ashfallExposureModel, exposureRef: ashfallExposureRef } = await getExposureModel('LatacungaRuralAreas', 'Torres_Corredor_et_al_2017', bbox);

    return [{
        id: 'ashfallExposureEcuador',
        value: ashfallExposureModel,
    }, {
        id: 'ashfallExposureEcuadorRef',
        value: ashfallExposureRef
    }];
}

export const step: Step = {
    id: 'AshfallExposureEcuador',
    title: 'Ashfall exposure model',
    description: 'ashfall_exposure_process_description',
    inputs: [],
    outputs: [{
        id: 'ashfallExposureEcuador'
    }, {
        id: 'ashfallExposureEcuadorRef'
    }],
    function: loadExposure
}