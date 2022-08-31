
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
    state?: 'incomplete' | 'ready' | 'running' | 'completed',
    function: StepFunction,
    inputs: (DataDescription | UserSelection)[],
    outputs: DataDescription[],
    title: string,
    description: string
}

export class Scenario {
    public steps: Step[] = [];
    public data: Data[] = [];

    constructor(public id: string, public description: string, public imageUrl?: string) {}

    public registerStep(step: Step) {
        if (this.steps.length !== step.step) throw new Error(`Bad step number`);
        this.steps.push(step);
    }

    public init() {
        this.data = [];
        this.updateStepsDownstream(-1);
    }

    public async execute(stepNr: number, userInputs: Data[]) {
        let step = this.steps.find(s => s.step === stepNr);
        if (!step) throw new Error(`No such step: "${stepNr}" in scenario "${this.id}"`);

        this.addData(userInputs);
        step = this.updateStepState(step);
        if (step.state !== 'ready') throw new Error(`Step "${step.title}" is currently in state ${step.state}`);

        const inputValues = this.getData(step.inputs.map(i => i.id));
        step.state = 'running';
        const results = await step.function(inputValues as Data[]);
        step.state = 'completed';

        this.addData(results);
        this.updateStepsDownstream(step.step);

        return results;
    }

    private updateStepState(step: Step) {
        if (!step.state || step.state === 'incomplete') {
            const inputValues = this.getData(step.inputs.map(s => s.id));
            if (inputValues.includes(undefined)) {
                step.state = 'incomplete';
            } else {
                step.state = 'ready';
            }
        }
        return step;
    }

    private updateStepsDownstream(fromStepNr: number) {
        const downStreamSteps = this.steps.filter(s => s.step > fromStepNr);
        for (const step of downStreamSteps) {
            this.updateStepState(step);
        }
    }

    private getData(ids: string[]) {
        const data: (Data | undefined)[] = [];
        for (const id of ids) {
            data.push(this.getDatum(id));
        }
        return data;
    }

    private getDatum(id: string) {
        const datum = this.data.find(d => d.id === id);
        return datum;
    }

    private addData(newData: Data[]) {
        for (const newDatum of newData) {
            this.addDatum(newDatum);
        }
    }

    private addDatum(newDatum: Data) {
        for (const datum of this.data) {
            if (datum.id === newDatum.id) {
                datum.value = newDatum.value;
                return;
            }
        }
        this.data.push(newDatum);
    }

};

