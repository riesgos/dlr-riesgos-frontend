import { ProcessState, WatchingProcess, Product } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { SelectUconfWD } from 'src/app/components/config_wizard/userconfigurable_wpsdata';



const selectedEq: SelectUconfWD = {
    id: "quakeml-input",
    format: "application/vnd.geo+json",
    reference: false,
    type: "complex", 
    wizardProperties: {
        fieldtype: "select", 
        name: "Selected earthquake", 
        options: []
    }
}




export const EqGroundMotionProvider: WatchingProcess = {
    id: "org.n52.wps.python.algorithm.ShakemapProcess_provider", 
    url: "",
    wpsVersion: "1.0.0",
    description: "", 
    name: "", 
    requiredProducts: [], 
    providedProduct: selectedEq, 
    state: ProcessState.available, 
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




export const EqGroundMotion : WizardableProcess = {

    state: ProcessState.unavailable,

    id: "org.n52.wps.python.algorithm.ShakemapProcess",

    url: "https://riesgos.52north.org/wps/WebProcessingService",

    name: "Groundmotion Simulation", 

    description: "Simulates the ground motion caused by a given eathquakes parameters",

    requiredProducts: [selectedEq],

    providedProduct: {
            id: "shakemap-output",
            type: "complex",
            reference: false,
            format: "application/WMS"
        }, 

    wpsVersion: "1.0.0", 

    wizardProperties: {
        shape: "earthquake"
    }, 

}