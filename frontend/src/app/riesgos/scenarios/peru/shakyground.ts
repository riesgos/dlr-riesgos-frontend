import { WpsProcess, ProcessStateUnavailable, Product } from '../../riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, Cache } from '../../../../../../proxy/src/wps/public-api';
import { WmsLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { selectedEqPeru } from './eqselection';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { Gmpe, VsGrid } from '../chile/shakyground';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



export const eqShakemapRefPeru: WpsData & Product = {
    uid: 'Shakyground_shakemapPeru',
    description: {
        id: 'shakeMapFile',
        title: 'shakeMapFile',
        type: 'complex',
        reference: true,
        format: 'text/xml'
    },
    value: null
};


export const shakemapPgaOutputPeru: WpsData & WmsLayerProduct = {
    uid: 'Shakyground_wmsPeru',
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
            <p><b>{{ Ground_acceleration_PGA }}:</b></br>a = ${toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2)} g</p>
            `;
            return html;
        },
    },
    value: null
};

export const shakemapSa03OutputPeru: WpsData & WmsLayerProduct = {
    uid: 'Shakyground_sa03_wmsPeru',
    description: {
        id: 'SA03_shakeMapFile',
        title: 'SA03_shakeMapFile',
        icon: 'earthquake',
        name: 'SA03_shakemap',
        type: 'complex',
        reference: false,
        format: 'application/WMS',
        styles: ['shakemap-pga'],
        featureInfoRenderer: (fi: FeatureCollection) => {
            const html = `
            <p><b>{{ Ground_acceleration_SA03 }}:</b></br>a = ${toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2)} g</p>
            `;
            return html;
        },
    },
    value: null
};

export const shakemapSa10OutputPeru: WpsData & WmsLayerProduct = {
    uid: 'Shakyground_sa10_wmsPeru',
    description: {
        id: 'SA10_shakeMapFile',
        title: 'SA10_shakeMapFile',
        icon: 'earthquake',
        name: 'SA10_shakemap',
        type: 'complex',
        reference: false,
        format: 'application/WMS',
        styles: ['shakemap-pga'],
        featureInfoRenderer: (fi: FeatureCollection) => {
            const html = `
            <p><b>{{ Ground_acceleration_SA10 }}:</b></br>a = ${toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2)} g</p>
            `;
            return html;
        },
    },
    value: null
};

export class ShakygroundPeru extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'ShakygroundPeru',
            'GroundmotionService',
            [selectedEqPeru, Gmpe, VsGrid].map(p => p.uid),
            [eqShakemapRefPeru, shakemapPgaOutputPeru, shakemapSa03OutputPeru, shakemapSa10OutputPeru].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess',
            'EqSimulationShortText',
            'https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );
        this.wizardProperties = {
            shape: 'earthquake',
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            wikiLink: 'EqSimulation'
        };
    }

    execute(inputs: Product[], outputs: Product[], doWhile): Observable<Product[]> {

        // step 1: adjusting outputs.
        // Replacing shakemap-wms'es with shakemap-json-data
        const newOutputs = outputs.filter(i =>
                    i.uid !== shakemapPgaOutputPeru.uid
                &&  i.uid !== shakemapSa03OutputPeru.uid
                &&  i.uid !== shakemapSa10OutputPeru.uid);
        const shakemapSaWmsData: WpsData & Product = {
            uid: 'Shakyground_sa_wms',
            description: {
                id: 'shakeMapFile',
                title: 'shakeMapFile',
                type: 'complex',
                reference: false,
                format: 'application/json',
            },
            value: null
        };
        newOutputs.push(shakemapSaWmsData);

        // step 2: executing
        return super.execute(inputs, newOutputs, doWhile).pipe(
            map((products) => {
                // step 3: reading shakemap-json-data into shakemap-wms'es
                const wmsJsonData = products.find(p => p.uid === shakemapSaWmsData.uid).value[0];
                const newProducts = products.filter(p => p.uid !== shakemapSaWmsData.uid);
                newProducts.push({
                    ... shakemapPgaOutputPeru,
                    value: [wmsJsonData['PGA']]
                });
                newProducts.push({
                    ... shakemapSa03OutputPeru,
                    value: [wmsJsonData['SA(0.3)']]
                });
                newProducts.push({
                    ... shakemapSa10OutputPeru,
                    value: [wmsJsonData['SA(1.0)']]
                });
                return newProducts;
            })
        );
    }


}
