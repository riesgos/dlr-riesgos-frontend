import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import GeometryCollection from 'ol/geom/GeometryCollection';
import { Observable } from 'rxjs';
import { RiesgosProductResolved } from 'src/app/riesgos/riesgos.state';

import { HttpClient } from '@angular/common/http';
import { IDynamicComponent } from '@dlr-eoc/core-ui';
import { MapOlService } from '@dlr-eoc/map-ol';
import { LayersService } from '@dlr-eoc/services-layers';
import { Store } from '@ngrx/store';
import { FeatureCollection } from '@turf/helpers';

import { State } from '../../../ngrx_register';
import { shape } from '../../config_wizard/wizardable_steps';
import { LegendElement } from '../../dynamic/vector-legend/vector-legend.component';
import { LayerMarshaller } from './layer_marshaller';
import { ProductLayer } from './map.types';


export type MappableProduct = UkisMapProduct | BboxLayerProduct | VectorLayerProduct | MultiVectorLayerProduct | WmsLayerProduct;

/**
 * This type allows the user to specify how a riesgos-product should be converted into one or more ukis-layers.
 * This interface should slowly phase out all the other ones in the file `riesgos.datatypes.mappable`.
 */
export interface UkisMapProduct extends RiesgosProductResolved {
    toUkisLayers(ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, httpClient: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller): Observable<ProductLayer[]>
}

export function isUkisMappableProduct(obj: any): obj is UkisMapProduct {
    return 'toUkisLayers' in obj;
}

export function isMappableProduct(obj: any): obj is MappableProduct  {
    return isVectorLayerProduct(obj) || isBboxLayerProduct(obj)
            || isWmsProduct(obj) || isMultiVectorLayerProduct(obj)
            || isUkisMappableProduct(obj);
}


export interface BboxLayerDescription {
    type: 'bbox';
    name: string;
    id: string;
    icon?: shape;
}

export interface BboxValue {
    lllon: number,
    lllat: number,
    urlon: number,
    urlat: number,
}

export interface BboxLayerProduct extends RiesgosProductResolved {
    description: BboxLayerDescription;
    value: BboxValue | null;
}


export const isBboxLayerDescription = (description: any): description is BboxLayerDescription => {
    return description.hasOwnProperty('type') && description['type'] === 'bbox';
};

export const isBboxLayerProduct = (data: any): data is BboxLayerProduct => {
    return isBboxLayerDescription(data.description);
};


export interface VectorLayerProperties {
    vectorLayerAttributes: {
        featureStyle?: (feature: Feature<Geometry | GeometryCollection>, resolution: number, selected: boolean) => any;
        detailPopupHtml?: any;
        globalSummary?: (value: any) => IDynamicComponent,
        sldFile?: string,
        legendEntries?: LegendElement[]
    };
    description?: string;
    icon?: shape;
    name?: string;
}


export interface VectorLayerDescription extends VectorLayerProperties {
    format: 'application/vnd.geo+json' | 'application/json';
    type: 'complex';
    id: string;
}

export interface VectorLayerProduct extends RiesgosProductResolved {
    description: VectorLayerDescription;
}

export const isVectorLayerDescription = (description: any): description is VectorLayerDescription => {
    return description.hasOwnProperty('vectorLayerAttributes');
};


export const isVectorLayerProduct = (data: any): data is VectorLayerProduct => {
    return isVectorLayerDescription(data.description);
};

export interface MultiVectorLayerDescription {
    format: 'application/vnd.geo+json' | 'application/json';
    type: 'complex';
    vectorLayers: VectorLayerProperties[];
}

/**
 * Sometimes we want to display on vector-dataset in more than one way.
 * A *MultiVectorLayerProduct* uses one VectorSource with multiple layers.
 */
export interface MultiVectorLayerProduct extends RiesgosProductResolved {
    description: MultiVectorLayerDescription;
}

export const isMultiVectorLayerDescription = (description: any): description is MultiVectorLayerDescription => {
    return description.hasOwnProperty('vectorLayers');
};

export const isMultiVectorLayerProduct = (product: any): product is MultiVectorLayerProduct => {
    return isMultiVectorLayerDescription(product.description);
};



export interface WmsLayerDescription {
    legendImg?: string | IDynamicComponent;
    name: string;
    type: 'complex' | 'literal';
    styles?: string[];
    format: 'application/WMS' | 'string';  // Ts-service returns wms-data as string-literal. Not sure if this is strictly correct.
    id: string;
    description?: string;
    icon?: shape;
    featureInfoRenderer?: (featureInfo: FeatureCollection) => string;
}

export interface WmsLayerProduct extends RiesgosProductResolved {
    description: WmsLayerDescription;
}


export const isWmsLayerDescription = (description: any): description is WmsLayerDescription => {
    if (description['type'] === 'complex') {
        return description['format'] === 'application/WMS';
    } else if (description['type'] === 'literal') {
        return !!description['styles'] || !!description['featureInfoRenderer'] || !!description['legendImg'];
    }
    return false;
};

export const isWmsProduct = (data: any): data is WmsLayerProduct => {
    const matchesWms = (str: string) => {
        return str.includes('service=wms') || str.includes('Service=Wms') || str.includes('SERVICE=WMS');
    };

    return isWmsLayerDescription(data.description)
        || data.description['format'] === 'application/WMS'
        || ((typeof data.value === 'string') && matchesWms(data.value as string))
        || ((Array.isArray(data.value)) && (typeof data.value[0] === 'string') && matchesWms(data.value[0] as string));
};
