import { Process, ProcessState } from '../../control/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';




export const EqGroundMotion : WizardableProcess = {

    state: ProcessState.unavailable,

    id: "org.n52.wps.python.algorithm.ShakemapProcess",

    url: "https://riesgos.52north.org/wps/WebProcessingService",

    name: "Groundmotion Simulation", 

    description: "Simulates the ground motion caused by a given eathquakes parameters",

    requiredProducts: [{
            id: "quakeml-input",
            format: "application/vnd.geo+json",
            reference: false,
            type: "complex"
        }],

    providedProduct: {
            id: "shakemap-output",
            type: "complex",
            reference: false,
            format: "application/WMS"
        }, 

    wpsVersion: "1.0.0", 

    shape: "earthquake"

}