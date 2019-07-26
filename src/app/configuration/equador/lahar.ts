import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateAvailable, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import { FeatureSelectUconfWD, FeatureSelectUconfWpsData, StringSelectUconfWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';


export const direction: StringSelectUconfWpsData = {
    description: {
        id: "direction", 
        reference: false, 
        type: "literal", 
        options: ["South", "North"],
        wizardProperties: {
            fieldtype: "stringselect",
            name: "direction", 
        }
    }, 
    value: null
}

export const intensity: StringSelectUconfWpsData = {
    description: {
        id: "intensity", 
        reference: false, 
        type: "literal", 
        options: ["VEI1", "VEI2", "VEI3", "VEI4"],
        wizardProperties: {
            fieldtype: "stringselect", 
            name: "intensity", 
        }
    }, 
    value: null
};

export const parameter: StringSelectUconfWpsData = {
    description: {
        id: "parameter", 
        reference: false, 
        type: "literal", 
        options: ["MaxHeight", "MaxVelocity", "MaxPressure", "MaxErosion", "Deposition"],
        wizardProperties: {
            fieldtype: "stringselect", 
            name: "parameter", 
        }
    }, 
    value: null
};


export const laharWms: WmsLayerData = {
    description: {
        id: "result",
        name: "laharWms",
        type: "complex",
        reference: false,
        format: "application/WMS", 
    },
    value: null
}



export const LaharWps: WizardableProcess & WpsProcess = {
    id: "gs:LaharModel",
    url: "http://91.250.85.221/geoserver/riesgos/wps",
    name: "Lahar",
    description: "Simulates the path a lahar would take",
    providedProduct: "result",
    requiredProducts: ["direction", "intensity", "parameter"], 
    state: new ProcessStateUnavailable(),
    wpsVersion: "1.0.0", 
    wizardProperties: {
        providerName: "EOMAP GMBH", 
        providerUrl: "https://www.eomap.com/",
        shape: "avalance"
    }
}