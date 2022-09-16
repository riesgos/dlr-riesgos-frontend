import express from 'express';
import { addScenarioApi } from './scenarios/scenario.interface';
import { parseCode } from './parser/scenarioParser';


const port = 1411;
const cacheDir = `./data/cache/`;  // previously calculated results
const storeDir = `./data/store/`;  // files that must be available to outside
const scriptDir = './data/scenarios';  // user-defined logic



async function main() {
    const app = express();
    app.use(express.json());
    const scenarioFactories = await parseCode(scriptDir);
    
    addScenarioApi(app, scenarioFactories, cacheDir, storeDir, `http://localhost:${port}/store/`);
    const server = app.listen(port, () => console.log(`app now listening on port ${port}`));
}

main();