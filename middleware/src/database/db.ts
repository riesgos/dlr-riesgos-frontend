import { Observable } from "rxjs";
import { ExecutableProcess, RiesgosProcess, RiesgosProduct, RiesgosScenarioData, RiesgosScenarioMetaData } from "../model/datatypes/riesgos.datatypes";


export interface RiesgosDatabase {
    init(): Promise<boolean>;
    getScenarios(): Observable<RiesgosScenarioMetaData[]>;
    getScenarioData(id: string): Observable<RiesgosScenarioData>;
    addScenario(data: RiesgosScenarioMetaData): Observable<boolean>;
    addProcess(data: RiesgosProcess): Observable<boolean>;
    addProduct(data: RiesgosProduct): Observable<boolean>;
    getExecutableProcess(id: string): Observable<ExecutableProcess>;
};