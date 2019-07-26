import { Process, ProcessState, WpsProcess, ProcessStateTypes, ProcessStateUnavailable, WatchingProcess, Product } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { UserconfigurableWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';


export const lat: UserconfigurableWpsData = {
    description: {
        id: "lat",
        reference: false,
        type: "literal",
        wizardProperties: {
            fieldtype: "string", 
            name: "lattitude", 
        }
    },
    value: null
};

export const lon: UserconfigurableWpsData = {
    description: {
        id: "lon",
        reference: false,
        type: "literal",
        wizardProperties: {
            fieldtype: "string", 
            name: "longitude", 
        }
    },
    value: null
};

export const mag: UserconfigurableWpsData = {
    description: {
        id: "mag",
        reference: false,
        type: "literal",
        wizardProperties: {
            fieldtype: "string", 
            name: "maginitude", 
        }
    },
    value: null
};

export const tsunamap: WpsData = {
    description: {
        id: "tsunamap",
        type: "complex",
        format: "application/WMS",
        reference: true,
    },
    value: null
};




export const TsPhysicalSimulation: WpsProcess & WatchingProcess = {

    state: new ProcessStateUnavailable(),

    id: "get_tsunamap",

    url: "http://tsunami-wps.awi.de/wps",

    name: "Tsunami Simulation",

    description: "Simulates a tsunami's inundation map based on a given earthquake",

    requiredProducts: ["lat",  "lon", "mag"],

    providedProduct: "tsunamap", 

    wpsVersion: "1.0.0", 

    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch(newProduct.description.id) {
            
            case "quakeml-input": 
                return [{
                    ...lon, 
                    value: newProduct.value.geometry.coordinates[0]
                }, {
                    ...lat,
                    value: newProduct.value.geometry.coordinates[1]
                }, {
                    ...mag,
                    value: newProduct.value.properties["magnitude.mag.value"]
                }];

            default: 
                return [];
        }
    }
}