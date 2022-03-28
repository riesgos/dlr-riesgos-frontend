import { Observable } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { RiesgosDatabase } from "../database/db";
import { WpsClient } from '../wps/public-api';
import { ExecutableProcess, RiesgosProcess, RiesgosProduct,
    RiesgosScenarioData, RiesgosScenarioMetaData } from "./datatypes/riesgos.datatypes";


/**
 * Backend-side controller for all Riesgos-business-logic.
 * The express-app calls this classes' methods to retrieve scenario-information
 * or execute services.
 */
export class RiesgosService {

    constructor(
        private db: RiesgosDatabase,

    ) {}
    
    public getScenarios(): Promise<RiesgosScenarioMetaData[]> {
        return this.db.getScenarios();
    }

    public async getScenarioData(id: string): Promise<RiesgosScenarioData> {
        const scenarioData = await this.db.getScenarioData(id);
        return scenarioData;
    }

    public async executeProcess(
        process: RiesgosProcess,
        inputs: {[slot: string]: RiesgosProduct},
        outputs: {[slot: string]: RiesgosProduct})
        : Promise<{[slot: string]: RiesgosProduct}> {

        for (const inputSlot in inputs) {
            const input = inputs[inputSlot];
            if (input.value === null) {
                throw new Error(`No value given for input ${input.uid}`);
            }
        }


        const executable = this.getExecutableProcess(process.uid);
        const results = await executable.execute(inputs, outputs).toPromise();
        return results;
    }

    private getExecutableProcess(processId: string): ExecutableProcess {
        switch (processId) {
            default:
                throw Error(`Could not find a concrete class for process '${processId}'`);
        }
    }
}