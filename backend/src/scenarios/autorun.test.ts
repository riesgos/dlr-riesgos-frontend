import { parseCode } from '../parser/scenarioParser';
import { deleteFile } from '../utils/files';
import { FileStorage } from '../storage/fileStorage';
import { DatumLinage, isDatumReference, ScenarioState } from './scenarios';



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
    const store = new FileStorage<DatumLinage>(storeDir, 60);

    for (const factory of factories) {

        const scenario = factory.createScenario(store);
        const summary = scenario.getSummary();
        
        // initial state
        let state: ScenarioState = { data: [] };
        for (const step of summary.steps) {
            
            // 1. simulating a user selecting some input
            for (const input of step.inputs) {
                if (input.options) {
                    state.data.push({
                        id: input.id,
                        value: input.options[Math.floor(Math.random() * input.options.length)]
                    });
                }
            }

            // 2. executing the step
            state = await scenario.execute(step.id, state);

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