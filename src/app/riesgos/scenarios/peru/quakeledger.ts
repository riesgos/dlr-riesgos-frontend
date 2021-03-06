import { WpsProcess, ProcessStateUnavailable, Product } from '../../riesgos.datatypes';
import { StringSelectUconfProduct, BboxUconfProduct, BboxUconfPD, StringUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { BboxLayerProduct, BboxLayerDescription, VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, WpsDataDescription, WpsBboxValue, Cache } from '@dlr-eoc/utils-ogc';
import { HttpClient } from '@angular/common/http';
import { toDecimalPlaces, linInterpolateXY, redGreenRange } from 'src/app/helpers/colorhelpers';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { TableEntry, InfoTableComponentComponent } from 'src/app/components/dynamic/info-table-component/info-table-component.component';



export class InputBoundingboxPeru implements BboxUconfProduct, BboxLayerProduct, WpsData {
    description: BboxUconfPD & BboxLayerDescription & WpsDataDescription;
    value: WpsBboxValue;
    uid = 'input-boundingbox_peru';

    constructor() {
        this.description = {
            id: 'input-boundingbox',
            title: '',
            icon: 'earthquake',
            name: 'eq-selection: boundingbox',
            type: 'bbox',
            reference: false,
            defaultValue: {
                crs: 'EPSG:4326',
                lllon: -86.5, lllat: -20.5,
                urlon: -68.5, urlat: -0.6
            },
            wizardProperties: {
                name: 'AOI',
                fieldtype: 'bbox',
                description: 'Please select an area of interest',
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
        options: ['observed', 'expert'] // 'stochastic' <-- currently not included due to errors in data
    },
    value: null
};


export const tlonPeru: Product & WpsData = {
    uid: 'tlon_peru',
    description: {
        id: 'tlon',
        title: '',
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
        title: '',
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
        title: '',
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
        title: '',
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
        title: '',
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
        title: '',
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
        title: '',
        description: 'p',
        type: 'literal',
        reference: false,
        defaultValue: '0.0',
    },
    value: '0.0'
};



export const selectedEqsPeru: VectorLayerProduct & WpsData = {
    uid: 'QuakeledgerProcess_selectedRowsPeru',
    description: {
        id: 'selectedRows',
        title: '',
        icon: 'earthquake',
        name: 'available earthquakes',
        description: 'Catalog data',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number, selected: boolean) => {

                const props = feature.getProperties();
                const magnitude = props['magnitude.mag.value'];
                const depth = props['origin.depth.value'];

                const text = depth + ' km';
                let radius = linInterpolateXY(7, 5, 9, 20, magnitude);
                const [r, g, b] = redGreenRange(5, 60, depth);

                if (selected) {
                    radius += 4;
                }

                return new olStyle({
                    image: new olCircle({
                        radius: radius,
                        fill: new olFill({
                            color: [r, g, b, 0.5]
                        }),
                        stroke: new olStroke({
                            color: [r, g, b, 1]
                        }),
                        text: new olText({
                            text: text
                        })
                    })
                });
            },
            text: (properties) => {
                let text = `<h3>{{ Available_earthquakes }}</h3>`;
                const selectedProperties = {
                    '{{ Magnitude }}': toDecimalPlaces(properties['magnitude.mag.value'] as number, 1),
                    '{{ Depth }}': toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' km',
                    Id: properties['origin.publicID'],
                };
                if (properties['origin.time.value'] && etypePeru.value === 'observed') {
                    const date = new Date(Date.parse(properties['origin.time.value']));
                    selectedProperties['{{ Date }}'] = `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;
                }
                text += '<table class="table"><tbody>';
                for (const property in selectedProperties) {
                    if (selectedProperties[property]) {
                        const propertyValue = selectedProperties[property];
                        text += `<tr><td>${property}</td> <td>${propertyValue}</td></tr>`;
                    }
                }
                text += '</tbody></table>';
                return text;
            },
            legendEntries: [{
                feature: {
                    "type": "Feature",
                    "properties": {
                        'magnitude.mag.value': 3.0,
                        'origin.depth.value': 40.0
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [ 5.625, 50.958426723359935 ]
                      }
                  },
                text: 'Magnitude 3, depth 40'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {
                        'magnitude.mag.value': 8.0,
                        'origin.depth.value': 40.0
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [ 5.625, 50.958426723359935 ]
                      }
                  },
                text: 'Magnitude 8, depth 40'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {
                        'magnitude.mag.value': 3.0,
                        'origin.depth.value': 20.0
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [ 5.625, 50.958426723359935 ]
                      }
                  },
                text: 'Magnitude 3, depth 20'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {
                        'magnitude.mag.value': 8.0,
                        'origin.depth.value': 20.0
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [ 5.625, 50.958426723359935 ]
                      }
                  },
                text: 'Magnitude 8, depth 20'
            }]
        }
    },
    value: null
};

export class QuakeLedgerPeru extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient, cache: Cache) {
        super(
            'Quakeledger Peru',
            'Earthquake Catalogue',
            ['input-boundingbox_peru'].concat([mminPeru, mmaxPeru, zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru].map(prd => prd.uid)),
            [selectedEqsPeru.uid],
            'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
            'Catalogue of earthquakes. Enter here the parameters that determine which earthquakes would be appropriate for your simulation.',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );

        this.wizardProperties = {
            shape: 'earthquake',
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            wikiLink: 'quakeledger'
        };
    }

}
