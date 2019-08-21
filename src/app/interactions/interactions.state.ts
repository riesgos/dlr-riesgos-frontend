import { ProductId } from 'projects/services-wps/src/public-api';
import { Product } from '../wps/wps.datatypes';

export type InteractionMode = 'normal' | 'featureselection' | 'bbox';


export interface InteractionState {
    mode: InteractionMode,
    product: Product
}


export const initialInteractionState: InteractionState = {
    mode: 'normal',
    product: {
        description: {
            id: 'default parameter',
            sourceProcessId: 'auto',
            reference: false,
            type: 'literal',
            wizardProperties: {
                fieldtype: 'string'
            }
        },
        value: null
    }
}