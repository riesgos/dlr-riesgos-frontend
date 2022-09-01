
export interface DataDescription {
    id: string
};

export interface UserSelection extends DataDescription {
    options: string[]
}

export interface Data {
    id: string,
    value: any
};


export type StepFunction = (args: Data[]) => Promise<Data[]>;

export interface Step {
    step: number,
    function: StepFunction,
    inputs: (DataDescription | UserSelection)[],
    outputs: DataDescription[],
    title: string,
    description: string
}

export interface ScenarioState {
    data: Data[]
}

export class Scenario {
    private steps: Step[] = [];

    constructor(public id: string, public description: string, public imageUrl?: string) {}

    public getSummary() {
        const stepSummaries: any[] = [];
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

    public registerStep(step: Step) {
        if (this.steps.length !== step.step) throw new Error(`Bad step number ${step.step}. Should be ${this.steps.length}.`);
        this.steps.push(step);
    }

    public async execute(stepNr: number, state: ScenarioState): Promise<ScenarioState> {
        let step = this.steps.find(s => s.step === stepNr);
        if (!step) throw new Error(`No such step: "${stepNr}" in scenario "${this.id}"`);

        const inputValues = this.getData(step.inputs.map(i => i.id), state);
        const results = await step.function(inputValues as Data[]);
        const stateWithOutputs = this.addData(results, state);

        return stateWithOutputs;
    }

    private getData(ids: string[], state: ScenarioState) {
        const data: (Data | undefined)[] = [];
        for (const id of ids) {
            data.push(this.getDatum(id, state));
        }
        return data;
    }

    private getDatum(id: string, state: ScenarioState) {
        const datum = state.data.find(d => d.id === id);
        return datum;
    }

    private addData(newData: Data[], state: ScenarioState) {
        for (const newDatum of newData) {
            this.addDatum(newDatum, state);
        }
        return state;
    }

    private addDatum(newDatum: Data, state: ScenarioState) {
        for (const datum of state.data) {
            if (datum.id === newDatum.id) {
                datum.value = newDatum.value;
                return state;
            }
        }
        state.data.push(newDatum);
        return state;
    }

};
