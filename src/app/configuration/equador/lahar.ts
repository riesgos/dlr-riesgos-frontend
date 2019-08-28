import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import {  StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from 'projects/services-wps/src/public-api';


export const direction: StringSelectUconfProduct & WpsData = {
    uid: 'user_direction',
    description: {
        id: 'direction',
        sourceProcessId: 'user',
        reference: false,
        type: 'literal',
        options: ['South', 'North'],
        defaultValue: 'South',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'direction',
        }
    },
    value: null
};

export const intensity: StringSelectUconfProduct & WpsData = {
    uid: 'user_intensity',
    description: {
        id: 'intensity',
        sourceProcessId: 'user',
        reference: false,
        type: 'literal',
        options: ['VEI1', 'VEI2', 'VEI3', 'VEI4'],
        defaultValue: 'VEI1',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'intensity',
        }
    },
    value: null
};

export const parameter: StringSelectUconfProduct & WpsData = {
    uid: 'user_parameter',
    description: {
        id: 'parameter',
        sourceProcessId: 'user',
        reference: false,
        type: 'literal',
        options: ['MaxHeight', 'MaxVelocity', 'MaxPressure', 'MaxErosion', 'Deposition'],
        defaultValue: 'MaxHeight',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'parameter',
        }
    },
    value: null
};


export const laharWms: WmsLayerData & WpsData = {
    uid: 'gs:LaharModel_result',
    description: {
        id: 'result',
        sourceProcessId: 'gs:LaharModel',
        name: 'laharWms',
        type: 'literal',  // this is deliberate. layer-wps returns this value as a litteral, not as a complex.
        reference: false,
        format: 'application/WMS',
    },
    value: null
};



export const LaharWps: WizardableProcess & WpsProcess = {
    id: 'gs:LaharModel',
    url: 'http://91.250.85.221/geoserver/riesgos/wps',
    name: 'Lahar',
    description: 'Simulates the path a lahar would take',
    requiredProducts: [direction, intensity, parameter].map(p => p.uid),
    providedProducts: [laharWms.uid],
    state: new ProcessStateUnavailable(),
    wpsVersion: '1.0.0',
    wizardProperties: {
        providerName: 'EOMAP GMBH',
        providerUrl: 'https://www.eomap.com/',
        shape: 'avalance'
    }
};
