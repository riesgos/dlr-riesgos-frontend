import { Datum, Step } from "../../../scenarios/scenarios";


async function getAshfall(data: Datum[]) {

    
    
    return [{
        id: 'ashfallVector',
        value: ashfallVector,
    }, {
        id: 'ashfallPoint',
        value: ashfallPoint
    }]
}

export const step: Step = {
    id: 'Ashfall',
    title: 'ashfall-service',
    description: 'AshfallServiceDescription',
    inputs: [{
        id: 'vei',
        options: ['VEI1', 'VEI2', 'VEI3', 'VE4'],
    }, {
        id: 'ashfallProb',
        options: ['1', '50', '99']
    }],
    outputs: [{
        id: 'ashfallVector'
    }, {
        id: 'ashfallPoint'
    }],
    function: getAshfall
}