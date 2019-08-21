import { WpsProcess, ProcessStateUnavailable } from '../../wps/wps.datatypes';
import { UserconfigurableWpsData, StringSelectUconfWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerData, BboxLayerData } from 'src/app/components/map/mappable_wpsdata';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { Style, Fill, Stroke, Circle, Text } from 'ol/style';


export const inputBoundingbox: UserconfigurableWpsData & BboxLayerData = {
    description: {
        id: 'input-boundingbox',
        name: 'eq-selection: boundingbox',
        type: 'bbox',
        reference: false,
        description: 'Please select an area of interest',
        defaultValue: [-73.5, -34, -70.5, -29.0],
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




const green2red = (magnitude: number): string => {
    const range = 9.5 - 5;
    const part = magnitude - 5;
    let perc = 360.0 * part / range;
    perc = Math.floor(perc);
    return `hsl(${perc}, 100%, 50%)`;
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



export const QuakeLedger: WizardableProcess & WpsProcess = {
    state: new ProcessStateUnavailable(),
    id: 'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
    url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    name: 'Earthquake Catalogue',
    description: 'Catalogue of historical earthquakes.',
    requiredProducts: ['input-boundingbox', 'mmin', 'mmax', 'zmin', 'zmax', 'p', 'etype', 'tlon', 'tlat'],
    providedProduct: 'selectedRows',
    wpsVersion: '1.0.0',

    wizardProperties: {
        shape: 'earthquake',
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    }
};
