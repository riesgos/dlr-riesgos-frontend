import { Process, ProcessState } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';




export const EqTsInteraction: WizardableProcess = {

    state: ProcessState.unavailable,

    id: "org.n52.project.riesgos.GetEpicentersProcess",

    url: "http://tsunami-riesgos.awi.de:8080/wps/WebProcessingService",

    name: "Earthquake/tsunami interaction",

    description: "Relates a tsunami to a given earthquake",

    requiredProducts: [{
        id: "input-boundingbox",
        reference: false,
        type: "bbox",
    }],

    providedProduct: {
        id: "epicenters",
        reference: false,
        format: "application/vnd.geo+json",
        type: "complex",
    },

    wpsVersion: "1.0.0", 

    wizardProperties: {
        shape: "tsunami"
    }

}