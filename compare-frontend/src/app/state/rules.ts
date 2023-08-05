import { partition } from "rxjs";
import { RiesgosState, ScenarioName, PartitionName, ModalState, StepStateTypes } from "./state";

export type RuleSetName = 'selectOneScenario' | 'compareScenarios' | 'compareIdentical' | 'compareAdvanced' | 'classic';

export interface Rules {
    partition: boolean,
    mirrorStepFocus: (userChoiceMapsLinked: boolean) => boolean,
    mirrorOpacity: (userChoiceMapsLinked: boolean) => boolean,
    mirrorClick: (userChoiceMapsLinked: boolean, compositeId: string) => boolean,
    mirrorMove: (userChoiceMapsLinked: boolean) => boolean,
    mirrorWizard:  boolean,
    oneFocusOnly: boolean,
    focusFirstStepImmediately: boolean,
    mirrorData: boolean,
    allowReset: (partition: PartitionName) => boolean,
    mirrorReset: boolean,
    autoPilot: (stepId: string) => boolean,
    allowConfiguration: (productId: string) => boolean,
    modal: (state: RiesgosState, scenarioName: ScenarioName, partition: PartitionName) => ModalState,
}

export function getRules(ruleSet: RuleSetName | undefined): Rules {
    let rules: Rules = {
        partition: true,
        mirrorStepFocus: (userChoiceMapsLinked) => userChoiceMapsLinked,
        mirrorOpacity: (userChoiceMapsLinked) => userChoiceMapsLinked,
        oneFocusOnly: true,
        focusFirstStepImmediately: true,
        mirrorData: false,
        mirrorClick: (userChoiceMapsLinked: boolean, compositeId: string) => userChoiceMapsLinked && compositeId !== 'userChoiceLayer',
        mirrorMove: userChoiceMapsLinked => userChoiceMapsLinked,
        mirrorWizard: false,
        mirrorReset: false,
        allowReset: partition => true,
        autoPilot: (stepId: string) => stepId !== "selectEq",
        allowConfiguration: () => true,
        modal: (state: RiesgosState, scenarioName: ScenarioName, partition: PartitionName) =>  ({ args: undefined }),
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
                if (partition === "right") {
                    if (!allStepsCompleted(state, scenario, "left")) return { args: { title: "", subtitle: "", body: "willActivateOnceLeftDone", closable: false }};
                }
                if (partition === "middle") {
                    if (allStepsCompleted(state, scenario, "left") && noStepsStarted(state, scenario, "right")) return { args: {title: "startRight", subtitle: "", body: "compareEqWithLeft", closable: true} };
                }
                return { args: undefined };
            }
            break;
        case 'compareIdentical':
            rules.focusFirstStepImmediately = true;
            rules.mirrorData = true;
            rules.mirrorStepFocus = userChoiceMapsLinked => userChoiceMapsLinked;
            rules.mirrorMove = userChoiceMapsLinked => userChoiceMapsLinked;
            rules.mirrorClick = userChoiceMapsLinked => userChoiceMapsLinked;
            rules.mirrorReset = true;
            rules.allowConfiguration = (productId: string) => productId === "userChoice";
            rules.allowReset = partition => partition === 'left';
            rules.modal = (state, scenario, partition) => {
                if (partition === "right") {
                    if (!allStepsCompleted(state, scenario, "left")) return { args: { title: "", subtitle: "", body: "willActivateOnceLeftDone", closable: false }};
                }
                if (partition === "middle") {
                    if (allStepsCompleted(state, scenario, "left")) return { args: {title: "windowAvailable", subtitle: "", body: "compareIdenticalWithLeft", closable: true} };
                }
                return { args: undefined }
            }
            break;
        case 'compareAdvanced':
            rules.mirrorStepFocus = userChoiceMapsLinked => userChoiceMapsLinked;
            rules.mirrorMove = userChoiceMapsLinked => userChoiceMapsLinked;
            rules.mirrorClick = (userChoiceMapsLinked: boolean, compositeId: string) => false;
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


function allStepsCompleted(state: RiesgosState, scenario: ScenarioName, partition: PartitionName) {
    const scenarioData = state.scenarioData[scenario];
    if (!scenarioData) return false;
    const partitionData = scenarioData[partition];
    if (!partitionData) return false;
    const steps = partitionData.steps;
    const states = steps.map(s => s.state.type);
    for (const state of states) {
        if (state !== StepStateTypes.completed) return false;
    }
    return true;
}


function noStepsStarted(state: RiesgosState, scenario: ScenarioName, partition: PartitionName) {
    const scenarioData = state.scenarioData[scenario];
    if (!scenarioData) return true;
    const partitionData = scenarioData[partition];
    if (!partitionData) return true;
    const steps = partitionData.steps;
    const states = steps.map(s => s.state.type);
    for (const state of states) {
        if (state === StepStateTypes.completed || state === StepStateTypes.running) return false;
    }
    return true;
}