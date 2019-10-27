import { WpsProcess, ProcessStateUnavailable, Product } from '../../wps/wps.datatypes';
import {
    StringSelectUconfProduct, BboxUconfProduct, StringUconfProduct,
    BboxUconfPD
} from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerData, BboxLayerData, BboxLayerDescription } from 'src/app/components/map/mappable_wpsdata';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, WpsDataDescription, WpsBboxValue } from 'projects/services-wps/src/public-api';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { HttpClient } from '@angular/common/http';


export class InputBoundingbox implements BboxUconfProduct, BboxLayerData, WpsData {
    description: BboxUconfPD & BboxLayerDescription & WpsDataDescription;
    value: WpsBboxValue;
    uid = 'user_input-boundingbox';

    constructor() {
        this.description = {
            id: 'input-boundingbox',
            name: 'eq-selection: boundingbox',
            type: 'bbox',
            icon: 'earthquake',
            reference: false,
            defaultValue: {
                crs: 'EPSG:4326',
                lllon: -73.5, lllat: -34,
                urlon: -70.5, urlat: -29.0
            },
            wizardProperties: {
                name: 'AOI',
                fieldtype: 'bbox',
                description: 'Please select an area of interest',
                signpost: 'You can also select a boundingbox by clicking and dragging on the map.'
            },
        },
        this.value = null;
    }
}

export const mmin: StringUconfProduct & WpsData = {
    uid: 'user_mmin',
    description: {
        id: 'mmin',
        type: 'literal',
        wizardProperties: {
            name: 'mmin',
            fieldtype: 'string',
            description: 'minimum magnitude',
        },
        reference: false,
        defaultValue: '6.0',
    },
    value: null
};


export const mmax: StringUconfProduct & WpsData = {
    uid: 'user_mmax',
    description: {
        id: 'mmax',
        type: 'literal',
        wizardProperties: {
            name: 'mmax',
            fieldtype: 'string',
            description: 'maximum magnitude',
        },
        reference: false,
        defaultValue: '9.0',
    },
    value: null
};


export const zmin: StringUconfProduct & WpsData = {
    uid: 'user_zmin',
    description: {
        id: 'zmin',
        defaultValue: '0',
        type: 'literal',
        wizardProperties: {
            name: 'zmin',
            fieldtype: 'string',
            description: 'minimum depth',
        },
        reference: false
    },
    value: null
};

export const zmax: StringUconfProduct & WpsData = {
    uid: 'user_zmax',
    description: {
        id: 'zmax',
        defaultValue: '100',
        type: 'literal',
        wizardProperties: {
            name: 'zmax',
            description: 'maximum depth',
            fieldtype: 'string',
        },
        reference: false
    },
    value: null
};


export const p: Product & WpsData = {
    uid: 'user_p',
    description: {
        id: 'p',
        description: 'p',
        type: 'literal',
        reference: false,
        defaultValue: '0.0',
    },
    value: '0.0'
};


export const etype: StringSelectUconfProduct & WpsData = {
    uid: 'user_etype',
    description: {
        id: 'etype',
        description: 'etype',
        defaultValue: 'expert', // 'deaggregation',
        reference: false,
        type: 'literal',
        wizardProperties: {
            name: 'Catalogue type',
            fieldtype: 'stringselect'
        },
        options: [
            // 'deaggregation', 'observed', 'stochastic',  <--- deactivated
            'expert']
    },
    value: null
};

export const tlon: Product & WpsData = {
    uid: 'user_tlon',
    description: {
        id: 'tlon',
        description: 'longitude [decimal degrees]',
        defaultValue: '-71.5',
        reference: false,
        type: 'literal'
    },
    value: '-71.5'
};


export const tlat: Product & WpsData = {
    uid: 'user_tlat',
    description: {
        id: 'tlat',
        description: 'latitude [decimal degrees]',
        defaultValue: '-33.1',
        reference: false,
        type: 'literal'
    },
    value: '-33.1'
};



export const selectedEqs: VectorLayerData & WpsData = {
    uid: 'QuakeledgerProcess_selectedRows',
    description: {
        id: 'selectedRows',
        icon: 'earthquake',
        name: 'available earthquakes',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            sldFile: '/assets/styles/QuakeledgerStyle.sld',
            text: (properties) => {
                let text = `<h3>Terremotos disponibles</h3>`;
                const selectedProperties = {
                    Magnitud: toDecimalPlaces(properties['magnitude.mag.value'] as number, 1),
                    Profundidad: toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' m',
                    // Latitude: toDecimalPlaces(1, 1),
                    // Longitude: toDecimalPlaces(2, 1),
                    Id: properties['origin.publicID'],
                };
                text += '<table class="table"><tbody>';
                for (const property in selectedProperties) {
                    if (selectedProperties[property]) {
                        const propertyValue = selectedProperties[property];
                        text += `<tr><td>${property}</td> <td>${propertyValue}</td></tr>`;
                    }
                }
                text += '</tbody></table>';
                return text;
            }
        }
    },
    value: null
};



export class QuakeLedger extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'Quakeledger',
            'Earthquake Catalogue',
            ['user_input-boundingbox'].concat([mmin, mmax, zmin, zmax, p, etype, tlon, tlat].map(prd => prd.uid)),
            [selectedEqs.uid],
            'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
            'Catalogue of earthquakes. Enter here the parameters that determine which earthquakes would be appropriate for your simulation.',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
        );

        this.wizardProperties = {
            shape: 'earthquake',
            providerName: 'Helmholtz Centre Potsdam',
            providerUrl: 'https://www.gfz-potsdam.de/en/'
        };
    }

};
