import { WpsProcess, ProcessStateUnavailable, Product } from '../../wps/wps.datatypes';
import { StringSelectUconfProduct, BboxUconfProduct, StringUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerData, BboxLayerData } from 'src/app/components/map/mappable_wpsdata';
import { WizardableProcess, WizzardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { HttpClient } from '@angular/common/http';


export const inputBoundingbox: BboxUconfProduct & BboxLayerData & WpsData = {
    uid: 'user_input-boundingbox',
    description: {
        id: 'input-boundingbox',
        name: 'eq-selection: boundingbox',
        type: 'bbox',
        reference: false,
        description: 'Please select an area of interest',
        defaultValue: {
            crs: 'EPSG:4326',
            lllon: -73.5, lllat: -34,
            urlon: -70.5, urlat: -29.0
        },
        wizardProperties: {
            name: 'AOI',
            fieldtype: 'bbox',
            description: 'You can also select a boundingbox by clicking and dragging on the map.'
        },
    },
    value: null
};

export const mmin: StringUconfProduct & WpsData = {
    uid: 'user_mmin',
    description: {
        id: 'mmin',
        type: 'literal',
        wizardProperties: {
            name: 'mmin',
            fieldtype: 'string',
        },
        description: 'minimum magnitude',
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
        },
        description: 'maximum magnitude',
        reference: false,
        defaultValue: '9.0',
    },
    value: null
};


export const zmin: StringUconfProduct & WpsData = {
    uid: 'user_zmin',
    description: {
        id: 'zmin',
        description: 'minimum depth',
        defaultValue: '0',
        type: 'literal',
        wizardProperties: {
            name: 'zmin',
            fieldtype: 'string',
        },
        reference: false
    },
    value: null
};

export const zmax: StringUconfProduct & WpsData = {
    uid: 'user_zmax',
    description: {
        id: 'zmax',
        description: 'maximum depth',
        defaultValue: '100',
        type: 'literal',
        wizardProperties: {
            name: 'zmax',
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
        defaultValue: '0.1',
    },
    value: '0.1'
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

export const tlon: StringUconfProduct & WpsData = {
    uid: 'user_tlon',
    description: {
        id: 'tlon',
        description: 'longitude [decimal degrees]',
        defaultValue: '5.00',
        reference: false,
        wizardProperties: {
            name: 'tlon',
            fieldtype: 'string',
        },
        type: 'literal'
    },
    value: null
};


export const tlat: StringUconfProduct & WpsData = {
    uid: 'user_tlat',
    description: {
        id: 'tlat',
        description: 'latitude [decimal degrees]',
        defaultValue: '-35.00',
        reference: false,
        wizardProperties: {
            name: 'tlat',
            fieldtype: 'string',
        },
        type: 'literal'
    },
    value: null
};



export const selectedEqs: VectorLayerData & WpsData = {
    uid: 'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_selectedRows',
    description: {
        id: 'selectedRows',
        name: 'available earthquakes',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            sldFile: '/assets/styles/QuakeledgerStyle.sld',
            text: (properties) => {
                let text = `<h3>Available earthquakes</h3>`;
                const selectedProperties = {
                    Id: properties['origin.publicID'],
                    Magnitude: Math.round(properties['magnitude.mag.value'] * 100) / 100,
                    Depth: Math.round(properties['origin.depth.value'] * 100) / 100 + ' m'
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

    readonly wizardProperties: WizzardProperties;

    constructor(http: HttpClient) {
        super(
            'Quakeledger',
            'Earthquake Catalogue',
            [inputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat].map(prd => prd.uid),
            [selectedEqs.uid],
            'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
            'Catalogue of historical earthquakes.',
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
