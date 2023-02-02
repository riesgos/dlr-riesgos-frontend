import { Datum, Step } from "../../../scenarios/scenarios";
import { Bbox, getAvailableEqs } from "../../wpsServices";



async function loadEqs(inputs: Datum[]) {

    const catalogType = inputs.find(i => i.id === 'eqCatalogType')!.value;
    const mmin = inputs.find(i => i.id === 'eqMmin')!.value;
    const mmax = inputs.find(i => i.id === 'eqMmax')!.value;
    const zmin = inputs.find(i => i.id === 'eqZmin')!.value;
    const zmax = inputs.find(i => i.id === 'eqZmax')!.value;
    const p    = inputs.find(i => i.id === 'eqP')!.value;


    const bbox: Bbox = {
        crs: 'EPSG:4326',
        lllon: -86.5, lllat: -20.5,
        urlon: -68.5, urlat: -0.6
    };
    
    const result = await getAvailableEqs(catalogType, bbox, mmin, mmax, zmin, zmax, p);

    return [{
        id: 'availableEqs',
        value: result
    }];
}



export const step: Step = {
    id: 'Eqs',
    title: 'quakeledger',
    description: 'QuakeLedgerDescription',
    inputs: [{
        id: 'eqCatalogType',
        options: ['observed', 'expert']
    }, {
        id: 'eqMmin',
        options: [] // empty array: interpreted by frontend as configurable, but without options or default value.
    }, {
        id: 'eqMmax',
        options: []
    }, {
        id: 'eqZmin',
        options: []
    }, {
        id: 'eqZmax',
        options: []
    }, {
        id: 'eqP',
        options: []
    }],
    outputs: [{
        id: 'availableEqs'
    }],
    function: loadEqs
};