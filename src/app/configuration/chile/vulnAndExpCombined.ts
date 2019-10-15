import { CustomProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { Observable, forkJoin } from 'rxjs';
import { lonmin, lonmax, latmin, latmax, assettype, schema, querymode, exposureRef, ExposureModel } from './assetmaster';
import { assetcategory, losscategory, taxonomies, fragilityRef, VulnerabilityModel } from './modelProp';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsClient, WpsData } from 'projects/services-wps/src/public-api';
import { map } from 'rxjs/operators';




export class VulnerabilityAndExposure implements CustomProcess, WizardableProcess {
    uid = 'VulnerabilityAndExposure';
    name = 'Exposure (extended)';
    requiredProducts = [
        lonmin, lonmax, latmin, latmax, assettype, schema, querymode,
        assetcategory, losscategory, taxonomies]
        .map(p => p.uid);
    providedProducts = [exposureRef, fragilityRef].map(p => p.uid);
    state = new ProcessStateUnavailable();
    wizardProperties = ExposureModel.wizardProperties;

    constructor(private wpsClient: WpsClient) {}

    execute = (inputs: Product[]): Observable<Product[]> => {

        const inputsVul = inputs.filter(i => VulnerabilityModel.requiredProducts.includes(i.uid)) as WpsData[];
        const inputsExp = inputs.filter(i => ExposureModel.requiredProducts.includes(i.uid)) as WpsData[];

        const proc1$ = this.wpsClient.executeAsync(
            VulnerabilityModel.url, VulnerabilityModel.id, inputsVul, [fragilityRef.description], 2000, null);
        const proc2$ = this.wpsClient.executeAsync(
            ExposureModel.url, ExposureModel.id, inputsExp, [exposureRef.description], 2000, null);

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
                return this.assignWpsDataToProducts(wpsData, [exposureRef, fragilityRef]);
            })
        );
    }

    private assignWpsDataToProducts(wpsData: WpsData[], initialProds: (Product & WpsData)[]): Product[] {
        const out: Product[] = [];

        for (const prod of initialProds) {
            const equivalentWpsData = wpsData.find(data => {
                return (
                    data.description.id === prod.description.id &&
                    data.description.format === prod.description.format && // <- not ok? format can change from 'wms' to 'string', like in service-ts!
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
