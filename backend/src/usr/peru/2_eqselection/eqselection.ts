import { Datum, Step } from "../../../scenarios/scenarios";




async function selectEq(inputs: Datum[]) {

    const availableEqs = inputs.find(i => i.id === 'availableEqs')!.value;
    const userChoice = inputs.find(i => i.id === 'userChoice')!.value;
    
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
        id: 'selectedEq',
        value: wrappedSelectedEq
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
        options: []  // really, only the features in `availableEqs` should be valid options here.
    }],
    outputs: [{
        id: 'selectedEq'
    }],
    function: selectEq
};