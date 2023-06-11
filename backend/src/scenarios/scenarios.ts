import { toPromise } from '../utils/async';
import { FileStorage } from '../storage/fileStorage';

export interface DataDescription {
    id: string,
    options?: any[],
    default?: any
};


export interface Datum {
    id: string,
    value: any
};

export interface DatumReference {
    id: string,
    reference: string
}

export interface DatumLinage {
    datumId: string,
    stepId: string,
    inputs: (DatumReference | Datum)[]
}

export function isResolvedDatum(o: any): o is Datum {
    return 'id' in o && 'value' in o && o.value !== undefined;
}

export function isDatumReference(o: any): o is DatumReference {
    return 'id' in o && 'reference' in o && o.reference !== undefined;
}

export type StepFunction = (args: Datum[]) => Promise<Datum[]>;

export interface Step {
    function: StepFunction,
    inputs: DataDescription[],
    outputs: DataDescription[],
    id: string,
    title: string,
    description: string
}

export interface StepDescription {
    inputs: DataDescription[],
    outputs: DataDescription[],
    id: string,
    title: string,
    description: string
}

export interface ScenarioDescription {
    id: string,
    description: string,
    imageUrl?: string,
    steps: StepDescription[]
}

export interface ScenarioState {
    data: (Datum | DatumReference)[]
}

export class Scenario {

    constructor(
        public id: string,
        public description: string,
        private steps: Step[],
        private store: FileStorage<DatumLinage>,
        public imageUrl?: string) {}

    public getSummary(): ScenarioDescription {
        const stepSummaries: StepDescription[] = [];
        for (const step of this.steps) {
            stepSummaries.push({
                id: step.id,
                title: step.title,
                description: step.description,
                inputs: step.inputs,
                outputs: step.outputs
            })
        }
        return {
            id: this.id,
            description: this.description,
            imageUrl: this.imageUrl,
            steps: stepSummaries
        };
    }

    public async execute(stepId: string, state: ScenarioState, skipCache=false): Promise<ScenarioState> {
        let step = this.steps.find(s => s.id === stepId);
        if (!step) throw new Error(`No such step: "${stepId}" in scenario "${this.id}"`);
        console.log(`Scenarios: Now executing ${stepId}`);

        if (!skipCache) {
            const alreadyCalculated = await this.loadFromCache(step, state);
            if (alreadyCalculated) {
                console.log(`Scenarios: using a cached version of output for ${stepId}`);
                const stateWithOutputs = this.addData(alreadyCalculated, state);
                return stateWithOutputs;
            }
        }

        const inputValues = await this.resolveData(step.inputs.map(i => i.id), state);
        const results = await step.function(inputValues);
        const stateWithOutputs = this.addData(results, state);

        console.log(`Scenarios: Completed computation of ${step.id}`);
        return stateWithOutputs;
    }

    private async resolveData(ids: string[], state: ScenarioState): Promise<Datum[]> {
        const data$: (Promise<Datum>)[] = [];
        for (const id of ids) {
            data$.push(this.resolveDatum(id, state));
        }
        return Promise.all(data$);
    }

    private async resolveDatum(id: string, state: ScenarioState): Promise<Datum> {
        const entry = state.data.find(d => d.id === id);
        if (!entry) return toPromise({ id, value: undefined });
        if (isResolvedDatum(entry)) return entry;
        if (isDatumReference(entry)) {
            const value = await this.store.getDataByKey(entry.reference);
            if (value === undefined) throw Error(`Couldn't resolve datum "${id}" with refrence "${entry.reference}". Might be out of date.`);
            const datum: Datum = { id, value };
            return datum;
        }
        return toPromise({ id, value: undefined });
    }

    private async addData(newData: Datum[], state: ScenarioState): Promise<ScenarioState> {
        if (newData.length === 0) return state;
        const tasks$: Promise<any>[] = [];
        for (const newDatum of newData) {
            tasks$.push(this.addDatum(newDatum, state));
        }
        await Promise.all(tasks$);
        return state;
    }

    private async addDatum(newDatum: Datum, state: ScenarioState): Promise<ScenarioState> {

        // Data is stored in cache hashed by the inputs that led to it.
        const linage = this.getLinage(newDatum.id, state);
        const key = await this.store.addData(newDatum.value, linage);

        const newDatumReference: DatumReference = {
            id: newDatum.id,
            reference: key
        };
        for (const entry of state.data) {
            if (entry.id === newDatumReference.id) {
                if (isResolvedDatum(entry)) throw new Error(`Updating state: Trying to replace a datum with a datum-reference: ${entry.id}`);
                entry.reference = newDatumReference.reference;
                return state;
            }
        }
        state.data.push(newDatumReference);
        return state;
    }

    private getLinage(id: string, state: ScenarioState): DatumLinage {
        const step = this.steps.find(s => s.outputs.map(o => o.id).includes(id));
        if (!step) throw new Error(`Cannot get linage of datum ${id}: it has no parent-step. Maybe this is user-provided data?`);
        const inputIds = step.inputs.map(i => i.id);
        const inputs: (Datum | DatumReference)[] = [];
        for (const id of inputIds) {
            const input = state.data.find(d => d.id === id);
            if (!input) throw new Error(`Could not find data-point with id ${id}`);
            inputs.push(input);
        }
        return {
            datumId: id,
            stepId: step.id,
            inputs: inputs
        }
    }

    private async loadFromCache(step: Step, state: ScenarioState): Promise<Datum[] | undefined> {
        const outputs: Datum[] = [];
        for (const outputDescription of step.outputs) {
            const lineage = this.getLinage(outputDescription.id, state);
            const outputData = await this.store.getDataByProperties(lineage);
            if (!outputData) return undefined;
            outputs.push({
                id: outputDescription.id,
                value: outputData
            });
        }
        return outputs;
    }
};



export class ScenarioFactory {

    private steps: Step[] = [];
    private conditions: (() => Promise<true | string>)[] = [];

    constructor(public id: string, public description: string, public imageUrl?: string) {}

    public registerStep(step: Step) {
        const outputIds = this.steps.reduce((prev: string[], curr) => [... prev, ... curr.outputs.map(i => i.id)], []);
        for (const output of step.outputs) {
            if (outputIds.includes(output.id)) throw new Error(`This output-id is already taken: ${output.id}`);
        }
        this.steps.push(step);
    }

    public registerCondition(condition: () => Promise<true | string>) {
        this.conditions.push(condition);
    }

    public async verifyConditions() {
        for(const condition of this.conditions) {
            const fulfilled = await condition();
            if (fulfilled !== true) return fulfilled;
        }
        return true;
    }

    public createScenario(store: FileStorage<DatumLinage>) {
        return new Scenario(this.id, this.description, this.steps, store, this.imageUrl);
    }

}