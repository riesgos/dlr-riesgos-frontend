import { WpsProcess, ProcessStateUnavailable, Product } from '../../riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from '@ukis/services-ogc';
import { WmsLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { selectedEq } from './eqselection';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection } from '@turf/helpers';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';


export const shakemapWmsOutput: WpsData & WmsLayerProduct = {
    uid: 'Shakyground_wms',
    description: {
        id: 'shakeMapFile',
        icon: 'earthquake',
        name: 'shakemap',
        type: 'complex',
        reference: false,
        format: 'application/WMS',
        styles: ['shakemap-pga', 'another style'],
        featureInfoRenderer: (fi: FeatureCollection) => {
            return createKeyValueTableHtml('EQ', {'a': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m/s²'});
        }
    },
    value: null
};

export const eqShakemapRef: WpsData & Product = {
    uid: 'Shakyground_shakemap',
    description: {
        id: 'shakeMapFile',
        type: 'complex',
        reference: true,
        format: 'text/xml',
    },
    value: null
};


export class Shakyground extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'Shakyground',
            'Groundmotion Simulation',
            [selectedEq].map(p => p.uid),
            [shakemapWmsOutput, eqShakemapRef].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess',
            'Simulates the ground motion caused by the selected earthquake',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );
        this.wizardProperties = {
            shape: 'earthquake',
            providerName: 'Helmholtz Centre Potsdam',
            providerUrl: 'https://www.gfz-potsdam.de/en/'
        };
    }

}
