import { toDecimalPlaces, linInterpolateXY, greenRedRange } from 'src/app/helpers/colorhelpers';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle } from 'ol/style';
import olFeature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from '../../riesgos.state';
import { MappableProductAugmenter, WizardableProductAugmenter, WizardableStepAugmenter } from 'src/app/services/augmenter/augmenter.service';
import { StringSelectUserConfigurableProduct, StringUserConfigurableProduct, WizardableProduct } from 'src/app/components/config_wizard/wizardable_products';
import { VectorLayerProduct } from 'src/app/components/map/mappable/mappable_products';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';






// Input: Catalog type
export class EtypePeru implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'eqCatalogType';
    }

    makeProductWizardable(product: RiesgosProductResolved): StringSelectUserConfigurableProduct[] {
        return [{
            ... product,
            description: {
                wizardProperties: {
                    name: 'Catalogue type',
                    fieldtype: 'stringselect'
                },
                options: ['observed', 'expert'],
                defaultValue: 'observed'
            },
        }];
    }
};



// Output: Available EQs
export class AvailableEqsPeru implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct) {
        return product.id === 'availableEqs';
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
        
                        let radius = linInterpolateXY(5, 10, 60, 5, depth);
                        const [r, g, b] = greenRedRange(6, 9, magnitude);
        
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
                    legendEntries: [{
                        feature: {
                            "type": "Feature",
                            "properties": {
                                'magnitude.mag.value': 6.0,
                                'origin.depth.value': 40.0
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [ 5.625, 50.958426723359935 ]
                              }
                          },
                        text: 'Mag. 6'
                    }, {
                        feature: {
                            "type": "Feature",
                            "properties": {
                                'magnitude.mag.value': 7.0,
                                'origin.depth.value': 40.0
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [ 5.625, 50.958426723359935 ]
                              }
                          },
                        text: 'Mag. 7'
                    }, {
                        feature: {
                            "type": "Feature",
                            "properties": {
                                'magnitude.mag.value': 8.0,
                                'origin.depth.value': 40.0
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [ 5.625, 50.958426723359935 ]
                              }
                          },
                        text: 'Mag. 8'
                    }, {
                        feature: {
                            "type": "Feature",
                            "properties": {
                                'magnitude.mag.value': 9.0,
                                'origin.depth.value': 40.0
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [ 5.625, 50.958426723359935 ]
                              }
                          },
                        text: 'Mag. 9'
                    }]
                }
            }
        }];
    }
}



// Step: EQ-Catalog
export class QuakeLedgerPeru implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep) {
        return step.step.id === 'Eqs'
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep  {
        return {
            ... step,
            scenario: 'Peru',
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
