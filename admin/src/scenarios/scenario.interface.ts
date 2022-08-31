import { Express } from 'express';
import objectHash from 'object-hash';
import { FileCache } from '../storage/fileCache';
import { ProcessPool } from './pool';
import { Scenario } from './scenarios';


export function addScenarioApi(app: Express, scenarios: Scenario[], cacheDir: string) {
    scenarios.map(s => s.init());
    const pool = new ProcessPool();
    const cache = new FileCache(cacheDir, 1000);

    app.get('/scenarios', async (req, res) => {
        const data = scenarios.map(s => ({id: s.id, description: s.description, imageUrl: s.imageUrl, nrSteps: s.steps.length}));
        res.send(data);
    });

    app.get('/scenarios/:scenarioId/steps', async (req, res) => {
        const scenarioId = req.params.scenarioId;
        const scenario: Scenario | undefined = scenarios.find(s => s.id === scenarioId);
        if (!scenario) return [];
        const steps = scenario.steps.map(s => ({step: s.step, title: s.title, description: s.description, inputs: s.inputs, state: s.state}));
        res.send(steps);
    });

    app.post('/scenarios/:scenarioId/steps/:stepNumber/execute', async (req, res) => {
        const scenarioId = req.params.scenarioId;
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (!scenario) return [];
        const stepNumber = +req.params.stepNumber;
        const inputs = req.body;
        
        const key = objectHash({scenarioId, stepNumber, inputs});
        // try to get from cache
        const cachedData = await cache.getData(key);
        if (cachedData) {
            res.send(JSON.parse(cachedData));
        } else {
            // otherwise calculate
            pool.scheduleTask(key, async () => await scenario.execute(stepNumber, inputs));
            // send user a ticket for polling
            res.send({ ticket: key });
        }
    });

    app.get('/scenarios/:scenarioId/steps/:stepNumber/execute/poll/:ticket', async (req, res) => {
        const key = req.params.ticket;
        // try to get from cache
        const cachedData = await cache.getData(key);
        if (cachedData) {
            res.send(JSON.parse(cachedData));
        } else {
            // otherwise query existing processes
            const response = pool.poll(key);
            // if completed by now, store result in cache.
            if ('results' in response) {
                const textData = JSON.stringify(response.results);
                cache.storeTextData(key, textData);
            }
            res.send(response);
        }
    });
}