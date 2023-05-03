import axios from 'axios';
import { config } from './config';
import { MailClient } from './mailClient';



main(`http://localhost`, config.port, 120);



async function main(serverUrl: string, port: number, minutes: number) {
    const mailClient = new MailClient();
    try {
        await testAndRepeat(serverUrl, port, minutes);
    } catch (error) {
        console.log(`Monitor has detected a problem: `, error);
        mailClient.sendMail([config.adminEmail], `Monitor has detected a problem`, JSON.stringify(error));
        main(serverUrl, port, minutes);
    }
}




async function testAndRepeat(serverUrl: string, port: number, minutes: number) {
    const startTime = Date.now();
    console.log(`Starting tests: ${new Date()}`);
    await testAll(serverUrl, port);
    const endTime = Date.now();
    console.log(`Tests completed: ${new Date()} - took ${(endTime - startTime) / 1000 / 60} minutes`);
    setTimeout(testAndRepeat, minutes * 60 * 1000);
}





async function testAll(serverUrl: string, port: number) {
    const axiosArgs = {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
    };

    // Test all scenarios
    const scenarios = (await axios.get(`${serverUrl}:${port}/scenarios`)).data;
    for (const scenario of scenarios) {
        // Two scenarios we deliberately skip (for now):
        if(scenario.id === 'Ecuador' || scenario.id === 'PeruShort') continue;

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




interface Datum {
    id: string,
    value: any
};
interface DatumReference {
    id: string,
    reference: string
}
interface ScenarioState {
    data: (Datum | DatumReference)[]
}


async function sleep(timeMs: number): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), timeMs);
    })
}
