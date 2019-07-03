import { Process, ProcessState, WpsProcess } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public_api';


export const lat: WpsData = {
    description: {
        id: "lat",
        reference: false,
        type: "literal",
    },
    value: null
};

export const lon: WpsData = {
    description: {
        id: "lon",
        reference: false,
        type: "literal",
    },
    value: null
};

export const mag: WpsData = {
    description: {
        id: "mag",
        reference: false,
        type: "literal",
    },
    value: null
};

export const tsunamap: WpsData = {
    description: {
        id: "tsunamap",
        type: "complex",
        format: "application/xml",
        reference: false,
},
    value: null
};

export const TsPhysicalSimulation: WizardableProcess & WpsProcess = {

    state: ProcessState.unavailable,

    id: "get_tsunamap",

    url: "http://tsunami-wps.awi.de/wps",

    name: "Tsunami Simulation",

    description: "Simulates a tsunami's inundation map based on a given earthquake",

    requiredProducts: ["lat",  "lon", "mag"],

    providedProduct: "tsunamap", 

    wpsVersion: "1.0.0", 

    wizardProperties: {
        shape: "tsunami"
    }
}