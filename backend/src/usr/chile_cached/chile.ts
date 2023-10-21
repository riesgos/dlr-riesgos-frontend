import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as select } from "./2_eqselection/eqselection";
import { step as eqSim } from './3_eqsim/eqsim';
import { step as exposure } from './4_exposure/exposure';
import { step as eqDmg } from './5_eqdamage/eqdamage';
import { step as tsSim } from './6_tssim/tssim';
import { step as tsDmg } from './7_tsdamage/tsdamage';
import { step as sysRel } from './8_sysrel/sysrel';


export const chileCachedFactory = new ScenarioFactory(
    'ChileCached',
    'Chile Scenario Description',
);


chileCachedFactory.registerStep(select);
chileCachedFactory.registerStep(eqSim);
chileCachedFactory.registerStep(exposure);
chileCachedFactory.registerStep(eqDmg);
chileCachedFactory.registerStep(tsSim);
chileCachedFactory.registerStep(tsDmg);
chileCachedFactory.registerStep(sysRel);
