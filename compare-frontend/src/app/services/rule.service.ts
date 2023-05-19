import { Injectable } from "@angular/core";
import { Rules } from "../state/state";


export type RuleSetName = 'selectOneScenario' | 'compareScenario' | 'compareIdentical' | 'compareAdvanced' | 'classic';

@Injectable({
    providedIn: 'root'
})
export class RuleService {

    public getRules(ruleSet: RuleSetName): Rules {
        let rules: Rules = {
            partition: true,
            mirrorFocus: true,
            oneFocusOnly: true,
            focusFirstStepImmediately: true,
            mirrorData: false,
            mirrorClick: { exclude: ['userChoiceLayer'] },
            mirrorMove: true,
            autoPilot: true
        };

        // This could become arbitrarily complicated. 
        // Might want to use an inference-engine.
        switch (ruleSet) {
            case 'selectOneScenario':
                rules.oneFocusOnly = false;
                rules.focusFirstStepImmediately = true;
                rules.partition = false;
                rules.autoPilot = true;
                break;
            case 'compareScenario':
                break;
            case 'compareIdentical':
                rules.oneFocusOnly = false;
                rules.focusFirstStepImmediately = true;
                rules.mirrorData = true;
                rules.mirrorFocus = false;
                break;
            case 'compareAdvanced':
                rules.mirrorFocus = false;
                rules.mirrorMove = false;
                rules.mirrorClick = false;
                rules.autoPilot = false;
                break;
            case 'classic':
                rules.partition = false;
                rules.oneFocusOnly = false;
                rules.autoPilot = false;
                break;
        }

        return rules;
    }
}