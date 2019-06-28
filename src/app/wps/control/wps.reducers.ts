import { WpsActions, EWpsActionTypes, ProcessStarted, ProductsProvided, InitialStateObtained, ScenarioChosen } from './wps.actions';
import { WpsState } from './wps.state';
import { ProductId } from 'projects/services-wps/src/public_api';
import { Product, ProcessState, ProcessId, Process } from './wps.datatypes';
import { EqEventCatalogue } from '../configuration/chile/eqEventCatalogue';
import { EqGroundMotion } from '../configuration/chile/eqGroundMotion';
import { EqTsInteraction } from '../configuration/chile/eqTsInteraction';
import { TsPhysicalSimulation } from '../configuration/chile/tsPhysicalSimulation';
import { filterInputsForProcess, getProcessById, getProductById } from './wps.selectors';
import { isUserconfigurableWpsDataDescription } from 'src/app/components/config_wizard/userconfigurable_wpsdata';



export function wpsReducer (state: WpsState, action: WpsActions): WpsState  {
    switch(action.type) {

        case EWpsActionTypes.scenarioChosen:
            return getInitialStateForScenario((action as ScenarioChosen).payload.scenario);

            
        case EWpsActionTypes.productsProvided:
            const newProductValues = updateOldProducts(state.productValues, (action as ProductsProvided).payload.products);
            const newProcessStates = calculateProcessState(state.processStates, newProductValues);
            
            return {
                processStates: newProcessStates, 
                productValues: newProductValues 
            }
                
                
        case EWpsActionTypes.processStarted:
            const runningProcess = (action as ProcessStarted).payload.process;
            const newProcStates = state.processStates.map(process => {
                if(process.id == runningProcess.id) return {
                    ...process, 
                    state: ProcessState.running
                }
                return process;
            })
            return {
                ...state, 
                processStates: newProcStates
            }



        default: 
            return state;
    }
};


function updateOldProcesses(oldProcesses: Process[], newProcesses: Process[]): Process[] {

    for(let oldProcess of oldProcesses) {
        if(!newProcesses.find(newProcess => newProcess.id == oldProcess.id)) newProcesses.push(oldProcess);
    }

    const sortedProcesses = newProcesses.sort((p1, p2) => {
        if(p1.id < p2.id) return -1;
        else if(p1.id > p2.id) return 1;
        return 0;
    });

    return sortedProcesses;
}


function updateOldProducts(oldProducts: Product[], newProducts: Product[]): Product[] {

    for(let oldProduct of oldProducts) {
        if(!newProducts.find(newProduct => newProduct.description.id == oldProduct.description.id)) newProducts.push(oldProduct);
    }

    const sortedProducts = newProducts.sort((p1, p2) => {
        if(p1.description.id < p2.description.id) return -1;
        else if(p1.description.id > p2.description.id) return 1;
        return 0;
    });

    return sortedProducts;
}


function calculateProcessState(oldProcessStates: Process[], newProductValues: Product[]) {

    const newProcessStates = oldProcessStates.map(process => {

        const requiredProds = filterInputsForProcess(process, newProductValues);
        const nonuserRequiredPords = filterForInternal(requiredProds);
        const output = getProductById(process.providedProduct.id, newProductValues);

        if(process.state == ProcessState.error) {
            return process;
        } else if(!isComplete(nonuserRequiredPords)) {
            return {
                ...process,
                state: ProcessState.unavailable
            };
        } else if(!output.value) {
            return {
                ...process, 
                state: ProcessState.available
            }
        } else {
            return {
                ...process, 
                state: ProcessState.completed
            }
        }

    })

    return newProcessStates;
}


function isComplete(products: Product[]): boolean {
    if (products.find(p => !p.value)) return false;
    return true;
}


function filterForInternal(products: Product[]): Product[] {
    return products.filter(p => !isUserconfigurableWpsDataDescription(p.description))
}


function getInitialStateForScenario(scenario: string): WpsState {
    const processes = getProcessesForScenario(scenario);
    const products = createProductsForProcesses(processes);
    const processStates = calculateProcessState(processes, products);
    return {
        processStates: processStates, 
        productValues: products
    }
}


function getProcessesForScenario(scenario: string): Process[] {
    switch(scenario) {
        case "c1": 
        default: 
            return [EqEventCatalogue, EqGroundMotion, EqTsInteraction, TsPhysicalSimulation];
    }
}


function createProductsForProcesses(processes: Process[]): Product[] {
    let products: Product[] = [];
    for(let process of processes) {

        // step 1: assemble new products
        let newProducts: Product[] = process.requiredProducts.map(prod => {
            return {value: null, description: prod}
        });
        newProducts.push({value: null, description: process.providedProduct});
       
        // step 2: add them to list
        for(let newProduct of newProducts) {
            if(!products.find(product => product == newProduct)) products.push(newProduct);
        }
    }

    return products;
}