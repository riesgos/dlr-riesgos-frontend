import { ExecutableProcess, Product, ProcessState, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable, forkJoin } from 'rxjs';
import { LaharWps, direction, vei, parameter, laharWms, laharShakemap } from './lahar';
import { WpsData } from '@ukis/services-wps/src/public-api';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';



export const laharHeightWms: WmsLayerData & Product = {
    ... laharWms,
    uid: 'LaharHeightWms'
};

export const laharHeightShakemapRef: WpsData & Product = {
    ... laharShakemap,
    uid: 'LaharHeightShakemap'
};

export const laharVelocityWms: WmsLayerData & Product = {
    ... laharWms,
    uid: 'LaharVelocityWms'
};

export const laharVelocityShakemapRef: WpsData & Product = {
    ... laharShakemap,
    uid: 'LaharVelocityShakemap'
};


export class LaharWrapper implements ExecutableProcess, WizardableProcess {

    state: ProcessState;
    uid = 'LaharWrapper';
    name = 'LaharService';
    requiredProducts = [direction, vei].map(prd => prd.uid);
    providedProducts = [laharHeightWms, laharHeightShakemapRef, laharVelocityWms, laharVelocityShakemapRef].map(prd => prd.uid);
    description?: string;
    private laharWps: LaharWps;

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        this.laharWps = new LaharWps(http);
        this.wizardProperties = this.laharWps.wizardProperties;
        this.description = this.laharWps.description;
        this.state = new ProcessStateUnavailable();
    }

    execute(inputs: Product[], outputs?: Product[], doWhile?): Observable<Product[]> {

        const directionV = inputs.find(prd => prd.uid === direction.uid);
        const veiV = inputs.find(prd => prd.uid === vei.uid);
        const heightV = {
            ... parameter,
            value: 'MaxHeight'
        };
        const velocityV = {
            ... parameter,
            value: 'MaxVelocity'
        };

        const heightProc$ = this.laharWps.execute([directionV, veiV, heightV], [laharHeightWms, laharHeightShakemapRef], doWhile);
        const velProc$ = this.laharWps.execute([directionV, veiV, velocityV], [laharVelocityWms, laharVelocityShakemapRef], doWhile);

        // merge
        return forkJoin([heightProc$, velProc$]).pipe(
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