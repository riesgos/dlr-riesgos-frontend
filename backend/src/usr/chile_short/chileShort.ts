import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as select } from "./2_eqselection/eqselection";
import { step as eqSim } from './3_eqsim/eqsim';
import { step as exposure } from './4_exposure/exposure';
import { step as eqDmg } from './5_eqdamage/eqdamage';
import { step as tsSim } from './6_tssim/tssim';
import { step as tsDmg } from './7_tsdamage/tsdamage';
import { step as sysRel } from './8_sysrel/sysrel';
import config from "../../config.json";
import axios from "axios";


export const chileShortFactory = new ScenarioFactory(
    'ChileShort',
    'Chile Scenario Description',
);

chileShortFactory.registerCondition(async () => {
    for (const [key, val] of Object.entries(config.services)) {
        //@ts-ignore
        const url = val.url;
        //@ts-ignore
        const procId = val.id;
        const request = `${url}?service=WPS&request=DescribeProcess&identifier=${procId}&version=2.0.0`;
        try {
            if (url && procId) {
                const response = await axios.get(request);
            }
        } catch (error) {
            return `Error in attempting to access ${url} for process ${key} (id=${procId}): ${error}`;
        }
    }
    return true;
});

chileShortFactory.registerStep(select);
chileShortFactory.registerStep(eqSim);
chileShortFactory.registerStep(exposure);
chileShortFactory.registerStep(eqDmg);
chileShortFactory.registerStep(tsSim);
chileShortFactory.registerStep(tsDmg);
chileShortFactory.registerStep(sysRel);
