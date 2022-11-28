import { Datum, Step } from "../../../scenarios/scenarios";


// Note: this whole step exists only to help out the frontend.
// Frontend currently requires backend to provide a step.
// Once that's no loger the case, 
// delete this step.

async function selectVei(datum: Datum[]) {
    const vei = datum.find(d => d.id === 'veiUserSelection')!.value;
    return [{
        id: 'vei',
        value: vei
    }]
}

export const step: Step = {
    id: 'VeiSelection',
    title: 'VEI Selection',
    description: 'VEI_description',
    inputs: [{
        id: 'veiUserSelection',
        options: ['VEI1', 'VEI2', 'VEI3', 'VEI4']
    }],
    outputs: [{
        id: 'vei'
    }],
    function: selectVei
}