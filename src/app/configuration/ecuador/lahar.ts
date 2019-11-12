import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import {  StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from 'projects/services-wps/src/public-api';
import { HttpClient } from '@angular/common/http';


export const direction: StringSelectUconfProduct & WpsData = {
    uid: 'direction',
    description: {
        id: 'direction',
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

export const vei: Product & WpsData = {
    uid: 'intensity',
    description: {
        id: 'intensity',
        reference: false,
        type: 'literal',
        defaultValue: 'VEI1',
    },
    value: null
};

export const parameter: StringSelectUconfProduct & WpsData = {
    uid: 'parameter',
    description: {
        id: 'parameter',
        reference: false,
        type: 'literal',
        options: ['MaxHeight', 'MaxVelocity', 'MaxPressure', 'MaxErosion', 'Deposition'],
        defaultValue: 'MaxHeight',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'parameter',
            signpost: `
            <ol>
                <li>MaxHeight [m]: Maximum flow height, that the lahar can reach during the event</li>
                <li>MaxVelocity [m/s]: Maximum flow velocity, that the lahar can reach during the event</li>
                <li>MaxPressure [kPa]: Maximum flow pressure, that the lahar can reach during the event</li>
                <li>MaxErosion [m]: Maximum depth of erosion, that the lahar can entrain during the event</li>
                <li>Deposition [m]: Height of deposited material after the lahar event</li>
            </ol>
            `
        }
    },
    value: null
};


export const laharWms: WmsLayerData & WpsData = {
    uid: 'lahar_wms',
    description: {
        id: 'wms',
        icon: 'avalance',
        name: 'laharWms',
        type: 'literal',  // this is deliberate. layer-wps returns this value as a litteral, not as a complex.
        reference: false,
        format: 'application/WMS',
    },
    value: null
};


export const laharShakemap: Product & WpsData = {
    uid: 'lahar_shakemap',
    description: {
        id: 'shakemap',
        format: 'application/xml',
        reference: true,
        type: 'complex'
    },
    value: null,
};


export class LaharWps extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'LaharModel',
            'Lahar',
            [direction, vei, parameter].map(p => p.uid),
            [laharWms.uid, laharShakemap.uid],
            'gs:LaharModel',
            'The lahar service returns the area inundated by lahars of the Cotopaxi volcano, and relies on pre-calculated simulation results for flow height, flow velocity, flow pressure, erosion, and deposition. The simulation software used for lahar modelling is the physically based numerical model RAMMS::DEBRIS FLOW.',
            'http://91.250.85.221/geoserver/riesgos/wps',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );
        this.wizardProperties = {
            providerName: 'TUM',
            providerUrl: 'https://www.tum.de/nc/en/',
            shape: 'avalance'
        };
    }
}
