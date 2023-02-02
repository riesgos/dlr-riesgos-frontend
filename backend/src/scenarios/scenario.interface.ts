import express, { Express } from 'express';
import objectHash from 'object-hash';
import { ProcessPool } from './pool';
import { DatumLinage, Scenario, ScenarioFactory, ScenarioState } from './scenarios';
import { Logger } from '../logging/logger';
import { FileStorage } from '../storage/fileStorage';


export function addScenarioApi(app: Express, scenarioFactories: ScenarioFactory[], storeDir: string, loggingDir: string, verbosity: 'verbose' | 'silent' = 'verbose', sendMailOnError = true) {
    app.use(express.json({
        limit: '50mb'  // required because exposure objects can become pretty big
    }));

    const pool = new ProcessPool();
    const fs = new FileStorage<DatumLinage>(storeDir);
    const scenarios = scenarioFactories.map(sf => sf.createScenario(fs));
    const logger = new Logger(loggingDir, verbosity, undefined, sendMailOnError);
    logger.monkeyPatch();


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
        pool.scheduleTask(key, async () => await scenario.execute(stepId, state));
        // send user a ticket for polling
        res.send({ ticket: key });
    });

    app.get('/scenarios/:scenarioId/steps/:stepId/execute/poll/:ticket', async (req, res) => {
        const key = req.params.ticket;
        const response = pool.poll(key);
        res.send(response);
    });

    app.get('/files/:hash', async (req, res) => {
        const hash = req.params.hash;
        const cachedData = await fs.getDataByKey(hash);
        res.send(cachedData);
    });

}