import { Injectable } from "@angular/core";
import { Converter, MapLayer } from "../../converter.service";
import { Observable, of } from "rxjs";
import { ScenarioName } from "src/app/state/state";

@Injectable()
export class EqSelection implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return false;
    }
    makeLayers(): Observable<MapLayer[]> {
        return of([]);
    }

}