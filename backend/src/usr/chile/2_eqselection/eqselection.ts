import { Datum, Step } from "../../../scenarios/scenarios";




async function selectEq(inputs: Datum[]) {

    const availableEqs = inputs.find(i => i.id === 'availableEqsChile')!.value;
    const userChoice = inputs.find(i => i.id === 'userChoiceChile')!.value;
    
    // @TODO: currently, we're expecting the user-choice to already be a feature-collection.
    // This is really silly. A simple id would do.
    let selectedEq;
    if (typeof userChoice === 'number') {
        selectedEq = availableEqs.features[userChoice];
    } else if (typeof userChoice === 'string') {
        selectedEq = availableEqs.features.find((f: any) => f.id === userChoice);
    } else {
        const eqId = userChoice.features[0].id;
        selectedEq = availableEqs.features.find((f: any) => f.id === eqId);
    }

    const wrappedSelectedEq = {
        type: 'FeatureCollection',
        features: [selectedEq]
    };

    return [{
        id: 'selectedEqChile',
        value: wrappedSelectedEq
    }];
}



export const step: Step = {
    id: 'SelectEqChile',
    title: 'Select earthquake',
    description: 'select_eq_description',
    inputs: [{
        id: 'availableEqsChile'
    }, {
        id: 'userChoiceChile',
        options: []  // really, only the features in `availableEqs` should be valid options here.
    }],
    outputs: [{
        id: 'selectedEqChile'
    }],
    function: selectEq
};