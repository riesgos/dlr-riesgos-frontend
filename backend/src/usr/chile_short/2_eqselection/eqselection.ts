import { Datum, Step } from "../../../scenarios/scenarios";
import catalogChileExpert from "./eq_catalog/chile/expert.geo.json";



async function selectEq(inputs: Datum[]) {

    const userChoice = inputs.find(i => i.id === 'userChoiceChile')!.value;

    const wrappedSelectedEq = {
        type: 'FeatureCollection',
        features: [userChoice]
    };

    return [{
        id: 'selectedEqChile',
        value: wrappedSelectedEq
    }];
}



export const step: Step = {
    id: 'selectEqChile',
    title: 'Select earthquake',
    description: 'select_eq_description',
    inputs: [{
        id: 'userChoiceChile',
        options: [...catalogChileExpert.features]
    }],
    outputs: [{
        id: 'selectedEqChile'
    }],
    function: selectEq
};