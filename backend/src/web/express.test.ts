import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';

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

    const response11 = await fetch('http://localhost:5002/testroute');
    const response12 = await fetch('http://localhost:5002/testroute', { headers: { Cookie: response11.headers.get('set-cookie')![0] }} );
    const response13 = await fetch('http://localhost:5002/testroute', { headers: { Cookie: response11.headers.get('set-cookie')![0] }} );
    const response14 = await fetch('http://localhost:5002/testroute', { headers: { Cookie: response11.headers.get('set-cookie')![0] }} );
    const response21 = await fetch('http://localhost:5002/testroute');

    const response11Data = (await response11.json()).counter;
    const response12Data = (await response12.json()).counter;
    const response13Data = (await response13.json()).counter;
    const response14Data = (await response14.json()).counter;
    const response21Data = (await response21.json()).counter;

    expect(response11Data).toBe(1);
    expect(response12Data).toBe(2);
    expect(response13Data).toBe(3);
    expect(response14Data).toBe(4);
    expect(response21Data).toBe(1);

    server.close();
});
