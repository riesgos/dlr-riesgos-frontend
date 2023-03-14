import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { combineLatest, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { ScenarioName } from "../state/state";
import { ConfigService } from "./config.service";
import { pollUntil } from "./polling";

export interface API_DatumDescription {
    id: string
    options?: string[],
    default?: string
};

export interface API_Datum {
    id: string,
    value: any
};

export interface API_DatumReference {
    id: string,
    reference: string
}

export function isApiDatum(x: (API_Datum | API_DatumReference)):  x is API_Datum {
    return 'value' in x;
}

export function isApiDatumReference(x: (API_Datum | API_DatumReference)):  x is API_DatumReference {
    return 'reference' in x;
}

export interface API_Step {
    id: string,
    title: string,
    description: string, 
    inputs: API_DatumDescription[],
    outputs: API_DatumDescription[]
}

export interface API_ScenarioInfo {
    id: ScenarioName,
    description: string,
    steps: API_Step[]
}

export interface API_ScenarioState {
    data: (API_Datum | API_DatumReference)[]
}

@Injectable({
    providedIn: 'root'
})
export class BackendService {

    constructor(
        private configService: ConfigService,
        private http: HttpClient
    ) {}

    loadScenarios(): Observable<API_ScenarioInfo[]> {

        const allowedScenarios = this.configService.getConfig().allowedScenarios;
        
        const url = this.configService.getConfig().backendUrl;
        const get$ = this.http.get<{id: string, description: string}[]>(`${url}/scenarios`);

        return get$.pipe(
            switchMap(scenarioInfos => {
                const followUpRequests$: Observable<API_ScenarioInfo>[] = [];
                for (const scenarioInfo of scenarioInfos) {
                    if (allowedScenarios.length === 0 || allowedScenarios.includes(scenarioInfo.id)) {
                        const request$ = this.http.get<API_ScenarioInfo>(`${url}/scenarios/${scenarioInfo.id}`);
                        followUpRequests$.push(request$);
                    }
                }
                return combineLatest(followUpRequests$);
            })
        );
    }

    execute(scenarioId: string, stepId: string, state: API_ScenarioState): Observable<API_ScenarioState> {
        const url = this.configService.getConfig().backendUrl;
        const post$ = this.http.post<{ ticket: string }>(
            `${url}/scenarios/${scenarioId}/steps/${stepId}/execute`,
            state,
            { headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }}
        );

        return post$.pipe(
            switchMap(responseData => {
                const task$ = this.http.get<{ ticket?: string, results?: API_ScenarioState, error?: any }>(`${url}/scenarios/${scenarioId}/steps/${stepId}/execute/poll/${responseData.ticket}`);
                return pollUntil(task$, r => !!r.results || !!r.error);
            }),
            map(response => {
                if (response.error) {
                    throw {
                        error: response.error,
                        scenarioId: scenarioId,
                        stepId: stepId,
                        state: state
                    };
                }
                return response.results!;
            })
        )
    }

    async asyncLoadScenarios(): Promise<API_ScenarioInfo[]> {
        const url = this.configService.getConfig().backendUrl;

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

    async asyncExecute(scenarioId: string, stepId: string, state: API_ScenarioState): Promise<API_ScenarioState> {
        const url = this.configService.getConfig().backendUrl;

        const response = await fetch(`${url}/scenarios/${scenarioId}/steps/${stepId}/execute`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(state)
        });
        let responseData = await response.json();

        while (responseData.ticket) {
            const pollResponse = await fetch(`${url}/scenarios/${scenarioId}/steps/${stepId}/execute/poll/${responseData.ticket}`);
            responseData = await pollResponse.json();
        }

        if (responseData.error) {
            throw {
                error: responseData.error,
                scenarioId: scenarioId,
                stepId: stepId,
                state: state
            };
        }
        
        return responseData.results;
    }
    
}