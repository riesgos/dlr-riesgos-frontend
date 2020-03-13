import { VectorLayer, RasterLayer, Layer, CustomLayer } from '@dlr-eoc/services-layers';


export class ProductVectorLayer extends VectorLayer {
    productId: string;
    attribution = '';
}

export class ProductRasterLayer extends RasterLayer {
    productId: string;
    attribution = '';
}

export class ProductCustomLayer extends CustomLayer {
    productId: string;
    attribution = '';
}

export type ProductLayer = ProductRasterLayer | ProductVectorLayer | ProductCustomLayer;

export const isProductLayer = (layer: Layer): layer is ProductLayer => {
    return layer.hasOwnProperty('productId');
};
