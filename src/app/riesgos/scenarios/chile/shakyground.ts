import { WpsProcess, ProcessStateUnavailable, Product } from '../../riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, Cache } from 'src/app/services/wps';
import { WmsLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { selectedEq } from './eqselection';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';


export const shakemapWmsOutput: WpsData & WmsLayerProduct = {
    uid: 'Shakyground_wms',
    description: {
        id: 'shakeMapFile',
        title: 'shakeMapFile',
        icon: 'earthquake',
        name: 'shakemap',
        type: 'complex',
        reference: false,
        format: 'application/WMS',
        styles: ['shakemap-pga'],
        featureInfoRenderer: (fi: FeatureCollection) => {
            const html = `
            <p><b>{{ Ground_acceleration }}:</b></br>a = ${toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2)} m/s²</p>
            `;
            return html;
        },
    },
    value: null
};

export const eqShakemapRef: WpsData & Product = {
    uid: 'Shakyground_shakemap',
    description: {
        id: 'shakeMapFile',
        title: 'shakeMapFile',
        type: 'complex',
        reference: true,
        format: 'text/xml',
        schema: 'http://earthquake.usgs.gov/eqcenter/shakemap',
        encoding: 'UTF-8'
    },
    value: null
};


export const Gmpe: WpsData & StringSelectUconfProduct = {
    uid: 'Shakyground_gmpe',
    description: {
        id: 'gmpe',
        title: 'gmpe',
        type: 'literal',
        reference: false,
        options: [
            'MontalvaEtAl2016SInter',
            'GhofraniAtkinson2014',
            'AbrahamsonEtAl2015SInter',
            'YoungsEtAl1997SInterNSHMP2008'
        ],
        defaultValue: 'MontalvaEtAl2016SInter',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'gmpe',
            description: ''
        }
    },
    value: null
};

export const VsGrid: WpsData & StringSelectUconfProduct = {
    uid: 'Shakyground_vsgrid',
    description: {
        id: 'vsgrid',
        title: 'vsgrid',
        type: 'literal',
        reference: false,
        options: [
            'USGSSlopeBasedTopographyProxy',
            'FromSeismogeotechnicsMicrozonation'
        ],
        defaultValue: 'USGSSlopeBasedTopographyProxy',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'vsgrid',
            description: ''
        }
    },
    value: null
};


export class Shakyground extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient, cache: Cache) {
        super(
            'Shakyground',
            'GroundmotionService',
            [selectedEq, Gmpe, VsGrid].map(p => p.uid),
            [shakemapWmsOutput, eqShakemapRef].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess',
            'EqSimulationShortText',
            'http://rz-vm140.gfz-potsdam.de:8080/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
        this.wizardProperties = {
            shape: 'earthquake',
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            wikiLink: 'EqSimulation'
        };
    }

}
