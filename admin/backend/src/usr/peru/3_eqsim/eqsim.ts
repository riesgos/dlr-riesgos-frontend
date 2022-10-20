import { Datum, Step } from "../../../scenarios/scenarios";
import { WpsClient, WpsInput, WpsOutputDescription } from "../../../utils/wps/public-api";


const wpsClient = new WpsClient('2.0.0');

async function simulateEq(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const gmpe = inputs.find(i => i.id === 'gmpe')!.value;
    const vsgrid = inputs.find(i => i.id === 'vsgrid')!.value;

    const url = `https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService`;
    const processId = 'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess';

    const wpsInputs: WpsInput[] = [{
        description: {
            id: 'quakeMLFile',
            reference: false,
            type: 'complex',
            format: 'application/vnd.geo+json'
        },
        value: selectedEq
    }, {
        description: {
            id: 'gmpe',
            reference: false,
            type: "literal",
        },
        value: gmpe
    }, {
        description: {
            id: 'vsgrid',
            reference: false,
            type: 'literal'
        },
        value: vsgrid
    }];

    const wpsOutputs: WpsOutputDescription[] = [{
        id: 'shakeMapFile',
        reference: false,
        type: 'complex',
        format: 'application/vnd.geo+json'
    }];

    const results = await wpsClient.executeAsync(url, processId, wpsInputs, wpsOutputs);

    return [{
        id: 'eqSim',
        value: results[0].value[0]
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