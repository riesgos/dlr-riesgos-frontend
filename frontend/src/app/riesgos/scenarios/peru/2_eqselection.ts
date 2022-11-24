import { Store } from "@ngrx/store";
import { BehaviorSubject, of } from "rxjs";
import { FeatureSelectUconfProduct } from "src/app/components/config_wizard/wizardable_products";
import { WizardableStep } from "src/app/components/config_wizard/wizardable_steps";
import { InfoTableComponentComponent } from "src/app/components/dynamic/info-table-component/info-table-component.component";
import { VectorLayerProduct } from "src/app/components/map/mappable/mappable_products";
import { toDecimalPlaces } from "src/app/helpers/colorhelpers";
import { WizardableProductAugmenter, MappableProductAugmenter, WizardableStepAugmenter } from "src/app/services/augmenter/augmenter.service";
import { getProduct } from "../../riesgos.selectors";
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from "../../riesgos.state";
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import olFeature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { DataService } from "src/app/services/data/data.service";
import { switchMap, tap } from "rxjs/operators";




export class UserinputSelectedEqPeru implements WizardableProductAugmenter {
    private availableEqs$ = new BehaviorSubject<RiesgosProduct | undefined>(undefined);

    constructor(private store: Store, private resolver: DataService) {
        this.store.select(getProduct('availableEqs'))
            .pipe(
                switchMap(p => {
                    if (p && p.value) return this.resolver.resolveReference(p.value);
                    return of(undefined);
                }),
            )
            .subscribe(aeqs => this.availableEqs$.next(aeqs));
    }

    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'userChoice';
    }

    makeProductWizardable(product: RiesgosProduct): FeatureSelectUconfProduct {
        console.log(`making wizardable`)
        const features = this.availableEqs$.value.value.features;
        return {
            ... product,
            description: {
                featureSelectionOptions: features,
                defaultValue: features[0],
                wizardProperties: {
                    fieldtype: 'select',
                    name: 'SelectedEQ',
                    description: 'SelectEQ'
                }
            },
        }
    }

}


export class SelectedEqPeru implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'selectedEq'
    }

    makeProductMappable(product: RiesgosProductResolved): VectorLayerProduct {
        return {
            ...product,
            description: {
                id: 'quakeMLFile',
                name: 'Selected_earthquake',
                icon: 'earthquake',
                type: 'complex',
                format: 'application/vnd.geo+json',
                vectorLayerAttributes: {
                    featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
                        return new olStyle({
                            image: new olCircle({
                                radius: 20,
                                fill: new olFill({
                                    color: 'blue'
                                }),
                                stroke: new olStroke({
                                    color: 'white',
                                    width: 1
                                })
                            })
                        });
                    },
                    detailPopupHtml: (properties: object) => {
                        let text = `<h3>{{ Selected_earthquake }}</h3>`;
                        const selectedProperties = {
                            '{{ Magnitude }}': toDecimalPlaces(properties['magnitude.mag.value'] as number, 1),
                            '{{ Depth }}': toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' km',
                            // Latitude: toDecimalPlaces(1, 1),
                            // Longitude: toDecimalPlaces(2, 1),
                            Id: properties['origin.publicID'],
                        };
                        if (properties['origin.time.value']) {
                            const date = new Date(Date.parse(properties['origin.time.value']));
                            selectedProperties['{{ Date }}'] = `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;
                        }
                        text += '<table class="table"><tbody>';
                        for (const property in selectedProperties) {
                            if (selectedProperties[property]) {
                                const propertyValue = selectedProperties[property];
                                text += `<tr><td>${property}</td> <td>${propertyValue}</td></tr>`;
                            }
                        }
                        text += '</tbody></table>';
                        return text;
                      },
                      globalSummary: (value) => {
                        const feature = value.features[0];
                        const properties = feature.properties;
                        const magnitude = toDecimalPlaces(properties['magnitude.mag.value'] as number, 1);
                        const depth = toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' km';
                        const id = properties['origin.publicID'];
        
                        const data = [
                            [{ value: 'Id'}, { value: id }],
                            [{ value: 'Magnitude'}, { value: magnitude }],
                            [{ value: 'Depth'}, { value: depth }],
                        ];
        
                        if (properties['origin.time.value']) {
                            const date = new Date(Date.parse(properties['origin.time.value']));
                            data.push([{value: 'Date'}, {value: `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`}]);
                        }
        
                        return {
                            component: InfoTableComponentComponent,
                            inputs: { data: data }
                        };
                    }
                },
            },
        };
    }

}

export class EqSelectionPeru implements WizardableStepAugmenter {

    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'selectEq';
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ... step,
            scenario: 'Peru',
            wizardProperties: {
                providerName: '',
                providerUrl: '',
                shape: 'earthquake'
            },
        }
    }

}


// export const EqSelectionPeru: WizardableStep & ExecutableProcess & ProductTransformingProcess = {
//     uid: 'EqSelectionPeru',
//     name: 'Select earthquake',
//     description: 'select_eq_description',
//     state: { type: ProcessStateTypes.unavailable },
//     requiredProducts: [availableEqsPeru, userinputSelectedEqPeru].map(p => p.uid),
//     providedProducts: [selectedEqPeru.uid],

// };

