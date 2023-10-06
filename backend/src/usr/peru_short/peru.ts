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


export const peruShortFactory = new ScenarioFactory(
    'PeruShort',
    'Peru Scenario Description',
);

peruShortFactory.registerCondition(async () => {
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

peruShortFactory.registerStep(select);
peruShortFactory.registerStep(eqSim);
peruShortFactory.registerStep(exposure);
peruShortFactory.registerStep(eqDmg);
peruShortFactory.registerStep(tsSim);
peruShortFactory.registerStep(tsDmg);
peruShortFactory.registerStep(sysRel);
