import { WpsActions, EWpsActionTypes, ProcessStatesChanged, ProcessStarted, ProductsProvided } from './wps.actions';
import { WpsState } from './wps.state';
import { ProcessId, ProcessState } from './workflowcontrol';



export function wpsReducer (state: WpsState, action: WpsActions): WpsState  {
    console.log("Wps-reducer now handling action of type " + action.type, action, state);
    switch(action.type) {


        case EWpsActionTypes.processStatesChanged: 
            let newProcessStates = new Map<ProcessId, ProcessState>();
            for(let process of (action as ProcessStatesChanged).payload.processes) {
                newProcessStates.set(process.id, process.getState())
            }
            return {
                ...state, 
                processStates: newProcessStates
            };


        case EWpsActionTypes.processStarted:
            const runningProcess = (action as ProcessStarted).payload.process;
            let newProcStates = state.processStates;
            newProcStates.set(runningProcess.id, runningProcess.getState());
            return {
                ...state, 
                processStates: newProcStates
            };


        case EWpsActionTypes.productsProvided:
            const newProducts = (action as ProductsProvided).payload.products;
            let newProductValues = state.productValues;
            for(let prod of newProducts) {
                newProductValues.set(prod.id, prod)
            }
            return {
                ...state, 
                productValues: newProductValues
            };


        default: 
            return state;
    }
};