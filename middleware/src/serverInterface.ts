import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Server as WsServer } from 'ws';
import { proxyExecuteRequest } from './serverLogic';
import url from 'url';


/**
 * 
 * HTTP /proxy/:target
 *  => proxy to `target`
 * 
 * 
 * WS /execute
 *  => proxy to async WPS requests
 *  => cache results
 */



const port = 8888;

const expressApp = express();

expressApp.get('/test', (req: Request, res: Response) => {
    res.send('Proxy working!');
});

const wsServer = new WsServer({ noServer: true });
wsServer.on('connection', (socket) => {
    socket.on('message', async (message) => {
        const parsed = JSON.parse(message.toString());
        try {
            const results = await proxyExecuteRequest(parsed);
            socket.send(JSON.stringify(results));
            socket.close();
        } catch (error: any) {
            console.log('error', error);
            socket.send(JSON.stringify(error.message));
            socket.close();
        }
    });
});

const expressServer = expressApp.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});

expressServer.on('upgrade', (request, socket, head) => {
    if (!request.url) return;

    const pathname = url.parse(request.url).pathname;

    if (pathname === '/execute') {
        wsServer.handleUpgrade(request, socket, head, function done(ws) {
            wsServer.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

