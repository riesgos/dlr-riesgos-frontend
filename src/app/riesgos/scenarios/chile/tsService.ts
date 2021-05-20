import { WpsProcess, ProcessStateUnavailable, Product, ExecutableProcess, ProcessState } from '../../riesgos.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, WpsClient, Cache } from '@dlr-eoc/utils-ogc';
import { selectedEq } from './eqselection';
import { Observable, forkJoin, concat } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WmsLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { map } from 'rxjs/operators';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { FeatureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';



const lat: WpsData & Product = {
    uid: 'auto_lat',
    description: {
        id: 'lat',
        title: 'lat',
        reference: false,
        type: 'literal',
    },
    value: null
};

const lon: WpsData & Product = {
    uid: 'auto_lon',
    description: {
        id: 'lon',
        title: '',
        reference: false,
        type: 'literal',
    },
    value: null
};

const mag: WpsData & Product = {
    uid: 'auto_mag',
    description: {
        id: 'mag',
        title: '',
        reference: false,
        type: 'literal',
    },
    value: null
};


export const tsWms: WpsData & WmsLayerProduct = {
    uid: 'get_scenario_epiCenter',
    description: {
        id: 'epiCenter',
        title: '',
        name: 'ts-wms',
        icon: 'tsunami',
        reference: false,
        format: 'application/WMS',
        type: 'literal',
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features[0] && fi.features[0].properties['GRAY_INDEX']) {
                return createKeyValueTableHtml('Tsunami', {'mwh': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m'}, 'medium');
            }
        }
    },
    value: null
};


export class TsWmsService extends WpsProcess {

    constructor(http: HttpClient, cache: Cache) {
        super(
            'get_scenario',
            'Earthquake/tsunami interaction',
            [lat, lon, mag].map(p => p.uid),
            [tsWms.uid],
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


export const tsShakemap: WpsData & Product = {
    uid: 'ts_shakemap',
    description: {
        id: 'tsunamap',
        title: '',
        reference: true,
        type: 'complex',
        format: 'application/xml'
    },
    value: null
};


export class TsShakemapService extends WpsProcess {
    constructor(http: HttpClient, cache: Cache) {
        super(
            'get_tsunamap',
            'get_tsunamap',
            [lat, lon, mag].map(p => p.uid),
            [tsShakemap.uid],
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

export class TsService implements WizardableProcess, ExecutableProcess {

    uid = 'ts-service';
    name = 'TS-Service';
    description = 'Simulates a tsunami based on the earlier selected earthquake-parameters.';
    state: ProcessState;

    wizardProperties = {
        providerName: 'AWI',
        providerUrl: 'https://www.awi.de/en/',
        shape: 'tsunami' as 'tsunami',
        wikiLink: 'Tsunami'
    };

    private tsShakemapService: TsShakemapService;
    private tsWmsService: TsWmsService;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];

    constructor(private httpClient: HttpClient, cache: Cache) {
        this.state = new ProcessStateUnavailable();
        this.tsWmsService = new TsWmsService(httpClient, cache);
        this.tsShakemapService = new TsShakemapService(httpClient, cache);
        this.requiredProducts = [selectedEq.uid],
        this.providedProducts = this.tsWmsService.providedProducts.concat(this.tsShakemapService.providedProducts);
    }

    execute = (inputs: Product[], outputs: Product[], doWhileExecuting): Observable<Product[]> => {

        const theSelectedEq = inputs.find(p => p.uid === selectedEq.uid);
        const newInputs = [{
            ... lon,
            value: theSelectedEq.value[0].features[0].geometry.coordinates[0]
        }, {
            ...lat,
            value: theSelectedEq.value[0].features[0].geometry.coordinates[1]
        }, {
            ...mag,
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
