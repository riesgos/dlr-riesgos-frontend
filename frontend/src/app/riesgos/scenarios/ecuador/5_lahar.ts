import olTileLayer from 'ol/layer/Tile';
import olTileWMS from 'ol/source/TileWMS';
import olLayerGroup from 'ol/layer/Group';
import { MappableProductAugmenter, WizardableProductAugmenter, WizardableStepAugmenter } from 'src/app/services/augmenter/augmenter.service';
import { HttpClient } from '@angular/common/http';
import { MapOlService } from '@dlr-eoc/map-ol';
import { LayersService } from '@dlr-eoc/services-layers';
import { Store } from '@ngrx/store';
import { FeatureCollection } from '@turf/helpers';
import { map } from 'rxjs/operators';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { TranslatableStringComponent } from 'src/app/components/dynamic/translatable-string/translatable-string.component';
import { LayerMarshaller } from 'src/app/components/map/mappable/layer_marshaller';
import { ProductRasterLayer, ProductCustomLayer } from 'src/app/components/map/mappable/map.types';
import { UkisMapProduct, WmsLayerProduct } from 'src/app/components/map/mappable/mappable_products';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from '../../riesgos.state';
import { State } from 'src/app/ngrx_register';
import { GroupSliderComponent, SliderEntry } from 'src/app/components/dynamic/group-slider/group-slider.component';
import { StringSelectUserConfigurableProduct, WizardableProduct } from 'src/app/components/config_wizard/wizardable_products';


export class LaharDirection implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'direction';
    }

    makeProductWizardable(product: RiesgosProduct): StringSelectUserConfigurableProduct[] {
        return [{
            ...product,
            description: {
                defaultValue: 'South',
                options: ['South', 'North'],
                wizardProperties: {
                    fieldtype: 'stringselect',
                    name: 'direction',
                }
            }
        }];
    }
}


export class LaharWmses implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'laharWmses';
    }
    makeProductMappable(product: RiesgosProductResolved): (WmsLayerProduct | UkisMapProduct)[] {
        const {velWms, heightWms, erosionWms, pressureWms, contourWms} = product.value;

        return [
        //     { deactivated for now
        //     ... contourLayer,
        //     value: contourWms,
        // }, 
        {
            ... heightLayer,
            value: heightWms,
        }, {
            ... velLayer,
            value: velWms
        }, {
            ... erosionLayer,
            value: erosionWms
        }, {
            ... pressureLayer,
            value: pressureWms
        }];
    }
}


export class LaharSim implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'LaharSim';
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ...step,
            scenario: 'Ecuador',
            wizardProperties: {
                providerName: 'TUM',
                providerUrl: 'https://www.tum.de/en/',
                shape: 'avalanche',
                wikiLink: 'LaharSimulation',
                dataSources: [{ label: 'Frimberger et al., 2020', href: 'https://doi.org/10.1002/esp.5056'}]
            }
        }
    }
}



