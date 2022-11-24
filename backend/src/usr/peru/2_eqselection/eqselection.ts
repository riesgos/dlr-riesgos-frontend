import { Datum, Step } from "../../../scenarios/scenarios";




async function selectEq(inputs: Datum[]) {

    const availableEqs = inputs.find(i => i.id === 'availableEqs')!.value;
    const userSelection = inputs.find(i => i.id === 'userChoice')!;

    const chosenEq = availableEqs.features[userSelection.value];

    return [{
        id: 'selectedEq',
        value: chosenEq
    }];
}



export const step: Step = {
    id: 'selectEq',
    title: 'Select earthquake',
    description: 'select_eq_description',
    inputs: [{
        id: 'availableEqs'
    }, {
        id: 'userChoice',
        options: []
    }],
    outputs: [{
        id: 'selectedEq'
    }],
    function: selectEq
};