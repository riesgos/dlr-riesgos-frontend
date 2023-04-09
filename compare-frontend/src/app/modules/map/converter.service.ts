import { Inject, Injectable, InjectionToken, Injector, Type } from "@angular/core";
import Layer from "ol/layer/Layer";
import { Observable, of } from "rxjs";
import { ScenarioName } from "src/app/state/state";


@Injectable()
export class ConverterService {


    constructor(
        @Inject(converterToken) private converters: Converter[]
    ) {}

    public getConverter(scenario: ScenarioName, step: string): Converter {
        for (const converter of this.converters) {
            if (converter.applies(scenario, step)) {
                return converter;
            }
        }
        throw Error(`No applicable map-converter for ${scenario}/${step}`);
    }
}


export interface Converter {
    applies(scenario: ScenarioName, step: string): boolean
    makeLayers(): Observable<MapLayer[]>
}

export const converterToken = new InjectionToken<Converter>('Converter');


export interface MapLayer {
    getLayer(): Layer
    getLegend(): { component: Type<any>, args: {[key: string]: any} }
    getInfo(): { component: Type<any>, args: {[key: string]: any} }
    getPopup(): { component: Type<any>, args: {[key: string]: any} }
    onClick(location: number[]): void
    onHover(location: number[]): void
    getVisibility(): boolean
    setVisibility(visible: boolean): void
}

export class DefaultConverter implements Converter {
    public applies(scenario: ScenarioName, step: string): boolean {
        return true;
    }

    public makeLayers(): Observable<MapLayer[]> {
        return of([]);
    }

}