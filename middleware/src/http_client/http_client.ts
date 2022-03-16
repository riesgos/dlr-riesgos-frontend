import * as https from 'https';
import * as http from 'http';
import { Observable } from 'rxjs';
import { URL } from 'url';
import { WpsHttpClient, WpsHttpClientRequestParameters } from '../wps/public-api';


export class HttpClient implements WpsHttpClient {
    public get(url: string, paras?: WpsHttpClientRequestParameters): Observable<string> {
        const getObservable = new Observable<any>(subscriber => {
            const urlObj = new URL(url);
            const host = urlObj.hostname;
            const port = urlObj.port;
            const path = urlObj.pathname;
            const search = urlObj.search;

            const getOptions: https.RequestOptions = {
                host: host,
                port: port,
                path: path + search,
                method: 'GET',
                headers: {
                    ... paras?.headers
                },
            };


            let engine;
            if(urlObj.protocol === 'https:') {
                engine = https;
            } else {
                engine = http;
            }

            const req = engine.request(getOptions, (resp) => {
                let responseDataString = '';
    
                // A chunk of data has been received.
                resp.on('data', (chunk) => {
                    responseDataString += chunk;
                });
    
                // The whole response has been received.
                resp.on('end', () => {
                    subscriber.next(responseDataString);
                    subscriber.complete();
                });
    
            }).on('error', (err) => {
                subscriber.error(err);
            });

            req.on('error', (err) => {
                subscriber.error(err);
            });
              
            req.end();
        });

        return getObservable;
    }

    public post(url: string, data: string, paras?: WpsHttpClientRequestParameters): Observable<string> {
        const postObservable = new Observable<any>(subscriber => {
            const urlObj = new URL(url);
            const host = urlObj.hostname;
            const port = urlObj.port;
            const path = urlObj.pathname;
            const search = urlObj.search;

            const postOptions = {
                host: host,
                port: port,
                path: path + search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(data),
                    ... paras?.headers
                }
            };

            let engine;
            if(urlObj.protocol === 'https') {
                engine = https;
            } else {
                engine = http;
            }

            const req = engine.request(postOptions, (res) => {
                // console.log('statusCode:', res.statusCode);
                // console.log('headers:', res.headers);
              
                let responseDataString = '';
                res.on('data', (chunk) => {
                  responseDataString += chunk;
                });

                res.on('end', () => {
                    subscriber.next(responseDataString);
                    subscriber.complete();
                });
              });
              
              req.on('error', (err) => {
                subscriber.error(err);
              });
              
              req.write(data);
              req.end();
        });

        return postObservable;
    }
}