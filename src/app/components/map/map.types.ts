import { VectorLayer, RasterLayer, Layer } from '@ukis/services-layers';


export class ProductVectorLayer extends VectorLayer {
    productId: string;
    attribution = '';
}

export class ProductRasterLayer extends RasterLayer {
    productId: string;
    attribution = '';
}


export type ProductLayer = ProductRasterLayer | ProductVectorLayer;


export const isProductLayer = (layer: Layer): layer is ProductLayer => {
    return layer.hasOwnProperty('productId');
};
