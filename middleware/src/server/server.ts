import express from 'express';
import { Request, Response } from 'express';
import { RiesgosService } from '../model/riesgos.service';
import { Call, RiesgosProcess, RiesgosProduct } from '../model/datatypes/riesgos.datatypes';
import { Server as WsServer } from 'ws';
import { RiesgosDatabase } from '../database/db';
const url = require('url');


export function setUpServer(port = 3000, db: RiesgosDatabase) {
    const app = express();
    
    const riesgosService = new RiesgosService(db);
    
    
    app.get('/getScenarioMetaData', (req: Request, res: Response) => {
        riesgosService.getScenarios().subscribe((result) => {
            res.send(result);
        });
    });
    
    app.get('/getScenarioData/:id', (req: Request, res: Response) => {
        riesgosService.getScenarioData(req.params.id).subscribe((result) => {
            res.send(result);
        });
    });
    
    const expressServer = app.listen(port, () => {
        console.log(`App listening on http://localhost:${port}`);
    });
    
    const wsServer = new WsServer({ noServer: true });
    wsServer.on('connection', (socket) => {
        socket.on('message', (message) => {
            
            const parsed = JSON.parse(message.toString());
            const process = parsed.process as RiesgosProcess;
            const products = parsed.products as RiesgosProduct[];
            const call = parsed.call as Call;
            const inputs: {[slot: string]: RiesgosProduct} = {};
            const outputs: {[slot: string]: RiesgosProduct} = {};
            for(const i of call.inputs) {
                const product = products.find(p => p.uid === i.product);
                if (!product) {throw Error(`No product sent found for productId ${i.product}`); }
                inputs[i.slot] = product;
            };
            for(const o of call.outputs) {
                const product = products.find(p => p.uid === o.product);
                if (!product) {throw Error(`No product sent found for productId ${o.product}`); }
                outputs[o.slot] = product;
            };

            riesgosService.executeProcess(process, inputs, outputs)
            .subscribe((results: {[slot: string]: RiesgosProduct}) => {
                console.log('Server: execution results', results);
                socket.send(JSON.stringify(results));
                socket.close();
            }, (error: any) => {
                console.log('An error occurred: ', error);
                socket.send(JSON.stringify(error.message));
                socket.close();
            });
        });
    });
    
    expressServer.on('upgrade', (request, socket, head) => {
        const pathname = url.parse(request.url).pathname;
    
        if (pathname === '/executeProcess') {
            wsServer.handleUpgrade(request, socket, head, function done(ws) {
                wsServer.emit('connection', ws, request);
            });
        } else {
            socket.destroy();
        }
    });

    return expressServer;
}
