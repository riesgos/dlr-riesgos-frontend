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


export class DefaultConverter implements Converter {
    private step: string = "";

    applies(scenario: ScenarioName, step: string): boolean {
        console.warn(`Wizard module: couln't find a converter for ${scenario}/${step}. Falling back to default-converter.`);
        // Sneaky hack: setting step so when a call to `getInfo` comes next, we know what data to fetch.
        this.step = step;
        return true;
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === this.step)!;
        const inputs = step.step.inputs;

        const inputOptions: WizardComposite["inputs"] = [];
        for (const input of inputs) {
            const inputValue = data.find(d => d.id === input.id);
            inputOptions.push({
                productId: input.id,
                label: input.id,
                formtype: input.options ? 'string-select' : 'string',
                currentValue: inputValue,
                options: input.options
            });
        }

        return {
            hasFocus: false,
            step: step,
            inputs: inputOptions,
        }
    }

}