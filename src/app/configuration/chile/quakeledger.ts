import { WpsProcess, ProcessStateUnavailable, Product } from '../../riesgos/riesgos.datatypes';
import {
    StringSelectUconfProduct, BboxUconfProduct, StringUconfProduct,
    BboxUconfPD
} from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerProduct, BboxLayerProduct, BboxLayerDescription } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, WpsDataDescription, WpsBboxValue } from '@ukis/services-ogc';
import { toDecimalPlaces, redGreenRange, linInterpolate, linInterpolateHue } from 'src/app/helpers/colorhelpers';
import { HttpClient } from '@angular/common/http';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { createOlFeature } from 'src/app/helpers/others';
import { feature } from '@turf/helpers';


export class InputBoundingbox implements BboxUconfProduct, BboxLayerProduct, WpsData {
    description: BboxUconfPD & BboxLayerDescription & WpsDataDescription;
    value: WpsBboxValue;
    uid = 'input-boundingbox';

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
                description: 'Please select an area of interest'
            },
        },
        this.value = null;
    }
}

export const mmin: StringUconfProduct & WpsData = {
    uid: 'mmin',
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
    uid: 'mmax',
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
    uid: 'zmin',
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
    uid: 'zmax',
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
    uid: 'p',
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
    uid: 'etype',
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
    uid: 'tlon',
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
    uid: 'tlat',
    description: {
        id: 'tlat',
        description: 'latitude [decimal degrees]',
        defaultValue: '-33.1',
        reference: false,
        type: 'literal'
    },
    value: '-33.1'
};



export const selectedEqs: VectorLayerProduct & WpsData = {
    uid: 'QuakeledgerProcess_selectedRows',
    description: {
        id: 'selectedRows',
        icon: 'earthquake',
        name: 'available earthquakes',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {

                const props = feature.getProperties();
                const magnitude = props['magnitude.mag.value'];
                const depth = props['origin.depth.value'];

                const text = depth + ' km';
                const radius = linInterpolateHue(7, 5, 9, 20, magnitude);
                const [r, g, b] = redGreenRange(5, 60, depth);

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
                let text = `<h3>Available earthquakes</h3>`;
                const selectedProperties = {
                    Magnitude: toDecimalPlaces(properties['magnitude.mag.value'] as number, 1),
                    Depth: toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' km',
                    // Latitude: toDecimalPlaces(1, 1),
                    // Longitude: toDecimalPlaces(2, 1),
                    Id: properties['origin.publicID'],
                };
                if (properties['origin.time.value'] && etype.value === 'observed') {
                    const date = new Date(Date.parse(properties['origin.time.value']));
                    selectedProperties['Date'] = `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
                text: 'EQ<br/>radius: magnitude<br/>color: depth'
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
            [selectedEqs.uid],
            'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
            'Enter here the parameters that determine which earthquakes would be appropriate for your simulation.',
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
