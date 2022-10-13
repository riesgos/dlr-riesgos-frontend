import { Express } from 'express';
import objectHash from 'object-hash';
import { FileCache } from '../storage/fileCache';
import { Store } from './store';
import { ProcessPool } from './pool';
import { Scenario, ScenarioFactory, ScenarioState } from './scenarios';


export function addScenarioApi(app: Express, scenarioFactories: ScenarioFactory[], cacheDir: string, storeDir: string, storeUrl: string) {
    const pool = new ProcessPool();
    const cache = new FileCache(cacheDir, 1000);
    const store = new Store(storeDir, storeUrl);
    const scenarios = scenarioFactories.map(sf => sf.createScenario(store));
    

    app.get('/scenarios', async (req, res) => {
        const data = scenarios.map(s => ({id: s.id, description: s.description, imageUrl: s.imageUrl}));
        res.send(data);
    });

    app.get('/scenarios/:scenarioId', async (req, res) => {
        const scenarioId = req.params.scenarioId;
        const scenario: Scenario | undefined = scenarios.find(s => s.id === scenarioId);
        if (!scenario) return [];
        const summary = scenario.getSummary();
        res.send(summary);
    });

    app.post('/scenarios/:scenarioId/steps/:stepId/execute', async (req, res) => {
        const scenarioId = req.params.scenarioId;
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (!scenario) return [];
        const stepId = req.params.stepId;
        const state: ScenarioState = req.body;
        const key = objectHash({scenarioId, stepId, state});
        // try to get from cache
        const cachedData = await cache.getData(key);
        if (cachedData) {
            res.send({ results: JSON.parse(cachedData) });
        } else {
            // otherwise calculate
            pool.scheduleTask(key, async () => await scenario.execute(stepId, state));
            // send user a ticket for polling
            res.send({ ticket: key });
        }
    });

    app.get('/scenarios/:scenarioId/steps/:stepId/execute/poll/:ticket', async (req, res) => {
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