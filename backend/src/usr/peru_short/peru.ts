import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as select } from "./2_eqselection/eqselection";
import { step as eqSim } from './3_eqsim/eqsim';
import { step as exposure } from './4_exposure/exposure';
import { step as eqDmg } from './5_eqdamage/eqdamage';
import { step as tsSim } from './6_tssim/tssim';
import { step as tsDmg } from './7_tsdamage/tsdamage';
import { step as sysRel } from './8_sysrel/sysrel';

export const peruShortFactory = new ScenarioFactory(
    'PeruShort',
    'Peru Scenario Description',
);

peruShortFactory.registerStep(select);
peruShortFactory.registerStep(eqSim);
peruShortFactory.registerStep(exposure);
peruShortFactory.registerStep(eqDmg);
peruShortFactory.registerStep(tsSim);
peruShortFactory.registerStep(tsDmg);
peruShortFactory.registerStep(sysRel);
