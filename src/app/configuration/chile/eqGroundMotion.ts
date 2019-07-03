import { ProcessState, WatchingProcess, Product, WpsProcess } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { SelectUconfWD, UserconfigurableWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from 'projects/services-wps/src/public_api';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';



export const selectedEq: UserconfigurableWpsData = {
    description: {
        id: "quakeml-input",
        format: "application/vnd.geo+json",
        reference: false,
        type: "complex", 
        wizardProperties: {
            fieldtype: "select", 
            name: "Selected earthquake", 
            options: []
        }
    },
    value: null
}


export const shakemapOutput: WpsData = {
    description: {
        id: "shakemap-output",
        type: "complex",
        reference: false,
        format: "application/WMS"
    },
    value: null
}




export const EqGroundMotionProvider: WatchingProcess = {
    id: "org.n52.wps.python.algorithm.ShakemapProcess_provider",
    name: "", 
    state: ProcessState.available,
    requiredProducts: ["selected-rows"], 
    providedProduct: "quakeml-input",
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch(newProduct.description.id) {

            case "selected-rows": 
                return [{
                    description: {
                        id: "quakeml-input",
                        format: "application/vnd.geo+json",
                        reference: false,
                        type: "complex", 
                        wizardProperties: {
                            fieldtype: "select", 
                            name: "Selected earthquake", 
                            options: newProduct.value[0].features
                        }
                    },
                    value: newProduct.value[0].features[0]
                }]


            default: 
                return [];
        }
    }
}




export const EqGroundMotion : WizardableProcess & WpsProcess = {

    state: ProcessState.unavailable,

    id: "org.n52.wps.python.algorithm.ShakemapProcess",

    url: "https://riesgos.52north.org/wps/WebProcessingService",

    name: "Groundmotion Simulation", 

    description: "Simulates the ground motion caused by a given eathquakes parameters",

    requiredProducts: ["quakeml-input"],

    providedProduct: "shakemap-output", 

    wpsVersion: "1.0.0", 

    wizardProperties: {
        shape: "earthquake"
    }, 

}