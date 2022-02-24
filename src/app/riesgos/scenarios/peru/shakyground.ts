import { WpsProcess, ProcessStateUnavailable, Product } from '../../riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, Cache } from 'src/app/services/wps';
import { WmsLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { selectedEqPeru } from './eqselection';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { Gmpe, VsGrid } from '../chile/shakyground';


export const shakemapWmsOutputPeru: WpsData & WmsLayerProduct = {
    uid: 'ShakygroundProcess_shakeMapFile_wmsPeru',
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

export const eqShakemapRefPeru: WpsData & Product = {
    uid: 'ShakygroundProcess_shakeMapFile_shakemapPeru',
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


export class ShakygroundPeru extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient, cache: Cache) {
        super(
            'ShakygroundPeru',
            'GroundmotionService',
            [selectedEqPeru, Gmpe, VsGrid].map(p => p.uid),
            [shakemapWmsOutputPeru, eqShakemapRefPeru].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess',
            'EqSimulationShortText',
            'https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
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
