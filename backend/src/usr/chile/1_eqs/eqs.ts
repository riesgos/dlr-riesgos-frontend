import { Datum, Step } from "../../../scenarios/scenarios";
import { Bbox, getAvailableEqs } from "../wpsServices";



async function loadEqs(inputs: Datum[]) {

    const catalogType = inputs.find(i => i.id === 'eqCatalogTypeChile')!.value;

    const bbox: Bbox = {
        crs: 'EPSG:4326',
        lllon: -73.5, lllat: -34,
        urlon: -70.5, urlat: -29.0,
    };
    
    const result = await getAvailableEqs(catalogType, bbox);

    return [{
        id: 'availableEqsChile',
        value: result
    }];
}



export const step: Step = {
    id: 'EqsChile',
    title: 'quakeledger',
    description: 'QuakeLedgerDescription',
    inputs: [{
        id: 'eqCatalogTypeChile',
        options: ['expert']
    }],
    outputs: [{
        id: 'availableEqsChile'
    }],
    function: loadEqs
};