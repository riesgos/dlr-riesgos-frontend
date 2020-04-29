import { WpsProcess, ProcessStateUnavailable, Process, ExecutableProcess, Product, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { latmax, initialExposure, lonmin, lonmax, latmin, querymode, schema, assettype, ExposureModel } from './exposure';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { RaquelsExposureModel } from './raquelsExposure';
import { Cache } from '@dlr-eoc/services-ogc';



export const modelChoice: StringSelectUconfProduct = {
    uid: 'eq_exposure_model_choice',
    description: {
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'model',
            description: 'exposure model',
            signpost: 'Please note that the model GFZ 2020 may not yet be fully integrated.'
        },
        options: ['GFZ 2019', 'GFZ 2020'],
        defaultValue: 'GFZ 2019',
    },
    value: 'GFZ 2019'
};



export class ExposureSelection implements ExecutableProcess, WizardableProcess {

    state: ProcessState = new ProcessStateUnavailable();
    uid = 'EQ Exposure Model Selection';
    name = 'EQ Exposure Model Selection';
    requiredProducts: string[] = [modelChoice, lonmin, lonmax, latmin, latmax, querymode, schema, assettype].map(p => p.uid);
    providedProducts: string[] = [initialExposure.uid];
    description?: string = 'exposure_description';
    readonly wizardProperties: WizardProperties;
    private standardModel: ExposureModel;
    private raqelsModel: RaquelsExposureModel;

    constructor(httpClient: HttpClient, cache: Cache) {
        this.wizardProperties = {
            shape: 'building',
            providerName: 'Helmholtz Centre Potsdam',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            wikiLink: 'Vulnerability'
        };
        this.standardModel = new ExposureModel(httpClient, cache);
        this.raqelsModel = new RaquelsExposureModel(httpClient, cache);
    }

    execute(inputs: Product[], outputs?: Product[],
            doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        const modelChoicePara = inputs.find(i => i.uid === modelChoice.uid);
        let chosenModel;
        if (modelChoicePara.value === 'GFZ 2019') {
            chosenModel = this.standardModel;
        } else if (modelChoicePara.value === 'GFZ 2020') {
            chosenModel = this.raqelsModel;
        }

        const newInputs = inputs.filter(i => i.uid !== modelChoice.uid);

        return chosenModel.execute(newInputs, outputs, doWhileExecuting);
    }
}
