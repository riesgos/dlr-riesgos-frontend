import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WmsLayerProduct, VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import {  StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData, Cache } from 'src/app/services/wps';
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


export class LaharWps extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient, cache: Cache) {
        super(
            'LaharModel',
            'Lahar',
            [direction, vei, parameter].map(p => p.uid),
            [laharWms.uid, laharShakemap.uid],
            'gs:LaharModel',
            'The lahar service returns the area inundated by lahars of the Cotopaxi volcano, and relies on pre-calculated simulation results for flow height, flow velocity, flow pressure, erosion, and deposition. The simulation software used for lahar modelling is the physically based numerical model RAMMS::DEBRIS FLOW.',
            'https://riesgos.52north.org/geoserver/ows',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
        this.wizardProperties = {
            providerName: 'TUM',
            providerUrl: 'https://www.tum.de/nc/en/',
            shape: 'avalanche',
            wikiLink: 'LaharSimulation'
        };
    }
}
