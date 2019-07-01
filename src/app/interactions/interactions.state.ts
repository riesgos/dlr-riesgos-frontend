import { ProductId } from 'projects/services-wps/src/public_api';
import { Product } from '../wps/wps.datatypes';

export type InteractionMode = "normal" | "featureselection" | "bbox";


export interface InteractionState {
    mode: InteractionMode,
    product: Product
}


export const initialInteractionState: InteractionState = {
    mode: "normal", 
    product: {
        description: {
            id: "default parameter", 
            reference: false, 
            type: "literal", 
            wizardProperties: {
                fieldtype: "string"
            }
        }, 
        value: null
    }
}