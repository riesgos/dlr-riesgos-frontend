import { WpsActions, EWpsActionTypes, ProcessStarted, ProductsProvided, InitialStateObtained, ScenarioChosen, RestartingFromProcess } from './wps.actions';
import { WpsState, initialWpsState } from './wps.state';
import { ProductId } from 'projects/services-wps/src/public_api';
import { Product, ProcessState, ProcessId, Process, ProductDescription } from './wps.datatypes';
import { EqEventCatalogue } from '../configuration/chile/eqEventCatalogue';
import { EqGroundMotion } from '../configuration/chile/eqGroundMotion';
import { EqTsInteraction } from '../configuration/chile/eqTsInteraction';
import { TsPhysicalSimulation } from '../configuration/chile/tsPhysicalSimulation';
import { filterInputsForProcess, getProcessById, getProductById } from './wps.selectors';
import { isUserconfigurableWpsDataDescription } from 'src/app/components/config_wizard/userconfigurable_wpsdata';



export function wpsReducer (state: WpsState = initialWpsState, action: WpsActions): WpsState  {
    switch(action.type) {


        


        default: 
            return state;
    }
};





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