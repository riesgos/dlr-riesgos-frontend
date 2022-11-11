import { Datum, Step } from "../../../scenarios/scenarios";
import { getExposureModel, getFragility, getDamage } from "../utils";


async function calculateDamage(inputs: Datum[]) {

    const eqSim = inputs.find(i => i.id === 'eqSim')!;
    const exposureSelection = inputs.find(i => i.id === 'exposure')!;
    console.log("eqdamage: ", eqSim)
    console.log("eqdamage: ", exposureSelection)

    const exposureModel = await getExposureModel(exposureSelection.value);
    const fragility = await getFragility('SARA_v1.0');
    const damage = await getDamage('SARA_v1.0', fragility, eqSim.value, exposureModel);
  
    return [{
        id: 'eqDamage',
        value: damage
    }];
}



export const step: Step = {
    id: 'EqDamage',
    title: 'Earthquake Damage',
    description: 'Simulates damages to residential buildings',
    inputs: [{
        id: 'eqSim'
    }, {
        id: 'exposure',
        options: [
            "LimaCVT1_PD30_TI70_5000",
            "LimaCVT2_PD30_TI70_10000",
            "LimaCVT3_PD30_TI70_50000",
            "LimaCVT4_PD40_TI60_5000",
            "LimaCVT5_PD40_TI60_10000",
            "LimaCVT6_PD40_TI60_50000",
            "LimaBlocks",
         ]
    }],
    outputs: [{
        id: 'eqDamage'
    }],
    function: calculateDamage
};

