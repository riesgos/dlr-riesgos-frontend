import { WpsProcess, ProcessStateUnavailable, WatchingProcess, Product, CustomProcess } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, WpsClient } from 'projects/services-wps/src/public-api';
import { selectedEq } from './eqselection';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';



export const lat: WpsData & Product = {
    uid: 'auto_lat',
    description: {
        id: 'lat',
        reference: false,
        type: 'literal',
    },
    value: null
};

export const lon: WpsData & Product = {
    uid: 'auto_lon',
    description: {
        id: 'lon',
        reference: false,
        type: 'literal',
    },
    value: null
};

export const mag: WpsData & Product = {
    uid: 'auto_mag',
    description: {
        id: 'mag',
        reference: false,
        type: 'literal',
    },
    value: null
};


export const tsWms: WpsData & Product = {
    uid: 'get_scenario_epiCenter',
    description: {
        id: 'epiCenter',
        reference: false,
        format: 'application/WMS',
        type: 'literal',
    },
    value: null
};


export const TsServiceTranslator: WatchingProcess = {
    id: 'TS_service_translator',
    name: 'TS_service_translator',
    requiredProducts: [selectedEq.uid],
    providedProducts: [lat, lon, mag].map(p => p.uid),
    state: new ProcessStateUnavailable(),
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        let outprods: Product[] = [];
        if (newProduct.uid === 'EqSelection_quakeMLFile') {
            const newProds = [{
                ... lon,
                value: newProduct.value[0].features[0].geometry.coordinates[0]
            }, {
                ...lat,
                value: newProduct.value[0].features[0].geometry.coordinates[1]
            }, {
                ...mag,
                value: newProduct.value[0].features[0].properties['magnitude.mag.value']
            }];
            outprods = outprods.concat(newProds);
        }
        return outprods;
    }
};



export const TsWmsService: WpsProcess = {
    state: new ProcessStateUnavailable(),
    id: 'get_scenario',
    url: 'http://tsunami-wps.awi.de/wps',
    name: 'Earthquake/tsunami interaction',
    description: 'Relates a tsunami to a given earthquake',
    requiredProducts: [lat, lon, mag].map(p => p.uid),
    providedProducts: [tsWms.uid],
    wpsVersion: '1.0.0'
};


export const tsShakemap: WpsData & Product = {
    uid: 'ts_shakemap',
    description: {
        id: 'tsunamap',
        reference: true,
        type: 'complex',
        format: 'application/xml'
    },
    value: null
};


export const TsShakemapService: WpsProcess = {
    id: 'get_tsunamap',
    description: 'Input is earthquake epicenter (lon,lat) with magnitude, output is the nearest Tsunami epicenter and Inundation in shakemap format',
    name: 'get_tsunamap',
    requiredProducts: [lat, lon, mag].map(p => p.uid),
    providedProducts: [tsShakemap.uid],
    state: new ProcessStateUnavailable(),
    url: 'http://tsunami-wps.awi.de/wps',
    wpsVersion: '1.0.0'
};

export class TsService implements WizardableProcess, CustomProcess {
    id = 'ts-service';
    name = 'TS-Service';
    requiredProducts = TsWmsService.requiredProducts;
    providedProducts = [tsWms, tsShakemap].map(p => p.uid);
    state = new ProcessStateUnavailable();
    wizardProperties = {
        //shape: 'tsunami',
        providerName: 'Alfred Wegener Institute',
        providerUrl: 'https://www.awi.de/en/',
        shape: 'tsunami' as 'tsunami'
    };
    private wpsClient: WpsClient;

    constructor(private httpClient: HttpClient) {
        this.wpsClient = new WpsClient('1.0.0', this.httpClient, false);
    }

    execute = (inputs: Product[]): Observable<Product[]> => {

        const inputsWms = inputs.filter(i => TsWmsService.requiredProducts.includes(i.uid)) as WpsData[];
        const inputsShkmp = inputs.filter(i => TsShakemapService.requiredProducts.includes(i.uid)) as WpsData[];

        const proc1$ = this.wpsClient.executeAsync(
            TsWmsService.url, TsWmsService.id, inputsWms, [tsWms.description], 2000, null);
        const proc2$ = this.wpsClient.executeAsync(
            TsShakemapService.url, TsShakemapService.id, inputsShkmp, [tsShakemap.description], 2000, null);

        return forkJoin(proc1$, proc2$).pipe(
            map((results: WpsData[][]) => {
                const flattened: WpsData[] = [];
                for (const result of results) {
                    for (const data of result) {
                        flattened.push(data);
                    }
                }
                return flattened;
            }),
            map((wpsData: WpsData[]) => {
                return this.assignWpsDataToProducts(wpsData, [tsWms, tsShakemap]);
            })
        );
    }

    private assignWpsDataToProducts(wpsData: WpsData[], initialProds: (Product & WpsData)[]): Product[] {
        const out: Product[] = [];

        for (const prod of initialProds) {
            const equivalentWpsData = wpsData.find(data => {
                return (
                    data.description.id === prod.description.id &&
                    // data.description.format === prod.description.format && // <- not ok? format can change from 'wms' to 'string', like in service-ts!
                    data.description.reference === prod.description.reference &&
                    data.description.type === prod.description.type
                );
            });

            if (equivalentWpsData) {
                out.push({
                    ...equivalentWpsData,
                    uid: prod.uid
                });
            }

        }

        return out;
    }

}
