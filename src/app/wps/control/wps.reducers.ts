import { WpsActions, EWpsActionTypes, ProcessStatesChanged, ProcessStarted, ProductsProvided, InitialStateObtained } from './wps.actions';
import { WpsState } from './wps.state';
import { ProductId } from 'projects/services-wps/src/public_api';
import { Product } from './workflow_datatypes';



export function wpsReducer (state: WpsState, action: WpsActions): WpsState  {
    console.log("Wps-reducer now handling action of type " + action.type, action, state);
    switch(action.type) {

        case EWpsActionTypes.initialStateObtained:
            return {
                processStates: (action as InitialStateObtained).payload.processes, 
                productValues: (action as InitialStateObtained).payload.products
            }
            

        case EWpsActionTypes.processStatesChanged: 
            return {
                ...state, 
                processStates: (action as ProcessStatesChanged).payload.processes
            };

            
        case EWpsActionTypes.productsProvided:
            let newProductValues = state.productValues;
            (action as ProductsProvided).payload.products.forEach((v,k) => {
                newProductValues.set(k, v)
            });
            return {
                ...state, 
                productValues: newProductValues 
            }
                
                
        case EWpsActionTypes.processStarted:
        default: 
            return state;
    }
};