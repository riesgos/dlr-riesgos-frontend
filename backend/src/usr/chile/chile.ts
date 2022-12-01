import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as eqs } from "./1_eqs/eqs";
import { step as select } from "./2_eqselection/eqselection";
import { step as eqSim } from './3_eqsim/eqsim';
import { step as exposure } from './4_exposure/exposure';
import { step as eqDmg } from './5_eqdamage/eqdamage';
import { step as tsSim } from './6_tssim/tssim';
import { step as tsDmg } from './7_tsdamage/tsdamage';
import { step as sysRel } from './8_sysrel/sysrel';

export const chileFactory = new ScenarioFactory(
    'Chile',
    'Chile Scenario Description',
);

chileFactory.registerStep(eqs);
chileFactory.registerStep(select);
chileFactory.registerStep(eqSim);
chileFactory.registerStep(exposure);
chileFactory.registerStep(eqDmg);
chileFactory.registerStep(tsSim);
chileFactory.registerStep(tsDmg);
chileFactory.registerStep(sysRel);
