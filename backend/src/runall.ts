import axios from 'axios';
import { Datum, ScenarioState } from './scenarios/scenarios';
import { sleep } from './utils/async';


export async function testAll(serverUrl: string, port: number) {
    const axiosArgs = {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
    };

    // Test all scenarios
    const scenarios = (await axios.get(`${serverUrl}:${port}/scenarios`)).data;
    for (const scenario of scenarios) {
        console.log(`Testing scenario: ${scenario.id} ...`);
        const scenarioData = (await axios.get(`${serverUrl}:${port}/scenarios/${scenario.id}/`)).data;

        // Test all steps
        let state: ScenarioState = { data: [] };
        for (const step of scenarioData.steps) {
            console.log(`Testing step: ${scenario.id}/${step.id} ...`);

            // 1. set inputs and outputs
            for (const input of step.inputs) {
                if (input.options && input.options.length > 0) {
                    state.data.push({
                        id: input.id,
                        value: input.options[Math.floor(Math.random() * input.options.length)]
                    });
                } 
                else if ((state.data.find(p => p.id === input.id) as Datum | undefined)?.value) {
                    state.data.push({
                        id: input.id,
                        value: (state.data.find(p => p.id === input.id) as Datum | undefined)?.value
                    });
                } else {
                    state.data.push({
                        id: input.id,
                        value: getDefaultValue(scenario.id, step.id, input.id, state)
                    });
                }
            }
            for (const output of step.outputs) {
                if (!state.data.find(p => p.id === output.id)) {
                    state.data.push({ id: output.id, value: undefined });
                }
            }


            // 2. execute
            const response = await axios.post(`${serverUrl}:${port}/scenarios/${scenario.id}/steps/${step.id}/execute?skipCache=true`, state, axiosArgs);
            const ticket = response.data.ticket;
            let poll: any;
            do {
                await sleep(500);
                poll = await axios.get(`${serverUrl}:${port}/scenarios/${scenario.id}/steps/${step.id}/execute/poll/${ticket}`, axiosArgs);
            } while (poll.data.ticket);
            if (poll.data.error) {
                throw Error(poll.data.error);
            }
            const results = poll.data.results;

            // 3. resolve references
            for (const product of results.data) {
                if (product.reference && !product.value) {
                    product.value = (await axios.get(`${serverUrl}:${port}/files/${product.reference}`, axiosArgs)).data;
                }
            }

            // 4. update state
            state = results;
        }
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
        case 'Ecuador':
        case 'Peru': 
        case 'PeruShort':
        default:
            throw Error(`Unknown combination ${scenarioId}/${stepId}/${paraId}`);
    }
}