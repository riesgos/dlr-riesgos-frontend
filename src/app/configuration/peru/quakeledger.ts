import { WpsProcess, ProcessStateUnavailable, Product } from '../../wps/wps.datatypes';
import { StringSelectUconfProduct, BboxUconfProduct, BboxUconfPD, StringUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { BboxLayerData, BboxLayerDescription, VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, WpsDataDescription, WpsBboxValue } from 'projects/services-wps/src/public-api';
import { HttpClient } from '@angular/common/http';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';



export class InputBoundingboxPeru implements BboxUconfProduct, BboxLayerData, WpsData {
    description: BboxUconfPD & BboxLayerDescription & WpsDataDescription;
    value: WpsBboxValue;
    uid = 'user_input-boundingbox_peru';

    constructor() {
        this.description = {
            id: 'input-boundingbox',
            name: 'eq-selection: boundingbox',
            type: 'bbox',
            reference: false,
            description: 'Please select an area of interest',
            defaultValue: {
                crs: 'EPSG:4326',
                lllon: -86.5, lllat: -20.5,
                urlon: -68.5, urlat: -0.6
            },
            wizardProperties: {
                name: 'AOI',
                fieldtype: 'bbox',
                signpost: 'You can also select a boundingbox by clicking and dragging on the map.'
            },
        },
        this.value = null;
    }
}


export const etypePeru = {
    uid: 'etype',
    description: {
        id: 'etype',
        description: 'etype',
        defaultValue: 'observed', // 'deaggregation',
        reference: false,
        type: 'literal',
        wizardProperties: {
            name: 'Catalogue type',
            fieldtype: 'stringselect'
        },
        options: ['observed', 'stochastic']
    },
    value: null
};


export const tlonPeru: Product & WpsData = {
    uid: 'tlon_peru',
    description: {
        id: 'tlon',
        description: 'longitude [decimal degrees]',
        defaultValue: '-77.00',
        reference: false,
        type: 'literal'
    },
    value: '-77.00'
};


export const tlatPeru: Product & WpsData = {
    uid: 'tlat_peru',
    description: {
        id: 'tlat',
        description: 'latitude [decimal degrees]',
        defaultValue: '-12.00',
        reference: false,
        type: 'literal'
    },
    value: '-12.00'
};




export const mminPeru: StringUconfProduct & WpsData = {
    uid: 'mmin_peru',
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


export const mmaxPeru: StringUconfProduct & WpsData = {
    uid: 'mmax_peru',
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


export const zminPeru: StringUconfProduct & WpsData = {
    uid: 'zmin_peru',
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

export const zmaxPeru: StringUconfProduct & WpsData = {
    uid: 'zmax_peru',
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


export const pPeru: Product & WpsData = {
    uid: 'p_peru',
    description: {
        id: 'p',
        description: 'p',
        type: 'literal',
        reference: false,
        defaultValue: '0.0',
    },
    value: '0.0'
};



export const selectedEqsPeru: VectorLayerData & WpsData = {
    uid: 'QuakeledgerProcess_selectedRowsPeru',
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
                    Magnitude: toDecimalPlaces(properties['magnitude.mag.value'] as number, 1),
                    Depth: toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' m',
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

export class QuakeLedgerPeru extends WpsProcess implements WizardableProcess {

    wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'Quakeledger Peru',
            'Earthquake Catalogue',
            [mminPeru, mmaxPeru, zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru].map(prd => prd.uid).concat(['user_input-boundingbox_peru']),
            [selectedEqsPeru.uid],
            'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
            'Catalogue of earthquakes. Enter here the parameters that determine which earthquakes would be appropriate for your simulation.',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?',
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

}
