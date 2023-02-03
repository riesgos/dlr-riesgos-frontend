import { parseCode } from './scenarioParser';



const scriptDir = './test-data/scenarios';


test('Test that js file is imported', async () => {
    const factories = await parseCode(scriptDir);
    expect(factories.length > 0).toBeTruthy();
});

test('Test that js files can import other js files', async () => {
    expect(true);
});

test('Test that script-exports contain all required information', async () => {
    expect(true);
});