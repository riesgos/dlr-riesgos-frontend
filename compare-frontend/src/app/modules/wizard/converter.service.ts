import { Injectable, Inject, InjectionToken } from "@angular/core";
import { RiesgosProductResolved, RiesgosScenarioState, ScenarioName } from "src/app/state/state";
import { WizardComposite } from "./wizard.service";


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
    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite
}

export const converterToken = new InjectionToken<Converter>('WizardConverter');