import { Datum, Step } from "../../../scenarios/scenarios";
import catalogPeruExpert from "./eq_catalog/peru/expert.geo.json";
import catalogPeruObserved from "./eq_catalog/peru/observed.geo.json";



async function selectEq(inputs: Datum[]) {

    const availableEqs = inputs.find(i => i.id === 'availableEqs')!.value;
    const userChoice = inputs.find(i => i.id === 'userChoice')!.value;
    
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
        id: 'userChoice',
        options: [...catalogPeruExpert.features, ...catalogPeruObserved.features]
    }],
    outputs: [{
        id: 'selectedEq'
    }],
    function: selectEq
};