import express, { Request, Response } from 'express';
import cors from 'cors';
import parser from 'body-parser';
import { ProcessPool } from './serverLogic';
import { runScheduler } from '../scheduled/scheduler';


export function createExpressApp() {
    const expressApp = express();
    // parsing json when `content-type: application/json`
    expressApp.use(parser.json({limit: '150mb'}));  // increasing size-limit to handle even LimaManzanas
    // setting cors headers
    expressApp.use(cors());
    // handling polling for long running execute requests
    const pool = new ProcessPool(10);
    runScheduler();
    
    expressApp.get('/test', (req: Request, res: Response) => {
        res.send('Proxy working!');
    });
    
    expressApp.post('/execute', (req: Request, res: Response) => {
        const data = req.body;
        // const dataDecoded = JSON.parse(decodeURI(JSON.stringify(data)));
        const id = pool.execute(data);
        res.json({id});
    });
    expressApp.get('/execute/:id', (req: Request, res: Response) => {
        const id = +req.params['id'];
        const result = pool.get(id);
        res.json(result);
    });
    
    return expressApp;
}

