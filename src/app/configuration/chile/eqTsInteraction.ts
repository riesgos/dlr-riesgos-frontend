import { Process, ProcessState, WpsProcess, ProcessStateTypes, ProcessStateUnavailable } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { UserconfigurableWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from 'projects/services-wps/src/public_api';



export const epicenters: WpsData = {
    description: {
        id: "epicenters",
        reference: false,
        format: "application/vnd.geo+json",
        type: "complex",
    }, 
    value: null
};



export const EqTsInteraction: WizardableProcess & WpsProcess = {

    state: new ProcessStateUnavailable(),

    id: "org.n52.project.riesgos.GetEpicentersProcess",

    url: "http://tsunami-riesgos.awi.de:8080/wps/WebProcessingService",

    name: "Earthquake/tsunami interaction",

    description: "Relates a tsunami to a given earthquake",

    requiredProducts: ["input-boundingbox"],

    providedProduct: "epicenters",

    wpsVersion: "1.0.0", 

    wizardProperties: {
        shape: "tsunami"
    }

}