const contourLayer: UkisMapProduct & WmsLayerProduct = {
    id: 'LaharContourLines',
    reference: undefined,
    value: undefined,
    description: {
        id: 'LaharContourLines',
        icon: 'avalanche',
        name: 'Lahar contour lines',
        format: 'application/WMS',
        type: 'complex',
    },
    toUkisLayers: function (ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, http: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller) {

        const basicLayers$ = layerMarshaller.makeWmsLayers(this as WmsLayerProduct);
        const laharLayers$ = basicLayers$.pipe(
            map((layers: ProductRasterLayer[]) => {
                const olLayers = layers.map(l => {
                    const layer = new olTileLayer({
                        source: new olTileWMS({
                            url: l.url,
                            params: l.params,
                            crossOrigin: 'anonymous'
                        }),
                        visible: false
                    });
                    layer.set('id', l.id);
                    return layer;
                });
                olLayers[0].setVisible(true);

                const layerGroup = new olLayerGroup({
                    layers: olLayers
                });

                const entries: SliderEntry[] = layers.map((l: ProductRasterLayer, index: number) => {
                    return {
                        id: l.id,
                        tickValue: index,
                        displayText: l.name.match(/(\d+)$/)[0] + 'min'
                    };
                });

                const laharLayer = new ProductCustomLayer({
                    hasFocus: false,
                    filtertype: 'Overlays',
                    productId: this.uid,
                    removable: true,
                    custom_layer: layerGroup,
                    icon: 'avalanche',
                    id: this.uid,
                    name: this.uid,
                    action: {
                        component: GroupSliderComponent,
                        inputs: {
                            entries,
                            selectionHandler: (selectedId: string) => {
                                const layerIds = entries.map(e => e.id);
                                for (const id of layerIds) {
                                    const layer = mapSvc.getLayerByKey({key: 'id', value: id});
                                    if (id === selectedId) {
                                        layer.setVisible(true);
                                    } else {
                                        layer.setVisible(false);
                                    }
                                }
                            },
                        }
                    },
                    dynamicDescription: {
                        component: TranslatableStringComponent,
                        inputs: {
                            text: 'Lahar_contourlines_description'
                        }
                    }
                });
                return [laharLayer];
            })
        );
        return laharLayers$;

    },
};


const heightLayer: WmsLayerProduct = {
    id: 'LaharHeightWms',
    reference: undefined,
    value: undefined,
    description: {
        id: 'LaharHeightWms',
        icon: 'avalanche',
        name: 'laharWms',
        type: 'literal',
        format: 'application/WMS',
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features.length > 0) {
                return createKeyValueTableHtml('', { '{{ laharMaxDepth }}': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m' }, 'medium');
            } else {
                return '';
            }
        }
    },
};


const velLayer: WmsLayerProduct & UkisMapProduct = {
    id: 'LaharVelocityWms',
    value: undefined,
    reference: undefined,
    description: {
        id: 'LaharVelocityWms',
        icon: 'avalanche',
        name: 'laharWms',
        type: 'literal',
        format: 'application/WMS',
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features.length > 0) {
                return createKeyValueTableHtml('', { '{{ laharVelocity }}': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m/s' }, 'medium');
            } else {
                return '';
            }
        }
    },
    toUkisLayers: function (ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, http: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller) {

        const basicLayers$ = layerMarshaller.makeWmsLayers(this as WmsLayerProduct);
        return basicLayers$.pipe(map((layers) => {
            layers.map(l => l.visible = false);
            return layers;
        }));

    },
};


const pressureLayer: WmsLayerProduct & UkisMapProduct = {
    id: 'LaharPressureWms',
    value: undefined,
    reference: undefined,
    description: {
        id: 'LaharPressureWms',
        icon: 'avalanche',
        name: 'laharWms',
        type: 'literal',
        format: 'application/WMS',
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features.length > 0) {
                return createKeyValueTableHtml('', { '{{ laharPressure }}': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' kPa' }, 'medium');
            } else {
                return '';
            }
        }
    },
    toUkisLayers: function (ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, http: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller) {

        const basicLayers$ = layerMarshaller.makeWmsLayers(this as WmsLayerProduct);
        return basicLayers$.pipe(map((layers) => {
            layers.map(l => l.visible = false);
            return layers;
        }));

    },
};


const erosionLayer: WmsLayerProduct & UkisMapProduct = {
    id: 'LaharErosionWms',
    value: undefined,
    reference: undefined,
    description: {
        id: 'LaharErosionWms',
        icon: 'avalanche',
        name: 'laharWms',
        type: 'literal',
        format: 'application/WMS',
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features.length > 0) {
                return createKeyValueTableHtml('', { '{{ laharErosion }}': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m' }, 'medium');
            } else {
                return '';
            }
        }
    },
    toUkisLayers:  function (ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, http: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller) {

        const basicLayers$ = layerMarshaller.makeWmsLayers(this as WmsLayerProduct);
        return basicLayers$.pipe(map((layers) => {
            layers.map(l => l.visible = false);
            return layers;
        }));

    },
};
