import { RiesgosState, ScenarioName, PartitionName, ModalState, StepStateTypes } from "./state";

export type RuleSetName = 'selectOneScenario' | 'compareScenarios' | 'compareIdentical' | 'compareAdvanced' | 'classic';

let fullRunCompletedBefore = false;


export interface Rules {
    partition: boolean,
    mirrorStepFocus: (userChoiceMapsLinked: boolean | undefined) => boolean,
    mirrorOpacity: (userChoiceMapsLinked: boolean | undefined) => boolean,
    mirrorClick: (userChoiceMapsLinked: boolean | undefined, compositeId: string) => boolean,
    mirrorMove: (userChoiceMapsLinked: boolean | undefined) => boolean,
    mirrorWizard:  boolean,
    oneFocusOnly: boolean,
    focusFirstStepImmediately: boolean,
    mirrorData: boolean,
    mirrorReset: boolean,
    autoPilot: (stepId: string) => boolean,
    allowReset: (partition: PartitionName) => boolean,
    allowViewLinkToggling: boolean,
    allowConfiguration: (productId: string) => boolean,
    modal: (state: RiesgosState, scenarioName: ScenarioName, partition: PartitionName) => ModalState['args'],
    productDefault: (scenarioId: ScenarioName, productId: string) => any | undefined,
}

export function getRules(ruleSet: RuleSetName | undefined): Rules {
    let rules: Rules = {
        partition: true,
        mirrorStepFocus: (userChoiceMapsLinked) => userChoiceMapsLinked === undefined ? true : userChoiceMapsLinked,
        mirrorOpacity: (userChoiceMapsLinked) => userChoiceMapsLinked === undefined ? true : userChoiceMapsLinked,
        oneFocusOnly: true,
        focusFirstStepImmediately: true,
        mirrorData: false,
        mirrorClick: (userChoiceMapsLinked: boolean | undefined, compositeId: string) => userChoiceMapsLinked === true && compositeId !== 'userChoiceLayer',
        mirrorMove: userChoiceMapsLinked => userChoiceMapsLinked === undefined ? true : userChoiceMapsLinked,
        mirrorWizard: false,
        mirrorReset: false,
        allowReset: partition => true,
        allowViewLinkToggling: true,
        allowConfiguration: () => true,
        autoPilot: (stepId: string) => stepId !== "selectEq" && stepId !== "selectEqChile",
        modal: (state: RiesgosState, scenarioName: ScenarioName, partition: PartitionName) =>  undefined,
        productDefault: (scenarioId: ScenarioName, productId: string) => {
            if (scenarioId.includes("Peru") || scenarioId.includes("Chile")) {
                if (productId === "schemaTs" || productId === "schemaTsChile") {
                    return "Medina_2019";
                }
                if (productId === "exposureModelName") {
                    return "LimaBlocks";
                }
                if (productId === "exposureModelNameChile") {
                    return "ValpOBM23Region";
                }
            }
            return undefined;
        }
    };

    // This could become arbitrarily complicated. 
    // Might want to use an inference-engine.
    switch (ruleSet) {
        case 'selectOneScenario':
            rules.focusFirstStepImmediately = true;
            rules.partition = false;
            rules.allowConfiguration = (productId: string) => productId === "userChoice" || productId === "userChoiceChile";
            rules.modal = (state, scenario, partition) => {
                if (partition === "left") {
                    const result = showColorExplanationModal(state, scenario, partition);
                    if (result) return result;
                }
                return undefined;
            }
            break;
        case 'compareScenarios':
            rules.modal = (state, scenario, partition) => {
                if (partition === "left") {
                    const result = showColorExplanationModal(state, scenario, partition);
                    if (result) return result;
                }
                if (partition === "right") {
                    if (!allStepsCompleted(state, scenario, "left")) return {id: "willActivateOnceLeftDone", title: "", subtitle: "", body: "willActivateOnceLeftDone", closable: false, dontShowAgainAble: false };
                }
                if (partition === "middle") {
                    if (allStepsCompleted(state, scenario, "left") && noStepsStarted(state, scenario, "right")) return {id: "compareEqWithLeft", title: "startRight", subtitle: "", body: "compareEqWithLeft", closable: true, dontShowAgainAble: false };
                }
                return undefined;
            }
            rules.mirrorClick = (userChoiceLinkMapViews, compositeId) => compositeId !== 'userChoiceLayer';
            rules.mirrorMove = () => true;
            rules.mirrorStepFocus = () => true;
            rules.allowViewLinkToggling = false;
            break;
        case 'compareIdentical':
            rules.focusFirstStepImmediately = true;
            rules.mirrorData = true;
            rules.mirrorStepFocus = () => false;
            rules.mirrorMove = userChoiceMapsLinked => userChoiceMapsLinked === undefined ? false : userChoiceMapsLinked;
            rules.mirrorClick = userChoiceMapsLinked => userChoiceMapsLinked === undefined ? false : userChoiceMapsLinked;
            rules.mirrorReset = true;
            rules.allowConfiguration = (productId: string) => productId === "userChoice" || productId === "userChoiceChile";
            rules.allowReset = partition => partition === 'left';
            rules.modal = (state, scenario, partition) => {
                if (partition === "left") {
                    const result = showColorExplanationModal(state, scenario, partition);
                    if (result) return result;
                }
                if (partition === "right") {
                    if (!allStepsCompleted(state, scenario, "left")) return {id: "willActivateOnceLeftDone", title: "", subtitle: "", body: "willActivateOnceLeftDone", closable: false, dontShowAgainAble: false };
                }
                if (partition === "middle") {
                    if (allStepsCompleted(state, scenario, "left")) return {id: "compareIdenticalWithLeft", title: "windowAvailable", subtitle: "", body: "compareIdenticalWithLeft", closable: true, dontShowAgainAble: false };
                }
                return undefined;
            }
            rules.allowViewLinkToggling = true;
            break;
        case 'compareAdvanced':
            rules.mirrorStepFocus = userChoiceMapsLinked => userChoiceMapsLinked === undefined ? true : userChoiceMapsLinked;
            rules.mirrorMove = userChoiceMapsLinked => userChoiceMapsLinked === undefined ? true : userChoiceMapsLinked;
            rules.mirrorClick = (userChoiceMapsLinked, compositeId) => false;
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


function showColorExplanationModal(state: RiesgosState, scenario: ScenarioName, partition: PartitionName) {
    if (fullRunCompletedBefore) {
        console.log("Not showing color modal because already seen before.");
        return undefined;
    }
    const scenarioState = state.scenarioData[scenario]![partition]!;
    const eqSelectCompleted = scenarioState.steps.find(s => s.step.id === "selectEq" || s.step.id === "selectEqChile")?.state.type === StepStateTypes.completed;
    const fullRunCompleted = allStepsCompleted(state, scenario, partition);
    if (fullRunCompleted) {
        fullRunCompletedBefore = true;
    }
    if (eqSelectCompleted && !fullRunCompleted) {
        return { id: "colorExplanation", title: "", subtitle: "", body: "explanationOfColors", closable: false, dontShowAgainAble: true };
    }
    return undefined;
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
