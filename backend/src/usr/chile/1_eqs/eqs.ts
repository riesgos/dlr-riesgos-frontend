import { Datum, Step } from "../../../scenarios/scenarios";
import { Bbox, getAvailableEqs } from "../../wpsServices";



async function loadEqs(inputs: Datum[]) {

    const catalogType = inputs.find(i => i.id === 'eqCatalogTypeChile')!.value;
    const mmin = inputs.find(i => i.id === 'eqMminChile')!.value;
    const mmax = inputs.find(i => i.id === 'eqMmaxChile')!.value;
    const zmin = inputs.find(i => i.id === 'eqZminChile')!.value;
    const zmax = inputs.find(i => i.id === 'eqZmaxChile')!.value;

    const bbox: Bbox = {
        crs: 'EPSG:4326',
        lllon: -75, lllat: -39,
        urlon: -60, urlat: -20,
    };
    
    const result = await getAvailableEqs(catalogType, bbox, mmin, mmax, zmin, zmax);

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
    }, {
        id: 'eqMminChile',
        options: []  // empty array: interpreted by frontend as configurable, but without options or default value.
    }, {
        id: 'eqMmaxChile',
        options: []
    }, {
        id: 'eqZminChile',
        options: []
    }, {
        id: 'eqZmaxChile',
        options: []
    }],
    outputs: [{
        id: 'availableEqsChile'
    }],
    function: loadEqs
};