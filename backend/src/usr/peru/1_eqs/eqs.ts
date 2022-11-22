import { Datum, Step } from "../../../scenarios/scenarios";
import { Bbox, getAvailableEqs } from "../wpsServices";



async function loadEqs(inputs: Datum[]) {

    const catalogType = inputs.find(i => i.id === 'eqCatalogType')!.value;

    const bbox: Bbox = {
        crs: 'EPSG:4326',
        lllon: -86.5, lllat: -20.5,
        urlon: -68.5, urlat: -0.6
    };
    
    const result = await getAvailableEqs(catalogType, bbox);

    return [{
        id: 'availableEqs',
        value: result
    }];
}



export const step: Step = {
    id: 'Eqs',
    title: 'Eqs',
    description: 'Fetch eq data from database',
    inputs: [{
        id: 'eqCatalogBbox'
    }, {
        id: 'eqCatalogType',
        options: ['observed', 'expert']
    }],
    outputs: [{
        id: 'availableEqs'
    }],
    function: loadEqs
};