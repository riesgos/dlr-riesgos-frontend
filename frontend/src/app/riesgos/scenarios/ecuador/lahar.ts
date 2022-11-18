import { WizardableStep, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WmsLayerProduct, VectorLayerProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import {  StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection } from '@turf/helpers';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';



export const direction: StringSelectUserConfigurableProduct & WpsData = {
    uid: 'direction',
    description: {
        id: 'direction',
        title: '',
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
        title: '',
        reference: false,
        type: 'literal',
        defaultValue: 'VEI1',
    },
    value: null
};

export const parameter: StringSelectUserConfigurableProduct & WpsData = {
    uid: 'parameter',
    description: {
        id: 'parameter',
        title: '',
        reference: false,
        type: 'literal',
        options: ['MaxHeight', 'MaxVelocity', 'MaxPressure', 'MaxErosion', 'Deposition'],
        defaultValue: 'MaxHeight',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'parameter',
            signpost: `lahar_parameter_signpost`,
        }
    },
    value: null
};


export const laharWms: WmsLayerProduct & WpsData = {
    uid: 'lahar_wms',
    description: {
        id: 'wms',
        title: '',
        icon: 'avalanche',
        name: 'laharWms',
        type: 'literal',  // this is deliberate. layer-wps returns this value as a literal, not as a complex.
        reference: false,
        format: 'application/WMS',
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features.length > 0) {
                return createKeyValueTableHtml('', {'{{ local_value }}': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2)});
            } else {
                return '';
            }
        }
    },
    value: null
};


export const laharShakemap: Product & WpsData = {
    uid: 'lahar_shakemap',
    description: {
        id: 'shakemap',
        title: '',
        format: 'application/xml',
        reference: true,
        type: 'complex',
        schema: 'http://earthquake.usgs.gov/eqcenter/shakemap',
        encoding: 'UTF-8'
    },
    value: null,
};


export class LaharWps extends WpsProcess implements WizardableStep {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient, middleWareUrl: string) {
        super(
            'LaharModel',
            'Lahar',
            [direction, vei, parameter].map(p => p.uid),
            [laharWms.uid, laharShakemap.uid],
            'gs:LaharModel',
            'Process_description_lahar_simulation',
            'https://riesgos.52north.org/geoserver/ows',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            middleWareUrl
        );
        this.wizardProperties = {
            providerName: 'TUM',
            providerUrl: 'https://www.tum.de/nc/en/',
            shape: 'avalanche',
            wikiLink: 'LaharSimulation',
            dataSources: [{ label: 'Frimberger (2021)', href: 'https://doi.org/10.1002/esp.5056'}]
        };
    }
}
