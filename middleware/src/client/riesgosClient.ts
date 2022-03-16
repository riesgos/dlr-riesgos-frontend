import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "../http_client/http_client";
import { Call, RiesgosProcess, RiesgosProduct,
    RiesgosScenarioData, RiesgosScenarioMetaData } from "../model/datatypes/riesgos.datatypes";
import WebSocket from 'ws';


/**
 * A client that calls server/server's API.
 * May be used by any frontend to abstract away concrete calls to the server.
 * (Mostly so that user doesn't have to make REST- and WS-calls himself)
 */
export class RiesgosClient {
    constructor(
        private url: string,
        private http: HttpClient) {}

    getScenarios(): Observable<RiesgosScenarioMetaData[]> {
        return this.http.get(this.url + '/getScenarioMetaData').pipe(
            map((result: string) => JSON.parse(result))
        );
    }

    getScenario(id: string): Observable<RiesgosScenarioData> {
        return this.http.get(this.url + '/getScenarioData/' + id).pipe(
            map((result: string) => JSON.parse(result))
        );
    }

    executeCall(call: Call, scenario: RiesgosScenarioData): Observable<RiesgosScenarioData> {

        const process = scenario.processes.find(p => p.uid === call.process) as RiesgosProcess;

        // Checking that inputs are present.
        const inputs = call.inputs.map(i => {
            const existingEntry = scenario.products.find(prod => prod.uid === i.product);
            if (!existingEntry) throw new Error(`Could not find existing data for ${i.product}`);
            if (!existingEntry.value) throw new Error(`No value given for entry ${i.product}`);
            return existingEntry;
        });

        // Checking that outputs are present.
        const outputs = call.outputs.map(o => {
            const existingEntry = scenario.products.find(prod => prod.uid === o.product);
            if (!existingEntry) throw new Error(`Could not find existing data for ${o.product}`);
            return existingEntry;
        });

        const products = Array.prototype.concat(inputs, outputs);

        // Executing.
        const data$ = new Observable<{[slot: string]: RiesgosProduct}>((listener) => {
            const client = new WebSocket('ws://' + this.url + '/executeProcess');
            client.on('open', () => {
                client.send(JSON.stringify({process, products, call}));
            });
            client.on('message', (data) => {
                const parsed = JSON.parse(data.toString()) as {[slot: string]: RiesgosProduct};
                listener.next(parsed);
                listener.complete();
            });
        });

        return data$.pipe(map((results: {[slot: string]: RiesgosProduct}) => {
            const resultsArray = Object.values(results);
            for (const result of resultsArray) {
                const original = scenario.products.find(p => p.uid === result.uid);
                if (original) {
                    original.value = result.value;
                }
            }
            return scenario;
        }));

    }
}


