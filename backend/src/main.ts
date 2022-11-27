import cors from 'cors';
import express from 'express';
import { addScenarioApi } from './scenarios/scenario.interface';
// import { parseCode } from './parser/scenarioParser';
import { peruFactory } from './usr/peru/peru';
import { chileFactory } from './usr/chile/chile';


const port = 1411;
const logDir = `./data/logs/`;   // server-logs
const storeDir = `./data/store/`;  // files that must be available to outside
const scriptDir = './data/scenarios';  // user-defined logic



async function main() {
    const app = express();
    app.use(cors());
    // const scenarioFactories = await parseCode(scriptDir);
    const scenarioFactories = [peruFactory, chileFactory];
    
    addScenarioApi(app, scenarioFactories, storeDir, logDir);
    const server = app.listen(port, () => console.log(`app now listening on port ${port}`));
}

main();