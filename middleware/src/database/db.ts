import { ExecutableProcess, RiesgosProcess, RiesgosProduct, RiesgosScenarioData, RiesgosScenarioMetaData } from "../model/datatypes/riesgos.datatypes";


export interface RiesgosDatabase {
    init(): Promise<boolean>;
    getScenarios(): Promise<RiesgosScenarioMetaData[]>;
    getScenarioData(id: string): Promise<RiesgosScenarioData>;
    addScenario(data: RiesgosScenarioMetaData): Promise<boolean>;
    addProcess(data: RiesgosProcess): Promise<boolean>;
    addProduct(data: RiesgosProduct): Promise<boolean>;
    getProducts(): Promise<RiesgosProduct[]>;
    getProcesses(): Promise<RiesgosProcess[]>;
    getProduct(id: string): Promise<RiesgosProduct>;
    getProcess(id: string): Promise<RiesgosProcess>;
};