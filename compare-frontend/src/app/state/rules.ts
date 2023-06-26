import { RiesgosState, ScenarioName, Partition, ModalState } from "./state";

export type RuleSetName = 'selectOneScenario' | 'compareScenarios' | 'compareIdentical' | 'compareAdvanced' | 'classic';

export interface Rules {
    partition: boolean,
    mirrorFocus: boolean,
    oneFocusOnly: boolean,
    focusFirstStepImmediately: boolean,
    mirrorData: boolean,
    mirrorClick: (compositeId: string) => boolean,
    mirrorMove: boolean,
    autoPilot: (stepId: string) => boolean,
    allowConfiguration: (productId: string) => boolean,
    modal: (state: RiesgosState, scenarioName: ScenarioName, partition: Partition) => ModalState
}

export function getRules(ruleSet: RuleSetName | undefined): Rules {
    let rules: Rules = {
        partition: true,
        mirrorFocus: true,
        oneFocusOnly: true,
        focusFirstStepImmediately: true,
        mirrorData: false,
        mirrorClick: (compositeId: string) => compositeId !== 'userChoiceLayer',
        mirrorMove: true,
        autoPilot: (stepId: string) => stepId !== "selectEq",
        allowConfiguration: () => true,
        modal: (state: RiesgosState, scenarioName: ScenarioName, partition: Partition) =>  ({ visible: false, data: undefined })
    };

    // This could become arbitrarily complicated. 
    // Might want to use an inference-engine.
    switch (ruleSet) {
        case 'selectOneScenario':
            rules.focusFirstStepImmediately = true;
            rules.partition = false;
            rules.allowConfiguration = (productId: string) => productId === "userChoice";
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
            rules.allowConfiguration = (productId: string) => productId === "userChoice";
            rules.modal = (state, scenario, partition) => {
                console.log("evaluating", scenario, partition)
                if (partition === "right") return { visible: true, data: {text: "hidden"} }
                return { visible: false, data: undefined }
            }
            break;
        case 'compareAdvanced':
            rules.mirrorFocus = false;
            rules.mirrorMove = false;
            rules.mirrorClick = (compositeId: string) => false;
            rules.autoPilot = () => false;
            break;
        case 'classic':
            rules.partition = false;
            rules.oneFocusOnly = false;
            rules.autoPilot = () => false;
            break;
    }

    return rules;
}