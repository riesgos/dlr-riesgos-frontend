import { readFile, writeFile } from 'fs/promises';
import { RiesgosScenarioMetaData, RiesgosScenarioData, RiesgosProcess, RiesgosProduct, ExecutableProcess } from '../../model/datatypes/riesgos.datatypes';
import { RiesgosDatabase } from '../db';
import { ChoppingSvc, BlendingSvc, CookingSvc } from '../../model/datatypes/processors/cooking.datatypes';
import { FeatureSelector } from '../../model/datatypes/processors/FeatureSelector';


export class FileDb implements RiesgosDatabase {
    private data: any;
    private defaultData = {
        scenarios: [],
        processes: [],
        products: []
    };

    constructor(private filePath: string) {
        this.data = this.defaultData;
    }

    public async init() {
        this.data = await this.readData();
        return true;
    }

    public async close() {
        await this.writeData();
        return true;
    }

    private async readData() {
        return readFile(this.filePath, {encoding: 'utf-8', flag: 'r'})
            .then((contents) => contents.length ? JSON.parse(contents) : this.defaultData);
    }

    private async writeData() {
        if (!this.data) await this.init();
        await writeFile(this.filePath, JSON.stringify(this.data));
        return true;
    }

    async getScenarios(): Promise<RiesgosScenarioMetaData[]> {
        if (!this.data) await this.init();
        return this.data.scenarios;
    }
    
    async getScenarioData(id: string): Promise<RiesgosScenarioData> {
        if (!this.data) await this.init();

        const scenarioMetaData: RiesgosScenarioMetaData = this.data.scenarios.find((s: any) => s.uid === id);
        if (!scenarioMetaData) {
            throw Error(`No scenario named '${id}' in database`);
        }
        
        const processes = await this.getProcessesForScenario(scenarioMetaData);

        const products = await this.getProductsForScenario(scenarioMetaData);

        return {
            metaData: scenarioMetaData,
            processes: processes,
            products: products,
        };
    }

    
    private getProductsForScenario(scenarioMetaData: RiesgosScenarioMetaData): RiesgosProduct[] {
        const productIds: string[] = [];
        for (const call of scenarioMetaData.calls) {
            for (const iId of call.inputs.map(m => m.product)) {
                if (!productIds.includes(iId)) {
                    productIds.push(iId);
                }
            }

            for (const oId of call.outputs.map(m => m.product)) {
                if (!productIds.includes(oId)) {
                    productIds.push(oId);
                }
            }
        }
        const products = productIds.map(pId => this.data.products.find((p: any) => p.uid === pId));
        return products;
    }

    private getProcessesForScenario(scenarioMetaData: RiesgosScenarioMetaData): RiesgosProcess[] {
        const processIds: string[] = [];
        for (const call of scenarioMetaData.calls) {
            if (!processIds.includes(call.process)) {
                processIds.push(call.process);
            }
        }

        const processes = processIds.map(pId => this.data.processes.find((p: any) => p.uid === pId));
        return processes;
    }

    addScenario(data: RiesgosScenarioMetaData): Promise<boolean> {
        this.data.scenarios.push(data);
        return this.writeData();
    }

    addProcess(data: RiesgosProcess): Promise<boolean> {
        this.data.processes.push(data);
        return this.writeData();
    }

    addProduct(data: RiesgosProduct): Promise<boolean> {
        this.data.products.push(data);
        return this.writeData();
    }


    async getProducts(): Promise<RiesgosProduct[]> {
        if (!this.data) await this.init();

        return this.data.products;
    }

    async getProcesses(): Promise<RiesgosProcess[]> {
        if (!this.data) await this.init();

        return this.data.processes;
    }

    async getProduct(id: string): Promise<RiesgosProduct> {
        if (!this.data) await this.init();

        const product = this.data.products.find((p: RiesgosProduct) => p.uid === id);
        return product;
    }

    async getProcess(id: string): Promise<RiesgosProcess> {
        if (!this.data) await this.init();

        const process = this.data.processes.find((p: RiesgosProcess) => p.uid === id);
        return process;
    }

}