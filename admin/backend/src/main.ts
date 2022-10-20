import express from 'express';
import { addScenarioApi } from './scenarios/scenario.interface';
// import { parseCode } from './parser/scenarioParser';
import { peruFactory } from './usr/peru/peru';


const port = 1411;
const logDir = `./data/logs/`;   // server-logs
const cacheDir = `./data/cache/`;  // previously calculated results
const storeDir = `./data/store/`;  // files that must be available to outside
const scriptDir = './data/scenarios';  // user-defined logic



async function main() {
    const app = express();
    app.use(express.json());
    // const scenarioFactories = await parseCode(scriptDir);
    const scenarioFactories = [peruFactory];
    
    addScenarioApi(app, scenarioFactories, storeDir, logDir);
    const server = app.listen(port, () => console.log(`app now listening on port ${port}`));
}

main();