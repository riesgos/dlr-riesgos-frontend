import { WpsProcess, ProcessStateUnavailable, Product } from '../../riesgos.datatypes';
import {
    StringSelectUserConfigurableProduct, BboxUserConfigurableProduct, StringUserConfigurableProduct,
    BboxUserConfigurableProductDescription
} from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerProduct, BboxLayerProduct, BboxLayerDescription } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, WpsDataDescription, WpsBboxValue, Cache } from '../../../../../../proxy/src/wps/public-api';
import { toDecimalPlaces, redGreenRange, linInterpolateXY, greenRedRange } from 'src/app/helpers/colorhelpers';
import { HttpClient } from '@angular/common/http';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle } from 'ol/style';
import olFeature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';


export const InputBoundingbox: BboxUserConfigurableProduct & BboxLayerProduct & WpsData = {
    uid: 'input-boundingbox',
    description: {
        id: 'input-boundingbox',
        title: '',
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
            description: 'AOI_selection',
        },
    },
    value: null
};


export const mmin: StringUserConfigurableProduct & WpsData = {
    uid: 'mmin',
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
    value: '6.0'
};


export const mmax: StringUserConfigurableProduct & WpsData = {
    uid: 'mmax',
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


export const zmin: StringUserConfigurableProduct & WpsData = {
    uid: 'zmin',
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

export const zmax: StringUserConfigurableProduct & WpsData = {
    uid: 'zmax',
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


export const p: Product & WpsData = {
    uid: 'p',
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


export const etype: StringSelectUserConfigurableProduct & WpsData = {
    uid: 'etype',
    description: {
        id: 'etype',
        title: '',
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
    uid: 'tlon',
    description: {
        id: 'tlon',
        title: '',
        description: 'longitude [decimal degrees]',
        defaultValue: '-71.5',
        reference: false,
        type: 'literal'
    },
    value: '-71.5'
};


export const tlat: Product & WpsData = {
    uid: 'tlat',
    description: {
        id: 'tlat',
        title: '',
        description: 'latitude [decimal degrees]',
        defaultValue: '-33.1',
        reference: false,
        type: 'literal'
    },
    value: '-33.1'
};



export const availableEqs: VectorLayerProduct & WpsData = {
    uid: 'QuakeledgerProcess_selectedRows',
    description: {
        id: 'selectedRows',
        title: '',
        icon: 'earthquake',
        name: 'available earthquakes',
        description: 'CatalogueData',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number, selected: boolean) => {

                const props = feature.getProperties();
                const magnitude = props['magnitude.mag.value'];
                const depth = props['origin.depth.value'];

                let radius = linInterpolateXY(5, 10, 60, 5, depth);
                const [r, g, b] = greenRedRange(6, 9, magnitude);

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
                if (properties['origin.time.value'] && etype.value === 'observed') {
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
                        'magnitude.mag.value': 6.0,
                        'origin.depth.value': 40.0
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [ 5.625, 50.958426723359935 ]
                      }
                  },
                text: 'Mag. 6'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {
                        'magnitude.mag.value': 7.0,
                        'origin.depth.value': 40.0
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [ 5.625, 50.958426723359935 ]
                      }
                  },
                text: 'Mag. 7'
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
                text: 'Mag. 8'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {
                        'magnitude.mag.value': 9.0,
                        'origin.depth.value': 40.0
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [ 5.625, 50.958426723359935 ]
                      }
                  },
                text: 'Mag. 9'
            }]
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
            ['input-boundingbox'].concat([mmin, mmax, zmin, zmax, p, etype, tlon, tlat].map(prd => prd.uid)),
            [availableEqs.uid],
            'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
            'Enter here the parameters that determine which earthquakes would be appropriate for your simulation.',
            'https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );

        this.wizardProperties = {
            shape: 'bullseye',
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            wikiLink: 'EqSimulation'
        };
    }

}
