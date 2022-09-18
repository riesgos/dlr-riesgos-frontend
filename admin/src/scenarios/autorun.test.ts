import { parseCode } from '../parser/scenarioParser';
import { deleteFile } from '../utils/files';
import { isDatumReference, isUserSelection, ScenarioState } from './scenarios';
import { Store } from './store';



const codeDir = 'test-data/scenarios';
const storeDir = 'test-data/store';

beforeAll(async () => {
    await deleteFile(storeDir);
});

afterAll(async () => {
    await deleteFile(storeDir);
});


test('autorun', async () => {
    const factories = await parseCode(codeDir);
    const store = new Store(storeDir, 'http:localhost:8000/store');

    for (const factory of factories) {

        const scenario = factory.createScenario(store);
        const summary = scenario.getSummary();
        
        // initial state
        let state: ScenarioState = { data: [] };
        for (const step of summary.steps) {
            
            // 1. simulating a user selecting some input
            for (const input of step.inputs) {
                if (isUserSelection(input)) {
                    state.data.push({
                        id: input.id,
                        value: input.options[Math.floor(Math.random() * input.options.length)]
                    });
                }
            }

            // 2. executing the step
            state = await scenario.execute(step.step, state);

            // 3. verifying that outputs for every step are present
            for (const output of step.outputs) {
                const outputValue = state.data.find(d => d.id === output.id);
                expect(outputValue).toBeTruthy();
                if (isDatumReference(outputValue)) {
                    expect(outputValue.reference).toBeTruthy();
                } else {
                    expect(outputValue?.value).toBeTruthy();
                }
            }
        }


    }
});