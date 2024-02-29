import express, { Express } from 'express';
import objectHash from 'object-hash';
import { Logger } from '../logging/logger';
import { FileStorage } from '../storage/fileStorage';
import { ProcessPool } from './pool';
import {
    DatumLinage,
    Scenario,
    ScenarioFactory,
    ScenarioState,
} from './scenarios';

export interface ScenarioAPIConfig {
    sendMailTo: string[];
    sender: string;
    maxLogAgeMinutes: number | undefined;
    storeDir: string;
    logDir: string;
    verbosity: 'verbose' | 'silent';
    maxStoreLifeTimeMinutes: number;
}

export async function verifyAllFulfilled(scenarioFactories: ScenarioFactory[]) {
    for (const factory of scenarioFactories) {
        const result = await factory.verifyConditions();
        if (result !== true) return result;
    }
    return true;
}

export function addScenarioApi(
    app: Express,
    scenarioFactories: ScenarioFactory[],
    config: ScenarioAPIConfig
) {
    app.use(
        express.json({
            limit: '200mb', // required because exposure objects can become pretty big
        })
    );
    app.use((req, res, next) => {
        console.log('>>>> New request:', req.originalUrl);
        res.setHeader(
            'Expires',
            new Date(Date.now() + 1 * 60 * 1000).toUTCString()
        );
        next();
    });

    const pool = new ProcessPool();
    const fs = new FileStorage<DatumLinage>(
        config.storeDir,
        config.maxStoreLifeTimeMinutes
    );
    const scenarios = scenarioFactories.map((sf) => sf.createScenario(fs));
    const logger = new Logger(
        config.logDir,
        config.sendMailTo,
        config.sender,
        config.verbosity,
        config.maxLogAgeMinutes
    );
    logger.monkeyPatch();

    app.get('/scenarios', async (req, res) => {
        const data = scenarios.map((s) => ({
            id: s.id,
            description: s.description,
            imageUrl: s.imageUrl,
        }));
        res.send(data);
    });

    app.get('/scenarios/:scenarioId', async (req, res) => {
        const scenarioId = req.params.scenarioId;
        const scenario: Scenario | undefined = scenarios.find(
            (s) => s.id === scenarioId
        );
        if (!scenario) return [];
        const summary = scenario.getSummary();
        res.send(summary);
    });

    app.post(
        '/scenarios/:scenarioId/steps/:stepId/execute',
        async (req, res) => {
            const scenarioId = req.params.scenarioId;
            const scenario = scenarios.find((s) => s.id === scenarioId);
            if (!scenario) return [];
            const stepId = req.params.stepId;
            const state: ScenarioState = req.body;
            const skipCache =
                req.query.skipCache === 'true' ||
                req.query.skipCache === 'True' ||
                req.query.skipCache === 'TRUE'
                    ? true
                    : false;
            const key = objectHash({ scenarioId, stepId, state });
            console.log(`Scheduling task: ${key}/${scenarioId}-${stepId}`);
            pool.scheduleTask(
                key,
                async () => await scenario.execute(stepId, state, skipCache)
            );
            // send user a ticket for polling
            res.setHeader(
                'Expires',
                new Date(Date.now() + 0 * 1000).toUTCString()
            );
            res.setHeader('Cache-Control', 'no-store');
            res.send({ ticket: key });
        }
    );

    app.get(
        '/scenarios/:scenarioId/steps/:stepId/execute/poll/:ticket',
        async (req, res) => {
            const key = req.params.ticket;
            const response = pool.poll(key);
            res.setHeader(
                'Expires',
                new Date(Date.now() + 0 * 1000).toUTCString()
            );
            res.setHeader('Cache-Control', 'no-store');
            res.send(response);
            console.log(
                `Got poll for ticket: ${key}. Responding with ${JSON.stringify(
                    response
                )}`
            );
        }
    );

    app.get('/files/:hash', async (req, res) => {
        const hash = req.params.hash;
        const cachedData = await fs.getDataByKey(hash);
        if (!cachedData) {
            console.error(`No such file: ${hash}`);
            res.statusCode = 404;
        }
        res.send(cachedData);
        console.log(
            `Got request for file ${hash}. Responding with ${cachedData}.`
        );
    });
}
