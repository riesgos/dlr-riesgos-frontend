import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as eqs } from "./1_eqs/eqs";
import { step as select } from "./2_eqselection/eqselection";
import { step as eqSim } from './3_eqsim/eqsim';
import { step as exposure } from './4_exposure/exposure';
import { step as eqDmg } from './5_eqdamage/eqdamage';
import { step as tsSim } from './6_tssim/tssim';

export const peruFactory = new ScenarioFactory(
    'Peru',
    'Peru Scenario Description',
);

peruFactory.registerStep(eqs);
peruFactory.registerStep(select);
peruFactory.registerStep(eqSim);
peruFactory.registerStep(exposure);
peruFactory.registerStep(eqDmg);
peruFactory.registerStep(tsSim);
