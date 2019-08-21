import { WpsProcess, ProcessStateUnavailable, WatchingProcess, Product } from '../../wps/wps.datatypes';
import { UserconfigurableWpsData, StringSelectUconfWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerData, BboxLayerData } from 'src/app/components/map/mappable_wpsdata';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { Style, Fill, Stroke, Circle, Text } from 'ol/style';
import { selectedRows } from '../chile/modelProp';


export const inputBoundingboxPeru: UserconfigurableWpsData & BboxLayerData = {
    description: {
        id: 'input-boundingbox',
        name: 'eq-selection: boundingbox',
        type: 'bbox',
        reference: false,
        description: 'Please select an area of interest',
        defaultValue: [-86.5, -20.5, -68.5, -0.6],
        wizardProperties: {
            name: 'AOI',
            fieldtype: 'bbox',
        },
    },
    value: null
};

export const mmin: UserconfigurableWpsData = {
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


export const mmax: UserconfigurableWpsData = {
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


export const zmin: UserconfigurableWpsData = {
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

export const zmax: UserconfigurableWpsData = {
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


export const p: UserconfigurableWpsData = {
    description: {
        id: 'p',
        description: 'p',
        type: 'literal',
        wizardProperties: {
            name: 'p',
            fieldtype: 'string',
        },
        reference: false,
        defaultValue: '0.1',
    },
    value: null
};


export const etype: StringSelectUconfWpsData = {
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

export const tlon: UserconfigurableWpsData = {
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


export const tlat: UserconfigurableWpsData = {
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



export const selectedEqs: VectorLayerData = {
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



export const EqEventCataloguePeru: WizardableProcess & WpsProcess & WatchingProcess = {
    state: new ProcessStateUnavailable(),
    id: 'org.n52.wps.python.algorithm.QuakeMLProcessBBox',
    url: 'https://riesgos.52north.org/wps/WebProcessingService',
    name: 'Earthquake Catalogue',
    description: 'Catalogue of historical earthquakes.',
    requiredProducts: ['input-boundingbox', 'mmin', 'mmax', 'zmin', 'zmax', 'p', 'etype', 'tlon', 'tlat'],
    providedProduct: 'selectedRows',
    wpsVersion: '1.0.0',

    wizardProperties: {
        shape: 'earthquake',
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    },

    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        const outprods: Product[] = [];

        if (newProduct.description.id === 'selectedRows') {

            console.log('quakeledger: providing provisional eqs')
            outprods.push({
                ...selectedRows,
                value: [
                    {
                        "type": "FeatureCollection",
                        "features": [
                            {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [
                                        -75.902, -11.490
                                    ]
                                },
                                "properties": {
                                    "preferredOriginID": "CHOA_110",
                                    "preferredMagnitudeID": "CHOA_110",
                                    "type": "earthquake",
                                    "description.text": "expert",
                                    "origin.publicID": "CHOA_110",
                                    "origin.time.value": "2018-01-01T00:00:00.000000Z",
                                    "origin.time.uncertainty": "nan",
                                    "origin.depth.value": "28.0",
                                    "origin.depth.uncertainty": "nan",
                                    "origin.creationInfo.value": "GFZ",
                                    "originUncertainty.horizontalUncertainty": "nan",
                                    "originUncertainty.minHorizontalUncertainty": "nan",
                                    "originUncertainty.maxHorizontalUncertainty": "nan",
                                    "originUncertainty.azimuthMaxHorizontalUncertainty": "nan",
                                    "magnitude.publicID": "CHOA_110",
                                    "magnitude.mag.value": "8.0",
                                    "magnitude.mag.uncertainty": "nan",
                                    "magnitude.type": "MW",
                                    "magnitude.creationInfo.value": "GFZ",
                                    "focalMechanism.publicID": "CHOA_110",
                                    "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                                    "focalMechanism.nodalPlanes.nodalPlane1.strike.uncertainty": "nan",
                                    "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                                    "focalMechanism.nodalPlanes.nodalPlane1.dip.uncertainty": "nan",
                                    "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                                    "focalMechanism.nodalPlanes.nodalPlane1.rake.uncertainty": "nan",
                                    "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
                                },
                                "id": "CHOA_110"
                            },
                        ]
                    }
                ]
            });
        }

        return outprods;
    }
};
