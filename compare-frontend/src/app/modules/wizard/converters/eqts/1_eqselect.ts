import { ScenarioName } from "src/app/state/state";
import { Converter } from "../../converter.service";


export class EqSelection implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        throw new Error("Method not implemented.");
    }
    getInfo() {
        throw new Error("Method not implemented.");
    }

}