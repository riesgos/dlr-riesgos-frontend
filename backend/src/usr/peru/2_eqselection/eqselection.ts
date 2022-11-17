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
    title: 'Eq selection',
    description: 'Select one of the possible earthquakes',
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