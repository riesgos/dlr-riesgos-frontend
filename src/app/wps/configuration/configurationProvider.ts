import { Injectable } from '@angular/core';
import { Process, ProcessId, Product } from '../control/process';
import { EqEventCatalogue } from './chile/eqEventCatalogue';
import { EqGroundMotion } from './chile/eqGroundMotion';
import { EqTsInteraction } from './chile/eqTsInteraction';
import { TsPhysicalSimulation } from './chile/tsPhysicalSimulation';
import { WpsClient, WpsVerion } from 'projects/services-wps/src/public_api';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';




export interface ProcessDescription {
    id: ProcessId, 
    url: string, 
    name: string,
    description: string,
    requiredProducts: Product[], 
    providedProduct: Product, 
    wpsVersion: WpsVerion
}


@Injectable()
export class WpsConfigurationProvider {
    
    private scenario: string;
    
    constructor(
        private httpClient: HttpClient, 
        private activeRoute: ActivatedRoute
    ) {
        activeRoute.params.subscribe(
            params => this.scenario = params.id
        )
    }


    getConfiguration(): ProcessDescription[] {
        return this.getConfigurationForScenario(this.scenario);
    }

        
    getProcesses(): Process[] {
        return this.getProcessesForScenario(this.scenario);
    }

    getConfigurationForScenario(scenario: string): ProcessDescription[] {
        return [EqEventCatalogue, EqGroundMotion, EqTsInteraction, TsPhysicalSimulation];
    }


    getProcessesForScenario(scenario: string): Process[] {
        const descriptions = this.getConfigurationForScenario(scenario);
        const processes = descriptions.map(desc => this.createProcess(desc));
        return processes;
    }


    private createProcess(description: ProcessDescription): Process {
        return new Process(
            description.id, description.url, 
            description.name, description.description,
            description.requiredProducts, description.providedProduct, 
            new WpsClient(description.wpsVersion, this.httpClient)
        );
    }

}