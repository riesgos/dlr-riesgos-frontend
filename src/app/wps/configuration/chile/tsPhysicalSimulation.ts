import { Process, ProcessState } from '../../control/workflow_datatypes';




export const TsPhysicalSimulation: Process = {

    state: ProcessState.unavailable,

    id: "get_tsunamap",

    url: "http://tsunami-wps.awi.de/wps",

    name: "Tsunami Simulation",

    description: "Simulates a tsunami's inundation map based on a given earthquake",

    requiredProducts: [{
            id: "lat",
            reference: false,
            type: "literal",
        }, {
            id: "lon",
            reference: false,
            type: "literal",
        }, {
            id: "mag",
            reference: false,
            type: "literal",
        }],

    providedProduct: {
            id: "tsunamap",
            type: "complex",
            format: "application/xml",
            reference: false,
    }, 

    wpsVersion: "1.0.0"
}