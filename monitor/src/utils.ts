import axios from 'axios';


export async function testAndRepeat(serverUrl: string, port: number, minutes: number) {
    const startTime = Date.now();
    console.log(`Starting tests: ${new Date()}`);
    await testAllRandomly(serverUrl, port);
    const endTime = Date.now();
    console.log(`Tests completed: ${new Date()} - took ${(endTime - startTime) / 1000 / 60} minutes`);
    setTimeout(() => testAndRepeat(serverUrl, port, minutes), minutes * 60 * 1000);
}



export type InputPicker = (input: Datum | DatumReference, state: ScenarioState, scenarioId: string, stepId: string) => Promise<Datum | DatumReference>;

export async function testAllRandomly(serverUrl: string, port: number) {

    // Test all scenarios
    const scenarios = (await axios.get(`${serverUrl}:${port}/scenarios`)).data;
    for (const scenario of scenarios) {
        // Two scenarios we deliberately skip (for now):
        if(scenario.id === 'Ecuador' || scenario.id === 'PeruShort') continue;

        console.log(`Testing scenario: ${scenario.id} ...`);
        await runScenario(serverUrl, port, scenario.id, pickRandomOption);
    }
}





export async function runScenario(serverUrl: string, port: number, scenarioId: string, inputPicker: InputPicker, resolveReferencesImmediately=false) {
    const axiosArgs = {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
    };

    const scenarioData = (await axios.get(`${serverUrl}:${port}/scenarios/${scenarioId}/`)).data;

    // Test all steps
    let state: ScenarioState = { data: [] };
    for (const step of scenarioData.steps) {
        console.log(`Testing step: ${scenarioId}/${step.id}`);

        // 1. set inputs and outputs
        for (const input of step.inputs) {
            state.data.push(await inputPicker(input, state, scenarioId, step.id));
        }
        for (const output of step.outputs) {
            if (!state.data.find(p => p.id === output.id)) {
                state.data.push({ id: output.id, value: undefined });
            }
        }


        // 2. execute
        const response = await axios.post(`${serverUrl}:${port}/scenarios/${scenarioId}/steps/${step.id}/execute`, state, axiosArgs);
        const ticket = response.data.ticket;
        let poll: any;
        do {
            await sleep(500);
            process.stdout.write(".");
            poll = await axios.get(`${serverUrl}:${port}/scenarios/${scenarioId}/steps/${step.id}/execute/poll/${ticket}`, axiosArgs);
        } while (poll.data.ticket);
        if (poll.data.error) {
            throw Error(poll.data.error);
        }
        const results = poll.data.results;

        // 3. resolve references
        if (resolveReferencesImmediately) {
            for (const product of results.data) {
                if (product.reference && !product.value) {
                    product.value = (await axios.get(`${serverUrl}:${port}/files/${product.reference}`, axiosArgs)).data;
                }
            }
        }

        // 4. update state
        state = results;
    }

    return state;
}

const pickRandomOption: InputPicker = async (input: {id: string}, state: ScenarioState, scenarioId: string, stepId: string) => {

    // 1. Some special cases
    if (input.id === "exposureModelName") {
        return {
            id: input.id,
            value: (input as {id: string, options: any[]}).options.filter(o => o !== 'LimaBlocks')[Math.floor(Math.random() * (input as {id: string, options: any[]}).options.length)]
        };
    }
    if (input.id === "userChoice") {
        // 1. find avaliable eqs
        // 2. resolve if required
        // 3. return random one
    }


    // 2. Some inputs which already have a value
    if (isDatumReference(input)) return input;
    if (isResolvedDatum(input)) return input;
    const foundInState = state.data.find(d => d.id === input.id);
    if (foundInState) {
        if (isDatumReference(foundInState)) return foundInState;
        if (isResolvedDatum(foundInState)) return foundInState;
    }

    // 3. Some inputs with options
    if (isDatumWithDefault(input)) return {id: input.id, value: input.default};
    if (isDatumWithOptions(input)) {
        const index = Math.floor(Math.random() * input.options.length);
        const chosenOption = input.options[index];
        return {...input, value: chosenOption};
    }

    // 4. Some scenario-specific defaults
    return {
        id: input.id,
        value: getDefaultValue(scenarioId, stepId, input.id, state)
    }

}


function getDefaultValue(scenarioId: string, stepId: string, paraId: string, currentState: ScenarioState) {
    switch (scenarioId) {
        case 'Chile':
            switch (stepId) {
                case 'EqsChile':
                    switch (paraId) {
                        case 'eqMminChile':
                            return '6.0';
                        case 'eqMmaxChile':
                            return '9.0';
                        case 'eqZminChile':
                            return '0';
                        case 'eqZmaxChile':
                            return '100';
                    }
                case 'SelectEqChile':
                    switch (paraId) {
                        case 'userChoiceChile':
                            const availableEqs = currentState.data.find(d => d.id === 'availableEqsChile')! as Datum;
                            const features = availableEqs.value.features;
                            return { type: "FeatureCollection", features: [features[Math.floor(Math.random() * features.length)]] };
                    }
            }
        case 'Peru':
            switch (stepId) {
                case 'Eqs':
                    switch (paraId) {
                        case 'eqMmin':
                            return '6.0';
                        case 'eqMmax':
                            return '9.0';
                        case 'eqZmin':
                            return '0';
                        case 'eqZmax':
                            return '100';
                    }
                case 'selectEq':
                    switch (paraId) {
                        case 'userChoice':
                            const availableEqs = currentState.data.find(d => d.id === 'availableEqs')! as Datum;
                            const features = availableEqs.value.features;
                            return { type: "FeatureCollection", features: [features[Math.floor(Math.random() * features.length)]] };
                    }
            }
        case 'Ecuador':
        default:
            throw Error(`Unknown combination ${scenarioId}/${stepId}/${paraId}`);
    }
}



export function isResolvedDatum(o: any): o is Datum {
    return 'id' in o && 'value' in o && o.value !== undefined;
}

export function isDatumReference(o: any): o is DatumReference {
    return 'id' in o && 'reference' in o && o.reference !== undefined;
}

export interface Datum {
    id: string,
    value: any,
};
export interface DatumWithOptions extends Datum {
    options: string[]
}
export interface DatumWithDefault extends Datum {
    default: any
}
export function isDatumWithDefault(datum: {id: string}): datum is DatumWithDefault {
    return datum.hasOwnProperty('default') && (datum as DatumWithDefault).default !== undefined;
}
export function isDatumWithOptions(datum: {id: string}): datum is DatumWithOptions {
    return datum.hasOwnProperty('options') && (datum as DatumWithOptions).options.length > 0;
}
export interface DatumReference {
    id: string,
    reference: string
}
export interface ScenarioState {
    data: (Datum | DatumReference)[]
}


async function sleep(timeMs: number): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), timeMs);
    })
}
