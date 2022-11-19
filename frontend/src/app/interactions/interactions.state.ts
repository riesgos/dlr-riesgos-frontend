import { RiesgosProduct } from '../riesgos/riesgos.state';
import { API_Datum } from '../services/backend/backend.service';

export type InteractionMode = 'normal' | 'featureselection' | 'bbox';


export interface InteractionState {
    mode: InteractionMode;
    product: API_Datum;
}


export const initialInteractionState: InteractionState = {
    mode: 'normal',
    product: {
        id: 'initial interaction product',
        value: null
    }
}