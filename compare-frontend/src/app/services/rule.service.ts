import { Injectable } from "@angular/core";
import { Rules } from "../state/state";


export type RuleSetName = 'selectOneScenario' | 'compareScenarios' | 'compareIdentical' | 'compareAdvanced' | 'classic';

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
            autoPilot: { exclude: ["selectEq"] },
            allowConfiguration: { exclude: [] }
        };

        // This could become arbitrarily complicated. 
        // Might want to use an inference-engine.
        switch (ruleSet) {
            case 'selectOneScenario':
                rules.focusFirstStepImmediately = true;
                rules.partition = false;
                rules.allowConfiguration = { include: ["userChoice"] };
                break;
            case 'compareScenarios':
                break;
            case 'compareIdentical':
                rules.focusFirstStepImmediately = true;
                rules.mirrorData = true;
                rules.mirrorFocus = false;
                rules.allowConfiguration = { include: ["userChoice"] };
                break;
            case 'compareAdvanced':
                rules.mirrorFocus = false;
                rules.mirrorMove = false;
                rules.mirrorClick = { include: [] };
                rules.autoPilot = { include: [] };
                break;
            case 'classic':
                rules.partition = false;
                rules.oneFocusOnly = false;
                rules.autoPilot = { include: [] };
                break;
        }

        return rules;
    }
}