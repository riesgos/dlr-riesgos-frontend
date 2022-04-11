import express, { Request, Response } from 'express';
import { Server as WsServer } from 'ws';
import { proxyExecuteRequest } from './serverLogic';
import url from 'url';
import { MailClient } from './web/mailClient';
import { config } from './config';

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
const mailClient = new MailClient();

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
            const html = `
                <p>An error has occurred in the execution of the following request.</p>
                <p>Request:</p>
                <p>${JSON.stringify(message)}</p>
                <p>Error:</p>
                <p>${JSON.stringify(error)}</p>
                <p>${error.stack}</p>
                <p>Time:</p>
                <p>${new Date()}</p>
            `;
            mailClient.sendMail(config.siteAdmins, 'Riesgos Middleware: Error on execute-request', html);
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

