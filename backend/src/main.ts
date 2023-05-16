import cors from 'cors';
import express from 'express';
import { ScenarioAPIConfig, addScenarioApi } from './scenarios/scenario.interface';
// import { parseCode } from './parser/scenarioParser';
import { peruFactory } from './usr/peru/peru';
import { peruShortFactory } from './usr/peru_short/peru';
import { chileFactory } from './usr/chile/chile';
import { ecuadorFactory } from './usr/ecuador/ecuador';


const port = parseInt(process.env.port || "8008");
const logDir = `./data/logs/`;   // server-logs
const storeDir = `./data/store/`;  // files that must be available to outside
const scriptDir = './data/scenarios';  // user-defined logic


const config: ScenarioAPIConfig = {
    logDir: logDir,
    maxStoreLifeTimeMinutes: parseInt(process.env.maxStoreLifetimeMinutes || "60"),
    sender: process.env.sourceEmail || "info@test.com",
    sendMailTo: (process.env.adminEmails || "").split(","),
    maxLogAgeMinutes: 24 * 60,
    storeDir: storeDir,
    verbosity: 'verbose'   
}

async function main() {
    const app = express();
    app.use(cors());
    
    // const scenarioFactories = await parseCode(scriptDir);
    const scenarioFactories = [chileFactory, ecuadorFactory, peruFactory, peruShortFactory];

    addScenarioApi(app, scenarioFactories, config);
    const server = app.listen(port, () => console.log(`app now listening on port ${port}`));
}

main();
