import { RiesgosProduct } from '../riesgos/riesgos.state';

export type InteractionMode = 'normal' | 'featureselection' | 'bbox';


export interface InteractionState {
    mode: InteractionMode;
    product: RiesgosProduct;
}


export const initialInteractionState: InteractionState = {
    mode: 'normal',
    product: {
        id: 'initial interaction product',
        value: null
    }
}