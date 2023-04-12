import { Inject, Injectable, InjectionToken, Type } from "@angular/core";
import Layer from "ol/layer/Layer";
import { Observable, of } from "rxjs";
import { RiesgosProductResolved, RiesgosScenarioState, ScenarioName, StepStateTypes } from "src/app/state/state";


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
    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]>
}

export const converterToken = new InjectionToken<Converter>('Converter');


export interface LayerComposite {
    layer: Layer
    // legend: { component: Type<any>, args: {[key: string]: any} }
    // info: { component: Type<any>, args: {[key: string]: any} }
    popup: (location: number[]) => { component: Type<any>, args: {[key: string]: any} } | undefined
    onClick: (location: number[]) => void
    onHover: (location: number[]) => void
    visible: boolean
}

export class DefaultConverter implements Converter {
    public applies(scenario: ScenarioName, step: string): boolean {
        return true;
    }

    public makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        return of([]);
    }

    private getStepOutputs(stepId: string, state: RiesgosScenarioState, data: RiesgosProductResolved[]): RiesgosProductResolved[] | undefined {
        const step = state.steps.find(s => s.step.id === stepId);
        if (!step) return undefined;
        if (step.state.type !== StepStateTypes.completed) return undefined;

        const outputIds = step.step.outputs.map(o => o.id);
        const products = data.filter(d => outputIds.includes(d.id));
        return products;
    }

}