import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as select } from "./2_eqselection/eqselection";
import { step as eqSim } from './3_eqsim/eqsim';
import { step as exposure } from './4_exposure/exposure';
import { step as eqDmg } from './5_eqdamage/eqdamage';
import { step as tsSim } from './6_tssim/tssim';
import { step as tsDmg } from './7_tsdamage/tsdamage';
import { step as sysRel } from './8_sysrel/sysrel';


export const peruCachedFactory = new ScenarioFactory(
    'PeruCached',
    'Peru Scenario Description',
);


peruCachedFactory.registerStep(select);
peruCachedFactory.registerStep(eqSim);
peruCachedFactory.registerStep(exposure);
peruCachedFactory.registerStep(eqDmg);
peruCachedFactory.registerStep(tsSim);
peruCachedFactory.registerStep(tsDmg);
peruCachedFactory.registerStep(sysRel);
