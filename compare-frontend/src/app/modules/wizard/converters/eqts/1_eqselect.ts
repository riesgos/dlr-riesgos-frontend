import { RiesgosProductResolved, RiesgosScenarioState, ScenarioName } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";


export class EqSelection implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        throw new Error("Method not implemented.");
    }
    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        throw new Error("Method not implemented.");
    }
}