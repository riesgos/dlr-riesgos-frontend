import { WpsActions, EWpsActionTypes, ProcessStatesChanged, ProcessStarted } from './wps.actions';
import { WpsState } from './wps.state';



export function wpsReducer (state: WpsState, action: WpsActions): WpsState  {
    console.log("Wps-reducer now handling action of type " + action.type, action, state);
    switch(action.type) {
        case EWpsActionTypes.processStatesChanged: 
            return {
                ...state, 
                processes: (action as ProcessStatesChanged).payload.processes
            };
        case EWpsActionTypes.processStarted:
            let newState = {...state};
            const procId = (action as ProcessStarted).payload.process.id;
            newState.processes.map(p => {
                if(p.id == procId) return (action as ProcessStarted).payload.process;
                return p;
            })
            return newState;
        case EWpsActionTypes.productsProvided:
        default: 
            return state;
    }
};