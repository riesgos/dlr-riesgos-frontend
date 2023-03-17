import { toDecimalPlaces, linInterpolateXY, yellowRedRange } from 'src/app/helpers/colorhelpers';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle } from 'ol/style';
import olFeature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from '../../riesgos.state';
import { MappableProductAugmenter, WizardableProductAugmenter, WizardableStepAugmenter } from 'src/app/services/augmenter/augmenter.service';
import { StringSelectUserConfigurableProduct, StringUserConfigurableProduct, WizardableProduct } from 'src/app/components/config_wizard/wizardable_products';
import { VectorLayerProduct } from 'src/app/components/map/mappable/mappable_products';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { LegendComponent } from 'src/app/components/dynamic/legend/legend.component';
import { regexTransform } from 'src/app/services/simplifiedTranslation/regex-translate.pipe';
import { CircleLegendComponent } from 'src/app/components/dynamic/circle-legend/circle-legend.component';
import { MultiLegendComponent } from 'src/app/components/dynamic/multi-legend/multi-legend.component';






// Input: Catalog type
export class EtypeChile implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'eqCatalogTypeChile';
    }

    makeProductWizardable(product: RiesgosProductResolved): StringSelectUserConfigurableProduct[] {
        return [{
            ... product,
            description: {
                wizardProperties: {
                    name: 'Catalogue type',
                    fieldtype: 'stringselect'
                },
                options: ['expert'],
                defaultValue: 'expert'
            },
        }];
    }
};

export class MminChile implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'eqMminChile';
    }
    makeProductWizardable(product: RiesgosProduct): StringUserConfigurableProduct[] {
        return [{
            ...product,
            description: {
                wizardProperties: {
                    name: 'mmin',
                    fieldtype: 'string'
                },
                defaultValue: '6.0'
            }
        }];
    }
}
export class MmaxChile implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'eqMmaxChile';
    }
    makeProductWizardable(product: RiesgosProduct): StringUserConfigurableProduct[] {
        return [{
            ...product,
            description: {
                wizardProperties: {
                    name: 'mmax',
                    fieldtype: 'string'
                },
                defaultValue: '9.0'
            }
        }];
    }
}
export class ZminChile implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'eqZminChile';
    }
    makeProductWizardable(product: RiesgosProduct): StringUserConfigurableProduct[] {
        return [{
            ...product,
            description: {
                wizardProperties: {
                    name: 'zmin',
                    fieldtype: 'string'
                },
                defaultValue: '0'
            }
        }];
    }
}
export class ZmaxChile implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'eqZmaxChile';
    }
    makeProductWizardable(product: RiesgosProduct): StringUserConfigurableProduct[] {
        return [{
            ...product,
            description: {
                wizardProperties: {
                    name: 'zmax',
                    fieldtype: 'string'
                },
                defaultValue: '100'
            }
        }];
    }
}
export class PChile implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'eqPChile';
    }
    makeProductWizardable(product: RiesgosProduct): StringUserConfigurableProduct[] {
        return [{
            ...product,
            description: {
                wizardProperties: {
                    name: 'p',
                    fieldtype: 'string'
                },
                defaultValue: '0.0'
            }
        }];
    }
}


// Output: Available EQs
export class AvailableEqsChile implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct) {
        return product.id === 'availableEqsChile';
    }

    makeProductMappable(product: RiesgosProductResolved): VectorLayerProduct[] {
        return [{
            ... product,
            description: {
                id: 'selectedRows',
                icon: 'earthquake',
                name: 'available earthquakes',
                description: 'CatalogueData',
                format: 'application/vnd.geo+json',
                type: 'complex',
                vectorLayerAttributes: {
                    featureStyle: (feature: olFeature<Geometry>, resolution: number, selected: boolean) => {
        
                        const props = feature.getProperties();
                        const magnitude = props['magnitude.mag.value'];
                        const depth = props['origin.depth.value'];
        
                        let radius = linInterpolateXY(5, 5, 10, 20, magnitude);
                        const [r, g, b] = yellowRedRange(100, 0, depth);
        
                        if (selected) {
                            radius += 4;
                        }
        
                        return new olStyle({
                            image: new olCircle({
                                radius: radius,
                                fill: new olFill({
                                    color: [r, g, b, 0.5]
                                }),
                                stroke: new olStroke({
                                    color: [r, g, b, 1]
                                })
                            })
                        });
                    },
                    detailPopupHtml: (properties) => {
                        let text = `<h3>{{ Available_earthquakes }}</h3>`;
                        const selectedProperties = {
                            '{{ Magnitude }}': toDecimalPlaces(properties['magnitude.mag.value'] as number, 1),
                            '{{ Depth }}': toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' km',
                            Id: regexTransform(properties['origin.publicID']),
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
                    dynamicLegend: (value) => ({
                        component: MultiLegendComponent,
                        inputs: {
                            legendComponents: [{
                                component: LegendComponent,
                                inputs: {
                                    title: 'Depth',
                                    entries: [{
                                        text: '0km',
                                        color: `rgb(${yellowRedRange(100, 0, 0).join(', ')})`,
                                    }, {
                                        text: '30km',
                                        color: `rgb(${yellowRedRange(100, 0, 30).join(', ')})`,
                                    }, {
                                        text: '60km',
                                        color: `rgb(${yellowRedRange(100, 0, 60).join(', ')})`,
                                    }, {
                                        text: '100km',
                                        color: `rgb(${yellowRedRange(100, 0, 100).join(', ')})`,
                                    }],
                                    continuous: true,
                                    height: 100,
                                    width: 150
                                }
                            }, {
                                component: CircleLegendComponent,
                                inputs: {
                                    title: 'Magnitude',
                                    entries: [{
                                        label: 'Mag. 6.0',
                                        radius: linInterpolateXY(5, 5, 10, 20, 6.0),
                                    }, {
                                        label: 'Mag. 7.0',
                                        radius: linInterpolateXY(5, 5, 10, 20, 7.0),
                                    }, {
                                        label: 'Mag. 8.0',
                                        radius: linInterpolateXY(5, 5, 10, 20, 8.0),
                                    }, {
                                        label: 'Mag. 9.0',
                                        radius: linInterpolateXY(5, 5, 10, 20, 9.0),
                                    }],
                                    height: 100
                                }
                            }]
                        }
                    })
                }
            }
        }];
    }
}



// Step: EQ-Catalog
export class QuakeLedgerChile implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep) {
        return step.step.id === 'EqsChile'
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep  {
        return {
            ... step,
            scenario: 'Chile',
            wizardProperties: {
                shape: 'bullseye',
                providerName: 'GFZ',
                providerUrl: 'https://www.gfz-potsdam.de/en/',
                wikiLink: 'EqCatalogue',
                dataSources: [{
                    label: 'Quakeledger (GFZ)',
                    href: 'https://dataservices.gfz-potsdam.de/panmetaworks/showshort.php?id=bae8fc94-4799-11ec-947f-3811b03e280f'
                }]
            }
        }
    }
}
