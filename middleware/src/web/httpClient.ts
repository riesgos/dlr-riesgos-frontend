import * as https from 'https';
import * as http from 'http';
import axios from 'axios';
import { URL } from 'url';


export interface RequestParameters {
    headers: {[key: string]: string}
}

export interface IHttpClient {
    get(url: string, paras?: RequestParameters): Promise<string>;
    post(url: string, data: string, paras?: RequestParameters): Promise<string>;
}

export class HttpClient implements IHttpClient {
    public get(url: string, paras?: RequestParameters): Promise<string> {
        console.log(`GET ${url}`);


        const getPromise = new Promise<string>((resolve, reject) => {
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

            const req = engine.request(getOptions, async (resp) => {
                if (resp.statusCode == 302 && resp.headers.location) {
                    const newLocation: string = resp.headers.location;
                    console.log(`Redirect from ${url} to ${newLocation}`)
                    const result = await this.get(newLocation, paras);
                    resolve(result);
                    return;
                }


                let responseDataString = '';
    
                // A chunk of data has been received.
                resp.on('data', (chunk) => {
                    responseDataString += chunk;
                });
    
                // The whole response has been received.
                resp.on('end', () => {
                    resolve(responseDataString);
                });
    
            }).on('error', (err) => {
                reject(err);
            });

            req.on('error', (err) => {
                reject(err);
            });
              
            req.end();
        });

        return getPromise;
    }

    public post(url: string, data: string, paras?: RequestParameters): Promise<string> {
        console.log(`POST ${url}`);

        const postPromise = new Promise<string>((resolve, reject) => {
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

            const req = engine.request(postOptions, async (res) => {
                if (res.statusCode == 302 && res.headers.location) {
                    const newLocation: string = res.headers.location;
                    console.log(`Redirect from ${url} to ${newLocation}`)
                    const result = await this.post(newLocation, data, paras);
                    resolve(result);
                    return;
                }
              
                let responseDataString = '';
                res.on('data', (chunk) => {
                  responseDataString += chunk;
                });

                res.on('end', () => {
                    resolve(responseDataString);
                });
              });
              
              req.on('error', (err) => {
                reject(err);
              });
              
              req.write(data);
              req.end();
        });

        return postPromise;
    }
}


export class AxiosClient implements IHttpClient {
    async get(url: string, paras?: RequestParameters): Promise<any> {
        console.log(`GET ${url}`);
        const response = await axios.get(url, {
            ... paras
        });
        return response.data;
    }
    async post(url: string, data: string, paras?: RequestParameters): Promise<any> {
        console.log(`POST ${url}`);
        const response = await axios.post(url, data, paras);
        return response.data;
    }

}

