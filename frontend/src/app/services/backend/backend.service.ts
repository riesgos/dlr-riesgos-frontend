import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { combineLatest, from, Observable, pipe } from "rxjs";
import { delay, filter, map, repeat, repeatWhen, switchMap, take } from "rxjs/operators";
import { ConfigService } from "../configService/configService";
import { pollUntil } from "./polling";

export interface DatumDescription {
    id: string
};

export interface UserSelection extends DatumDescription {
    options: string[]
}


export interface Datum {
    id: string,
    value: any
};

export interface DatumReference {
    id: string,
    reference: string
}

export interface Step {
    id: string,
    title: string,
    description: string, 
    inputs: DatumDescription[],
    outputs: DatumDescription[]
}

export interface Scenario {
    id: string,
    description: string,
    steps: Step[]
}

export interface ScenarioState {
    data: (Datum | DatumReference)[]
}

@Injectable()
export class BackendService {

    constructor(
        private configService: ConfigService,
        private http: HttpClient
    ) {}

    loadScenarios(): Observable<Scenario[]> {
        
        const url = this.configService.getConfig().middlewareUrl;
        const get$ = this.http.get<{id: string, description: string}[]>(`${url}/scenarios`);

        return get$.pipe(
            switchMap(scenarioInfos => {
                const followUpRequests$: Observable<Scenario>[] = [];
                for (const scenarioInfo of scenarioInfos) {
                    const request$ = this.http.get<Scenario>(`${url}/scenarios/${scenarioInfo.id}`);
                    followUpRequests$.push(request$);
                }
                return combineLatest(followUpRequests$);
            })
        );
    }

    execute(scenarioId: string, stepId: string, state: ScenarioState): Observable<ScenarioState> {

        const url = this.configService.getConfig().middlewareUrl;
        const post$ = this.http.post<{ ticket: string }>(`${url}/scenarios/${scenarioId}/steps/${stepId}/execute`, state);

        return post$.pipe(
            switchMap(responseData => {
                const task$ = this.http.get<{ ticket?: string, result?: ScenarioState }>(`${url}/scenarios/${scenarioId}/steps/${stepId}/execute/poll/${responseData.ticket}`);
                return pollUntil(task$, r => r.result);
            }),
            map(response => response.result)
        )
    }

    async asyncLoadScenarios(): Promise<Scenario[]> {
        const url = this.configService.getConfig().middlewareUrl;

        const response = await fetch(`${url}/scenarios`);
        const responseData = await response.json();

        const followUpRequests$ = [];
        for (const entry of responseData) {
            const followUp$ = fetch(`${url}/scenarios/${entry.id}`);
            followUpRequests$.push(followUp$);
        }

        const results = await Promise.all(followUpRequests$);
        const resultData = await Promise.all(results.map(r => r.json()));

        return resultData;
    }

    async asyncExecute(scenarioId: string, stepId: string, state: ScenarioState): Promise<ScenarioState> {
        const url = this.configService.getConfig().middlewareUrl;

        const response = await fetch(`${url}/scenarios/${scenarioId}/steps/${stepId}/execute`, {
            method: 'POST',
            body: JSON.stringify(state)
        });
        let responseData = await response.json();

        while (responseData.ticket) {
            const pollResponse = await fetch(`${url}/scenarios/${scenarioId}/steps/${stepId}/execute/poll/${responseData.ticket}`);
            responseData = await pollResponse.json();
        }
        
        return responseData.result;
    }
    
}