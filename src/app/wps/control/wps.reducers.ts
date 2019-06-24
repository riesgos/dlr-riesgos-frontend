import { WpsActions, EWpsActionTypes, ProcessStatesChanged } from './wps.actions';
import { WpsState } from './wps.state';



export function wpsReducer (state: WpsState, action: WpsActions): WpsState  {
    console.log("Wps-reducer now handling action of type " + action.type, action, state);
    switch(action.type) {
        case EWpsActionTypes.processStatesChanged: 
            return {
                ...state, 
                processes: (action as ProcessStatesChanged).payload.processes
            };
        case EWpsActionTypes.productsProvided:
        case EWpsActionTypes.processStarted:
        default: 
            return state;
    }
};