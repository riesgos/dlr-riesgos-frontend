import { ProcessStateUnavailable, Product, ExecutableProcess, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { initialExposureRef } from './exposure';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { MappableProduct, WmsLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { fragilityRef, VulnerabilityModel } from './modelProp';
import { eqShakemapRef } from './shakyground';
import { Deus } from './deus';
import { switchMap } from 'rxjs/operators';
import { ProductRasterLayer } from 'src/app/components/map/map.types';
import { MapOlService } from '@dlr-eoc/map-ol';




export const loss: WpsData & Product = {
    uid: 'loss',
    description: {
        id: 'loss',
        title: '',
        reference: false,
        type: 'literal'
    },
    value: 'testinputs/loss_sara.json'
};


export const eqDamageWms: WpsData & MappableProduct = {
    uid: 'eq_deus_economic',
    description: {
        id: 'shapefile_summary',
        title: 'shapefile_summary',
        reference: false,
        type: 'complex',
        format: 'application/WMS',
    },
    toUkisLayers: (layerSvc: MapOlService, ownValue: any) => {
        console.log(`creating eq ukis layers...`)
        const damageLayer = new ProductRasterLayer({
            hasFocus: true,
            id: 'qe_deus_damage',
            name: 'eq_deus_damage',
            productId: 'eq_deus_damage',
            type: 'wms',
            url: ownValue[0] + '&STYLES=w_damage',
            filtertype: 'Overlays',
            visible: true,
        });
        const econLayer = new ProductRasterLayer({
            hasFocus: true,
            id: 'qe_deus_economic',
            name: 'eq_deus_economic',
            productId: 'eq_deus_economic',
            type: 'wms',
            url: ownValue[0] + '&STYLES=style',
            filtertype: 'Overlays',
            visible: true,
        });
        const layers = [damageLayer, econLayer];
        return of(layers);
    },
    value: null
}

export const eqDamageMRef: WpsData & Product = {
    uid: 'merged_output_ref',
    description: {
        id: 'merged_output',
        title: '',
        reference: true,
        type: 'complex',
        format: 'application/json',
        description: 'NumberGoodsInDamageState'
    },
    value: null
};


export class EqDeus implements ExecutableProcess, WizardableProcess {

    readonly state: ProcessState;
    readonly uid = 'EQ-Deus';
    readonly name = 'Multihazard_damage_estimation/Earthquake';
    readonly requiredProducts = [eqShakemapRef, initialExposureRef].map(p => p.uid);
    readonly providedProducts = [eqDamageWms, eqDamageMRef].map(p => p.uid);
    readonly description = 'This service returns damage caused by the selected earthquake.';
    readonly wizardProperties: WizardProperties = {
        providerName: 'GFZ',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        shape: 'dot-circle',
        wikiLink: 'ExposureAndVulnerability'
    };

    private vulnerabilityProcess: VulnerabilityModel;
    private deusProcess: Deus;

    constructor(http: HttpClient) {
        this.state = new ProcessStateUnavailable();
        this.vulnerabilityProcess = new VulnerabilityModel(http);
        this.deusProcess = new Deus(http);
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        const schema: Product & WpsData = {
            uid: 'schema',
            description: {
              id: 'schema',
              title: 'schema',
              reference: false,
              type: 'literal',
            },
            value: 'SARA_v1.0'
          };

        const vulnerabilityInputs = [ schema ];
        const vulnerabilityOutputs = [ fragilityRef ];

        return this.vulnerabilityProcess.execute(vulnerabilityInputs, vulnerabilityOutputs, doWhileExecuting)
            .pipe(
                switchMap((resultProducts: Product[]) => {
                    const fragility = resultProducts.find(prd => prd.uid === fragilityRef.uid);
                    const shakemap = inputProducts.find(prd => prd.uid === eqShakemapRef.uid);
                    const exposure = inputProducts.find(prd => prd.uid === initialExposureRef.uid);

                    const deusInputs = [{
                        ...schema,
                        value: 'SARA_v1.0'
                    }, {
                        ...fragility,
                        description: {
                            ...fragilityRef.description,
                            id: 'fragility'
                        }
                    }, {
                        ...shakemap,
                        description: {
                            ...shakemap.description,
                            id: 'intensity'
                        }
                    }, {
                        ...exposure,
                        description: {
                            ...exposure.description,
                            id: 'exposure'
                        }
                    }
                    ];
                    const deusOutputs = outputProducts;
                    return this.deusProcess.execute(deusInputs, deusOutputs, doWhileExecuting);
                })
            );
    }
}
