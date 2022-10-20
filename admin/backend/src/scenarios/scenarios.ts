import { toPromise } from '../utils/async';
import { FileStorage } from '../storage/fileStorage';

export interface DataDescription {
    id: string
};

export interface UserSelection extends DataDescription {
    options: string[]
}

export function isUserSelection(a: DataDescription): a is UserSelection {
    return a.hasOwnProperty('options');
}

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
    inputReferences: DatumReference[]
}

export function isDatum(o: any): o is Datum {
    return o.id && o.value;
}

export function isDatumReference(o: any): o is DatumReference {
    return o.id && o.reference;
}

export type StepFunction = (args: Datum[]) => Promise<Datum[]>;

export interface Step {
    function: StepFunction,
    inputs: (DataDescription | UserSelection)[],
    outputs: DataDescription[],
    id: string,
    title: string,
    description: string
}

export interface StepDescription {
    inputs: (DataDescription | UserSelection)[],
    outputs: DataDescription[],
    id: string,
    title: string,
    description: string
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

    public getSummary() {
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

    public async execute(stepId: string, state: ScenarioState): Promise<ScenarioState> {
        let step = this.steps.find(s => s.id === stepId);
        if (!step) throw new Error(`No such step: "${stepId}" in scenario "${this.id}"`);

        const alreadyCalculated = await this.loadFromCache(step, state);
        if (alreadyCalculated) {
            const stateWithOutputs = this.addData(alreadyCalculated, state);
            return stateWithOutputs;
        }

        const inputValues = await this.resolveData(step.inputs.map(i => i.id), state);
        const results = await step.function(inputValues);
        const stateWithOutputs = this.addData(results, state);

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
        if (isDatum(entry)) return entry;
        const value = await this.store.getDataByKey(entry.reference);
        const datum: Datum = { id, value };
        return datum;
    }

    private async addData(newData: Datum[], state: ScenarioState): Promise<ScenarioState> {
        const tasks$: Promise<any>[] = [];
        for (const newDatum of newData) {
            tasks$.push(this.addDatum(newDatum, state));
        }
        await Promise.all(tasks$);
        return state;
    }

    private async addDatum(newDatum: Datum, state: ScenarioState): Promise<ScenarioState> {
        const linage = this.getLinage(newDatum.id, state);
        const key = await this.store.addData(newDatum.value, linage);

        const newDatumReference: DatumReference = {
            id: newDatum.id,
            reference: key
        };
        for (const entry of state.data) {
            if (entry.id === newDatumReference.id) {
                if (!isDatumReference(entry)) throw new Error(`Trying to replace a datum with a datum-reference: ${entry.id}`);
                entry.reference = newDatumReference.reference;
                return state;
            }
        }
        state.data.push(newDatumReference);
        return state;
    }

    private getLinage(id: string, state: ScenarioState): DatumLinage {
        const step = this.steps.find(s => s.outputs.map(o => o.id).includes(id));
        if (!step) throw new Error(`The datum ${id} has no parent-step.`);
        const inputIds = step.inputs.map(i => i.id);
        const inputs = inputIds.map(id => state.data.find(d => d.id === id)!);
        const inputRefs = inputs.filter(i => isDatumReference(i)) as DatumReference[];
        return {
            datumId: id,
            stepId: step.id,
            inputReferences: inputRefs
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

    constructor(public id: string, public description: string, public imageUrl?: string) {}

    public registerStep(step: Step) {
        const inputIds = this.steps.reduce((prev: string[], curr) => [... prev, ... curr.inputs.map(i => i.id)], []);
        for (const input of step.inputs) {
            if (inputIds.includes(input.id)) throw new Error(`This input-id is already taken: ${input.id}`);
        }
        const outputIds = this.steps.reduce((prev: string[], curr) => [... prev, ... curr.outputs.map(i => i.id)], []);
        for (const output of step.outputs) {
            if (outputIds.includes(output.id)) throw new Error(`This output-id is already taken: ${output.id}`);
        }
        this.steps.push(step);
    }

    public createScenario(store: FileStorage<DatumLinage>) {
        return new Scenario(this.id, this.description, this.steps, store, this.imageUrl);
    }
}