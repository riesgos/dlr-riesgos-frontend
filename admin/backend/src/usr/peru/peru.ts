import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as eqs } from "./1_eqs/eqs";
import { step as select } from "./2_eqselection/eqselection";
import { step as eqSim } from './3_eqsim/eqsim';

export const peruFactory = new ScenarioFactory(
    'Peru',
    'Peru Scenario Description',
);

peruFactory.registerStep(eqs);
peruFactory.registerStep(select);
peruFactory.registerStep(eqSim);
