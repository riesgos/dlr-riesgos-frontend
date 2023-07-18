import { RiesgosState, ScenarioName, PartitionName, ModalState, StepStateTypes } from "./state";

export type RuleSetName = 'selectOneScenario' | 'compareScenarios' | 'compareIdentical' | 'compareAdvanced' | 'classic';

export interface Rules {
    partition: boolean,
    mirrorFocus: boolean,
    mirrorOpacity: boolean,
    oneFocusOnly: boolean,
    focusFirstStepImmediately: boolean,
    mirrorData: boolean,
    mirrorClick: boolean,
    mirrorMove: boolean,
    autoPilot: (stepId: string) => boolean,
    allowConfiguration: (productId: string) => boolean,
    modal: (state: RiesgosState, scenarioName: ScenarioName, partition: PartitionName) => ModalState
}

export function getRules(ruleSet: RuleSetName | undefined): Rules {
    let rules: Rules = {
        partition: true,
        mirrorFocus: true,
        mirrorOpacity: true,
        oneFocusOnly: true,
        focusFirstStepImmediately: true,
        mirrorData: false,
        mirrorClick: true,
        mirrorMove: true,
        autoPilot: (stepId: string) => stepId !== "selectEq",
        allowConfiguration: () => true,
        modal: (state: RiesgosState, scenarioName: ScenarioName, partition: PartitionName) =>  ({ args: undefined })
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
                    if (!allStepsCompleted(state, scenario, "left")) return { args: { title: "awaitingCompletion", subtitle: "", body: "willActivateOnceLeftDone", closable: false }};
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
            rules.mirrorFocus = false;
            rules.allowConfiguration = (productId: string) => productId === "userChoice";
            rules.modal = (state, scenario, partition) => {
                if (partition === "right") {
                    if (!allStepsCompleted(state, scenario, "left")) return { args: { title: "awaitingCompletion", subtitle: "", body: "willActivateOnceLeftDone", closable: false }};
                }
                if (partition === "middle") {
                    if (allStepsCompleted(state, scenario, "left")) return { args: {title: "windowAvailable", subtitle: "", body: "compareIdenticalWithLeft", closable: true} };
                }
                return { args: undefined }
            }
            break;
        case 'compareAdvanced':
            rules.mirrorFocus = false;
            rules.mirrorMove = false;
            rules.mirrorClick = false;
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
    const steps = partitionData.controls;
    const states = steps.map(s => s.state);
    for (const state of states) {
        if (state !== 'completed') return false;
    }
    return true;
}


function noStepsStarted(state: RiesgosState, scenario: ScenarioName, partition: PartitionName) {
    const scenarioData = state.scenarioData[scenario];
    if (!scenarioData) return true;
    const partitionData = scenarioData[partition];
    if (!partitionData) return true;
    const steps = partitionData.controls;
    const states = steps.map(s => s.state);
    for (const state of states) {
        if (state === 'completed' || state === 'running') return false;
    }
    return true;
}