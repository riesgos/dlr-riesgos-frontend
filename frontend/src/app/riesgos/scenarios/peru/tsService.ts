import { WpsProcess, ProcessStateUnavailable, Product, ExecutableProcess, ProcessState } from '../../riesgos.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, Cache } from 'src/app/services/wps';
import { Observable, forkJoin, concat } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { selectedEqPeru } from './eqselection';
import { WmsLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { FeatureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';



const latPeru: WpsData & Product = {
    uid: 'auto_lat_peru',
    description: {
        id: 'lat',
        title: 'lat',
        reference: false,
        type: 'literal',
    },
    value: null
};

const lonPeru: WpsData & Product = {
    uid: 'auto_lon_peru',
    description: {
        id: 'lon',
        title: 'lon',
        reference: false,
        type: 'literal',
    },
    value: null
};

const magPeru: WpsData & Product = {
    uid: 'auto_mag_peru',
    description: {
        id: 'mag',
        title: 'mag',
        reference: false,
        type: 'literal',
    },
    value: null
};


export const tsWmsPeru: WpsData & WmsLayerProduct = {
    uid: 'get_scenario_epiCenter_peru',
    description: {
        id: 'epiCenter',
        title: 'epiCenter',
        name: 'ts-wms',
        icon: 'tsunami',
        reference: false,
        format: 'string',
        type: 'literal',
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features[0] && fi.features[0].properties['GRAY_INDEX']) {
                return createKeyValueTableHtml('Tsunami', {'mwh': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m'}, 'medium');
            }
        }
    },
    value: null
};


export class TsWmsServicePeru extends WpsProcess {

    constructor(http: HttpClient, cache: Cache) {
        super(
            'get_scenario_peru',
            'Earthquake/tsunami interaction',
            [latPeru, lonPeru, magPeru].map(p => p.uid),
            [tsWmsPeru.uid],
            'get_scenario',
            'Relates a tsunami to the selected earthquake',
            'http://tsunami-wps.awi.de/wps',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
    }

}


export const tsShakemapPeru: WpsData & Product = {
    uid: 'ts_shakemap_peru',
    description: {
        id: 'tsunamap',
        title: 'tsunamap',
        reference: true,
        type: 'complex',
        format: 'application/xml'
    },
    value: null
};


export class TsShakemapServicePeru extends WpsProcess {
    constructor(http: HttpClient, cache: Cache) {
        super(
            'get_tsunamap_peru',
            'get_tsunamap',
            [latPeru, lonPeru, magPeru].map(p => p.uid),
            [tsShakemapPeru.uid],
            'get_tsunamap',
            'Input is earthquake epicenter (lon,lat) with magnitude, output is the nearest Tsunami epicenter and Inundation in shakemap format',
            'http://tsunami-wps.awi.de/wps',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
    }
}

export class TsServicePeru implements WizardableProcess, ExecutableProcess {

    uid = 'ts-service_peru';
    name = 'TS-Service';
    state: ProcessState;
    description = 'TsShortDescription';

    wizardProperties = {
        providerName: 'AWI',
        providerUrl: 'https://www.awi.de/en/',
        shape: 'tsunami' as 'tsunami',
        wikiLink: 'TsunamiWiki'
    };

    private tsShakemapService: TsShakemapServicePeru;
    private tsWmsService: TsWmsServicePeru;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];

    constructor(private httpClient: HttpClient, cache: Cache) {
        this.state = new ProcessStateUnavailable();
        this.tsWmsService = new TsWmsServicePeru(httpClient, cache);
        this.tsShakemapService = new TsShakemapServicePeru(httpClient, cache);
        this.requiredProducts = [selectedEqPeru.uid],
        this.providedProducts = this.tsWmsService.providedProducts.concat(this.tsShakemapService.providedProducts);
    }

    execute = (inputs: Product[], outputs: Product[], doWhileExecuting): Observable<Product[]> => {

        const theSelectedEq = inputs.find(p => p.uid === selectedEqPeru.uid);
        const newInputs = [{
            ... lonPeru,
            value: theSelectedEq.value[0].features[0].geometry.coordinates[0]
        }, {
            ...latPeru,
            value: theSelectedEq.value[0].features[0].geometry.coordinates[1]
        }, {
            ...magPeru,
            value: theSelectedEq.value[0].features[0].properties['magnitude.mag.value']
        }];

        const inputsWms = newInputs;
        const outputsWms = outputs.filter(i => this.tsWmsService.providedProducts.includes(i.uid));
        const inputsShkmp = newInputs;
        const outputsShkmp = outputs.filter(i => this.tsShakemapService.providedProducts.includes(i.uid));

        const proc1$ = this.tsWmsService.execute(inputsWms, outputsWms, doWhileExecuting);
        const proc2$ = this.tsShakemapService.execute(inputsShkmp, outputsShkmp, doWhileExecuting);

        return concat(proc2$, proc1$);

        // return forkJoin(proc1$, proc2$).pipe(
        //     map((results: Product[][]) => {
        //         const flattened: Product[] = [];
        //         for (const result of results) {
        //             for (const data of result) {
        //                 flattened.push(data);
        //             }
        //         }
        //         return flattened;
        //     })
        // );
    }

}
