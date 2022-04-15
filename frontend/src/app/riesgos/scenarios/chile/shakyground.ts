import { WpsProcess, ProcessStateUnavailable, Product } from '../../riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { WmsLayerProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import { selectedEq } from './eqselection';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



export const eqShakemapRef: WpsData & Product = {
    uid: 'Shakyground_shakemap',
    description: {
        id: 'shakeMapFile',
        title: 'shakeMapFile',
        type: 'complex',
        reference: true,
        format: 'text/xml'
    },
    value: null
};

export const shakemapPgaOutput: WpsData & WmsLayerProduct = {
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
            <p><b>{{ Ground_acceleration_PGA }}:</b></br>a = ${toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2)} g</p>
            `;
            return html;
        },
    },
    value: null
};

export const shakemapSa03WmsOutput: WpsData & WmsLayerProduct = {
    uid: 'Shakyground_sa03_wms',
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

export const shakemapSa10WmsOutput: WpsData & WmsLayerProduct = {
    uid: 'Shakyground_sa10_wms',
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

export const Gmpe: WpsData & StringSelectUserConfigurableProduct = {
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

export const VsGrid: WpsData & StringSelectUserConfigurableProduct = {
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

    constructor(http: HttpClient) {
        super(
            'Shakyground',
            'GroundmotionService',
            [selectedEq, Gmpe, VsGrid].map(p => p.uid),
            [eqShakemapRef, shakemapPgaOutput, shakemapSa03WmsOutput, shakemapSa10WmsOutput].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess',
            'EqSimulationShortText',
            `https://rz-vm140.gfz-potsdam.de:${ environment.production ? '' : '8443' }/wps/WebProcessingService`,
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
                    i.uid !== shakemapPgaOutput.uid
                &&  i.uid !== shakemapSa03WmsOutput.uid
                &&  i.uid !== shakemapSa10WmsOutput.uid);
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
                    ... shakemapPgaOutput,
                    value: [wmsJsonData['PGA']]
                });
                newProducts.push({
                    ... shakemapSa03WmsOutput,
                    value: [wmsJsonData['SA(0.3)']]
                });
                newProducts.push({
                    ... shakemapSa10WmsOutput,
                    value: [wmsJsonData['SA(1.0)']]
                });
                return newProducts;
            })
        );
    }

}
