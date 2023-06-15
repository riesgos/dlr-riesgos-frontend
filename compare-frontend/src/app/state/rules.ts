import { RiesgosState, ScenarioName, Partition, ModalState } from "./state";

export type RuleSetName = 'selectOneScenario' | 'compareScenarios' | 'compareIdentical' | 'compareAdvanced' | 'classic';

export interface Rules {
    partition: boolean,
    mirrorFocus: boolean,
    oneFocusOnly: boolean,
    focusFirstStepImmediately: boolean,
    mirrorData: boolean,
    mirrorClick: { include: string[] } | { exclude: string[] },
    mirrorMove: boolean,
    autoPilot: { include: string[] } | { exclude: string[] },
    allowConfiguration: { include: string[] } | { exclude: string[] },
    modal: (state: RiesgosState, scenarioName: ScenarioName, partition: Partition) => ModalState
}

export function getRules(ruleSet: RuleSetName): Rules {
    let rules: Rules = {
        partition: true,
        mirrorFocus: true,
        oneFocusOnly: true,
        focusFirstStepImmediately: true,
        mirrorData: false,
        mirrorClick: { exclude: ['userChoiceLayer'] },
        mirrorMove: true,
        autoPilot: { exclude: ["selectEq"] },
        allowConfiguration: { exclude: [] },
        modal: (state: RiesgosState, scenarioName: ScenarioName, partition: Partition) =>  ({ visible: false, data: undefined })
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
            rules.modal = (state, scenario, partition) => {
                console.log("evaluating", scenario, partition)
                if (partition === "right") return { visible: true, data: {text: "hidden"} }
                return { visible: false, data: undefined }
            }
            break;
        case 'compareIdentical':
            rules.focusFirstStepImmediately = true;
            rules.mirrorData = true;
            rules.mirrorFocus = false;
            rules.allowConfiguration = { include: ["userChoice"] };
            rules.modal = (state, scenario, partition) => {
                console.log("evaluating", scenario, partition)
                if (partition === "right") return { visible: true, data: {text: "hidden"} }
                return { visible: false, data: undefined }
            }
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