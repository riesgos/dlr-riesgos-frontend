import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as eqs } from "./1_eqs/eqs";

export const peruFactory = new ScenarioFactory(
    'Peru',
    'Peru Scenario Description',
);

peruFactory.registerStep(eqs);
