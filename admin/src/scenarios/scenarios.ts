import { toPromise } from '../utils/async';
import { Store } from './store';

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

export function isDatum(o: any): o is Datum {
    return o.id && o.value;
}

export function isDatumReference(o: any): o is DatumReference {
    return o.id && o.reference;
}

export type StepFunction = (args: Datum[]) => Promise<Datum[]>;

export interface Step {
    step: number,
    function: StepFunction,
    inputs: (DataDescription | UserSelection)[],
    outputs: DataDescription[],
    title: string,
    description: string
}

export interface StepDescription {
    step: number,
    inputs: (DataDescription | UserSelection)[],
    outputs: DataDescription[],
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
        private store: Store,
        public imageUrl?: string) {}

    public getSummary() {
        const stepSummaries: StepDescription[] = [];
        for (const step of this.steps) {
            stepSummaries.push({
                step: step.step,
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

    public async execute(stepNr: number, state: ScenarioState): Promise<ScenarioState> {
        let step = this.steps.find(s => s.step === stepNr);
        if (!step) throw new Error(`No such step: "${stepNr}" in scenario "${this.id}"`);

        const inputValues = await this.getData(step.inputs.map(i => i.id), state);
        const results = await step.function(inputValues);
        const stateWithOutputs = this.addData(results, state);

        return stateWithOutputs;
    }

    private async getData(ids: string[], state: ScenarioState): Promise<Datum[]> {
        const data$: (Promise<Datum>)[] = [];
        for (const id of ids) {
            data$.push(this.getDatum(id, state));
        }
        return Promise.all(data$);
    }

    private async getDatum(id: string, state: ScenarioState): Promise<Datum> {
        const entry = state.data.find(d => d.id === id);
        if (!entry) return toPromise({ id, value: undefined });
        if (isDatum(entry)) return entry;
        const datum = await this.store.getDatum(entry);
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
        const newDatumReference: DatumReference = await this.store.addDatum(newDatum);
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

};



export class ScenarioFactory {

    private steps: Step[] = [];

    constructor(public id: string, public description: string, public imageUrl?: string) {}

    public registerStep(step: Step) {
        if (this.steps.length !== step.step) throw new Error(`Bad step number ${step.step}. Should be ${this.steps.length}.`);
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

    public createScenario(store: Store) {
        return new Scenario(this.id, this.description, this.steps, store, this.imageUrl);
    }
}