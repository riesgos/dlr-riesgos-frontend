import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import axios from 'axios';
declare module 'express-session' {
    export interface SessionData {
      counter: number
    }
  }

test("express sessions", async () => {

    const app = express();
    app.use(session({
        secret: 'simple secret text',
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        },
        resave: false,
        saveUninitialized: false
    }));
    // app.use(cors({
    //     credentials: true,
    //     exposedHeaders: ["set-cookie"],
    // }));


    function ensureSessionCounter(req: Request, res: Response, next: NextFunction) {
        if (!req.session.counter) {
            req.session.counter = 0;
        }
        next();
    }

    app.get('/testroute', ensureSessionCounter, async (req, res) => {
        req.session.counter! += 1;
        res.send({ counter: req.session.counter });
    });

    const server = app.listen(5002);

    const http = axios.create();

    const response11 = await http.get('http://localhost:5002/testroute');
    const response12 = await http.get('http://localhost:5002/testroute', { headers: { Cookie: response11.headers['set-cookie']![0] }} );
    const response13 = await http.get('http://localhost:5002/testroute', { headers: { Cookie: response11.headers['set-cookie']![0] }} );
    const response14 = await http.get('http://localhost:5002/testroute', { headers: { Cookie: response11.headers['set-cookie']![0] }} );
    const response21 = await http.get('http://localhost:5002/testroute');

    expect(response11.data.counter).toBe(1);
    expect(response12.data.counter).toBe(2);
    expect(response13.data.counter).toBe(3);
    expect(response14.data.counter).toBe(4);
    expect(response21.data.counter).toBe(1);

    server.close();
});
