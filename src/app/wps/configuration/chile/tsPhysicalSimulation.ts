import { ProcessDescription } from '../configurationProvider';




export const TsPhysicalSimulation: ProcessDescription = {

    id: "get_tsunamap",

    url: "http://tsunami-wps.awi.de/wps",

    name: "Tsunami Simulation",

    description: "Simulates a tsunami's inundation map based on a given earthquake",

    requiredProducts: [{
            id: "lat",
            reference: false,
            type: "literal",
            data: null
        }, {
            id: "lon",
            reference: false,
            type: "literal",
            data: null
        }, {
            id: "mag",
            reference: false,
            type: "literal",
            data: null
        }],

    providedProduct: {
            id: "tsunamap",
            type: "complex",
            format: "application/xml",
            reference: false,
            data: null
    }, 

    wpsVersion: "1.0.0"
}