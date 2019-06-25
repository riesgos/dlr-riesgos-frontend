import { WpsActions, EWpsActionTypes, ProcessStatesChanged, ProcessStarted, ProductsProvided } from './wps.actions';
import { WpsState, initialWpsState } from './wps.state';
import { ProcessId, ProcessState, Product } from './process';
import { ProductId } from 'projects/services-wps/src/public_api';



export function wpsReducer (state: WpsState = initialWpsState, action: WpsActions): WpsState  {
    console.log("Wps-reducer now handling action of type " + action.type, action, state);
    switch(action.type) {


        case EWpsActionTypes.processStatesChanged: 
            let newPrStates = new Map<ProcessId, ProcessState>();
            for (let process of (action as ProcessStatesChanged).payload.processes) {
                newPrStates.set(process.id, process.getState());
            }
            return {
                ...state, 
                processStates: newPrStates
            };


        case EWpsActionTypes.processStarted:
            const runningProcess = (action as ProcessStarted).payload.process;
            let newProcStates = state.processStates;
            newProcStates.set(runningProcess.id, runningProcess.getState())
            return {
                ...state, 
                processStates: newProcStates
            };


        case EWpsActionTypes.productsProvided:
            let newProducts = new Map<ProductId, Product>();
            for(let product of (action as ProductsProvided).payload.products) {
                newProducts.set(product.id, product)
            }
            return {
                ...state, 
                productValues: newProducts
            }


        default: 
            return state;
    }
};