import { WpsActions, EWpsActionTypes, ProcessStatesChanged, ProcessStarted, ProductsProvided, InitialStateObtained, ScenarioChosen } from './wps.actions';
import { WpsState } from './wps.state';
import { ProductId } from 'projects/services-wps/src/public_api';
import { Product, ProcessState, ProcessId, Process } from './wps.datatypes';
import { EqEventCatalogue } from '../configuration/chile/eqEventCatalogue';
import { EqGroundMotion } from '../configuration/chile/eqGroundMotion';
import { EqTsInteraction } from '../configuration/chile/eqTsInteraction';
import { TsPhysicalSimulation } from '../configuration/chile/tsPhysicalSimulation';



export function wpsReducer (state: WpsState, action: WpsActions): WpsState  {
    console.log("Wps-reducer now handling action of type " + action.type, action, state);
    switch(action.type) {

        case EWpsActionTypes.scenarioChosen:
            return getInitialStateForScenario((action as ScenarioChosen).payload.scenario);


        case EWpsActionTypes.processStatesChanged: 
            return {
                ...state, 
                processStates: updateProcesses(state.processStates, (action as ProcessStatesChanged).payload.processes)
            };

            
        case EWpsActionTypes.productsProvided:
            let newProductValues = updateProducts(state.productValues, (action as ProductsProvided).payload.products);
            const newProcessStates = calculateProcessState(state.processStates, newProductValues);
            
            return {
                processStates: newProcessStates, 
                productValues: newProductValues 
            }
                
                
        case EWpsActionTypes.processStarted:
            let newProcStates = state.processStates;
            let oldProcessState = newProcStates.get((action as ProcessStarted).payload.process.id);
            if(oldProcessState) {
                const newProcessState = {
                    ...oldProcessState, 
                    state: ProcessState.runing
                }
                newProcStates.set((action as ProcessStarted).payload.process.id, newProcessState);
            }
            return {
                ...state, 
                processStates: newProcStates
            }



        default: 
            return state;
    }
};


function updateProcesses(oldProcesses, newProcesses) {
    newProcesses.forEach( (v, k) => {
        oldProcesses.set(k, v);
    })
    return oldProcesses;
}


function updateProducts(oldProducts, newProducts) {
    newProducts.forEach( (v, k) => {
        oldProducts.set(k, v);
    })
    return oldProducts;
}


function calculateProcessState(oldProcessStates, newProductValues) {
    return oldProcessStates
}


function getInitialStateForScenario(senario: string): WpsState {
    const processes = [EqEventCatalogue, EqGroundMotion, EqTsInteraction, TsPhysicalSimulation];

    let processStates = new Map<ProcessId, Process>();
    for(let process of processes) {
        processStates.set(process.id, process);
    }
    
    let productValues = new Map<ProductId, Product>();
    for(let process of processes) {
        for(let prodDescr of process.requiredProducts) {
            productValues.set(prodDescr.id, {description: prodDescr, value: null});
        }
        productValues.set(process.providedProduct.id, {description: process.providedProduct, value: null});
    }
    
    return {
        processStates: processStates, 
        productValues: productValues
    }
}