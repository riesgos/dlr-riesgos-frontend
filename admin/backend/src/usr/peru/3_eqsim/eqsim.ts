import { Datum, Step } from "../../../scenarios/scenarios";
import { getEqSim } from "../utils";



async function simulateEq(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const gmpe = inputs.find(i => i.id === 'gmpe')!.value;
    const vsgrid = inputs.find(i => i.id === 'vsgrid')!.value;

    const result = await getEqSim(gmpe, vsgrid, selectedEq);

    return [{
        id: 'eqSim',
        value: result
    }];
}



export const step: Step = {
    id: 'EqSim',
    title: 'Earthquake Simulation',
    description: 'Simulates ground-motion',
    inputs: [{
        id: 'selectedEq'
    }, {
        id: 'gmpe',
        options: [ 'MontalvaEtAl2016SInter', 'GhofraniAtkinson2014', 'AbrahamsonEtAl2015SInter', 'YoungsEtAl1997SInterNSHMP2008' ]
    }, {
        id: 'vsgrid',
        options: ['USGSSlopeBasedTopographyProxy', 'FromSeismogeotechnicsMicrozonation']
    }],
    outputs: [{
        id: 'eqSim'
    }],
    function: simulateEq
};