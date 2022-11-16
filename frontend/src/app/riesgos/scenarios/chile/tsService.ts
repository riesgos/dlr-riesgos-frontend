import { WpsProcess, ProcessStateUnavailable, Product, ExecutableProcess, ProcessState } from '../../riesgos.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { selectedEq } from './eqselection';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WmsLayerProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
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
        title: 'lon',
        reference: false,
        type: 'literal',
    },
    value: null
};

const mag: WpsData & Product = {
    uid: 'auto_mag',
    description: {
        id: 'mag',
        title: 'mag',
        reference: false,
        type: 'literal',
    },
    value: null
};


export const tsWms: WpsData & WmsLayerProduct = {
    uid: 'get_scenario_epiCenter',
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


export class TsWmsService extends WpsProcess {

    constructor(http: HttpClient, middleWareUrl: string) {
        super(
            'get_scenario',
            'Earthquake/tsunami interaction',
            [lat, lon, mag].map(p => p.uid),
            [tsWms.uid],
            'get_scenario',
            'Relates a tsunami to the selected earthquake',
            'https://riesgos.52north.org/wps',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            middleWareUrl
        );
    }
}


export class TsService implements WizardableProcess, ExecutableProcess {

    uid = 'ts-service';
    name = 'TS-Service';
    state: ProcessState;
    description = 'TsShortDescription';

    wizardProperties = {
        providerName: 'AWI',
        providerUrl: 'https://www.awi.de/en/',
        shape: 'tsunami' as 'tsunami',
        wikiLink: 'TsunamiWiki'
    };

    private tsWmsService: TsWmsService;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];

    constructor(private httpClient: HttpClient, middleWareUrl: string) {
        this.state = new ProcessStateUnavailable();
        this.tsWmsService = new TsWmsService(httpClient, middleWareUrl);
        this.requiredProducts = [selectedEq.uid],
        this.providedProducts = this.tsWmsService.providedProducts;
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
        
        const tsunamiWms$ = this.tsWmsService.execute(inputsWms, outputsWms, doWhileExecuting);

        return tsunamiWms$;

    }

}
