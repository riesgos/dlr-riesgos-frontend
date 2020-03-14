import { IVectorLayerOptions, IRasterLayerOptions, ICustomLayerOptions,
    VectorLayer, RasterLayer, Layer, CustomLayer } from '@dlr-eoc/services-layers';
import { LegendElement } from '../layer_control/vector-legend/vector-legend.component';



/**
 * Here, we extend the UKIS Layer types to give them all the attributes we need for RIESGOS.
 * This means:
 *  - giving them a productId, so they can be treated as products by Workflowcontrol
 *  - giving them a hasFocus property, so they can be treated by the focus logic.
 */

export interface IProductVectorLayerOptions extends IVectorLayerOptions {
    productId: string;
    hasFocus: boolean;
    attribution?: string;
    icon?: string;
    legendEntries?: LegendElement[];
}


export class ProductVectorLayer extends VectorLayer implements IProductVectorLayerOptions {
    productId: string;
    hasFocus: boolean;
    icon?: string;
    legendEntries?: LegendElement[];
    zIndex?: number;
    constructor(options: IProductVectorLayerOptions) {
        super(options);
        Object.assign(this, options);
    }
}


export interface IProductRasterLayerOptions extends IRasterLayerOptions {
    productId: string;
    hasFocus: boolean;
    attribution?: string;
    icon?: string;
}


export class ProductRasterLayer extends RasterLayer implements IProductRasterLayerOptions {
    productId: string;
    hasFocus: boolean;
    icon?: string;
    zIndex?: number;
    constructor(options: IProductRasterLayerOptions) {
        super(options);
        Object.assign(this, options);
    }
}


export interface IProductCustomLayerOptions extends ICustomLayerOptions {
    productId: string;
    hasFocus: boolean;
    icon?: string;
}


export class ProductCustomLayer extends CustomLayer implements IProductCustomLayerOptions {
    icon?: string;
    productId: string;
    hasFocus: boolean;
    constructor(options: IProductCustomLayerOptions) {
        super(options);
        Object.assign(this, options);
    }
}


export type IProductLayerOptions = IProductRasterLayerOptions | IProductVectorLayerOptions | IProductCustomLayerOptions;
export type ProductLayer = ProductRasterLayer | ProductVectorLayer | ProductCustomLayer;

export const isProductLayer = (layer: Layer): layer is ProductLayer => {
    return layer.hasOwnProperty('productId');
};
