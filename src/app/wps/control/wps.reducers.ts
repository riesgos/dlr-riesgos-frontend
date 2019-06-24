import { WpsActions, EWpsActionTypes, ProcessStatesChanged } from './wps.actions';
import { WpsState } from './wps.state';



export const wpsReducer = (state: WpsState, action: WpsActions): WpsState => {
    console.log("Wps-reducer now handling action of type " + action.type, action, state);
    switch(action.type) {
        case EWpsActionTypes.processStateChanged: 
            return {
                ...state, 
                processStates: (action as ProcessStatesChanged).payload.processStates
            };
        case EWpsActionTypes.productsProvided:
        case EWpsActionTypes.processStarted:
        default: 
            return state;
    }
};