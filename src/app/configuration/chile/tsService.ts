import { WpsProcess, ProcessStateUnavailable, AutorunningProcess, Product, ExecutableProcess, ProcessState } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, WpsClient } from 'projects/services-wps/src/public-api';
import { selectedEq } from './eqselection';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import { map } from 'rxjs/operators';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { FeatureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';



const lat: WpsData & Product = {
    uid: 'auto_lat',
    description: {
        id: 'lat',
        reference: false,
        type: 'literal',
    },
    value: null
};

const lon: WpsData & Product = {
    uid: 'auto_lon',
    description: {
        id: 'lon',
        reference: false,
        type: 'literal',
    },
    value: null
};

const mag: WpsData & Product = {
    uid: 'auto_mag',
    description: {
        id: 'mag',
        reference: false,
        type: 'literal',
    },
    value: null
};


export const tsWms: WpsData & WmsLayerData = {
    uid: 'get_scenario_epiCenter',
    description: {
        id: 'epiCenter',
        name: 'ts-wms',
        icon: 'tsunami',
        reference: false,
        format: 'application/WMS',
        type: 'literal',
        featureInfoRenderer: (fi: FeatureCollection) => {
            return createKeyValueTableHtml('Tsunami', {'mhw': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m'});
        }
    },
    value: null
};


export class TsWmsService extends WpsProcess {

    constructor(http: HttpClient) {
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
        );
    }

}


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


export class TsShakemapService extends WpsProcess {
    constructor(http: HttpClient) {
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
        );
    }
}

export class TsService implements WizardableProcess, ExecutableProcess {

    uid = 'ts-service';
    name = 'TS-Service';
    state: ProcessState;
    description = 'Simulates a tsunami based on the earlier selected earthquake-parameters.';

    wizardProperties = {
        providerName: 'Alfred Wegener Institute',
        providerUrl: 'https://www.awi.de/en/',
        shape: 'tsunami' as 'tsunami'
    };

    private tsShakemapService: TsShakemapService;
    private tsWmsService: TsWmsService;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];

    constructor(private httpClient: HttpClient) {
        this.state = new ProcessStateUnavailable();
        this.tsWmsService = new TsWmsService(httpClient);
        this.tsShakemapService = new TsShakemapService(httpClient);
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

        // return proc1$;

        return forkJoin(proc1$, proc2$).pipe(
            map((results: Product[][]) => {
                const flattened: Product[] = [];
                for (const result of results) {
                    for (const data of result) {
                        flattened.push(data);
                    }
                }
                return flattened;
            })
        );
    }

}
