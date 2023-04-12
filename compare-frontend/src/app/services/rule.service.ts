import { Injectable } from "@angular/core";
import { Rules } from "../state/state";


export type RuleSetName = 'selectOneScenario' | 'compareScenario' | 'compareIdentical' | 'compareAdvanced';

@Injectable({
    providedIn: 'root'
})
export class RuleService {

    public getRules(ruleSet: RuleSetName): Rules {
        let rules: Rules = {
            partition: true,
            mirrorFocus: true,
            mirrorData: false,
            mirrorClick: true,
            mirrorMove: true,
            autoPilot: true
        };

        // This could become arbitrarily complicated. 
        // Might want to use an inference-engine.
        switch (ruleSet) {
            case 'selectOneScenario':
                rules.partition = false;
                rules.autoPilot = false;
                break;
            case 'compareScenario':
                break;
            case 'compareIdentical':
                rules.mirrorData = true;
                rules.mirrorFocus = false;
                break;
            case 'compareAdvanced':
                rules.mirrorFocus = false;
                rules.mirrorMove = false;
                rules.mirrorClick = false;
                rules.autoPilot = false;
                break;
        }

        return rules;
    }
}