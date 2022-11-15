import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { delay, empty, filter, map, Observable, repeat, take, timer, zip } from 'rxjs';
import { AppConfig, APP_CONFIG } from '../app.module';
import { ScenarioState } from '../riesgos/riesgos.reducer';
import * as RiesgosActions from '../riesgos/riesgos.actions';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private http: HttpClient, 
    @Inject(APP_CONFIG) private appConfig: AppConfig) { }


  getScenarios(): Observable<{
    chile: ScenarioState,
    peru: ScenarioState,
    ecuador: ScenarioState
  }> {
    const url = this.appConfig.backendUrl;

    const scenarioPeru$ = this.http.get(`${url}/scenarios/Peru`);
    const scenarioChile$ = this.http.get(`${url}/scenarios/Chile`);
    const scenarioEcuador$ = this.http.get(`${url}/scenarios/Ecuador`);

    return zip([scenarioChile$, scenarioEcuador$, scenarioPeru$]).pipe(
      map(([scenarioChile, scenarioEcuador, scenarioPeru]) => {
        return {
          chile: scenarioChile as ScenarioState,
          peru: scenarioPeru as ScenarioState,
          ecuador: scenarioEcuador as ScenarioState
        }
      })
    );
  }

  execute(scenario: string, step: string, state: ScenarioState): Observable<ScenarioState> {
    const url = this.appConfig.backendUrl;

    const query$ = this.http.post(`${url}/scenarios/${scenario}/steps/${step}/execute`, state);

    return query$.pipe(
      repeat({ delay: 1000 }),
      filter((data: any) => 'results' in data),
      take(1)
    );
  }

}



// rxjs combinations: https://indepth.dev/posts/1114/learn-to-combine-rxjs-sequences-with-super-intuitive-interactive-diagrams
// rxjs generators: 