import { Process, ProcessState, WpsProcess, ProcessStateTypes, ProcessStateUnavailable } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { UserconfigurableWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from 'projects/services-wps/src/public-api';



export const epicenter: WpsData = {
    description: {
        id: "epiCenter",
        reference: false,
        format: "application/WMS",
        type: "literal",
    }, 
    value: null
};



export const EqTsInteraction: WizardableProcess & WpsProcess = {

    state: new ProcessStateUnavailable(),

    id: "get_scenario",

    url: "http://tsunami-wps.awi.de/wps",

    name: "Earthquake/tsunami interaction",

    description: "Relates a tsunami to a given earthquake",

    requiredProducts: ["lat",  "lon", "mag"],

    providedProduct: "epiCenter",

    wpsVersion: "1.0.0", 

    wizardProperties: {
        shape: "tsunami",
        providerName: "Alfred Wegener Institute, Helmholtz Centre for Polar and Marine Research", 
        providerUrl: "https://www.awi.de/en/"
    }

}