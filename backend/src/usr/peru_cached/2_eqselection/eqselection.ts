import { Datum, Step } from "../../../scenarios/scenarios";
import catalogPeruExpert from "./eq_catalog/peru/expert.geo.json";
import catalogPeruObserved from "./eq_catalog/peru/observed.geo.json";



async function selectEq(inputs: Datum[]) {

    const userChoice = inputs.find(i => i.id === 'userChoice')!.value;

    const wrappedSelectedEq = {
        type: 'FeatureCollection',
        features: [userChoice]
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