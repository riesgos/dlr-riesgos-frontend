import { Step } from "../../../scenarios/scenarios";
import { WpsClient, WpsData, WpsDataDescription } from "../../../utils/wps/public-api";


const wpsClient = new WpsClient('2.0.0');

async function loadEqs() {

    const url = `https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService`;
    const processId = 'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess';

    const inputs: WpsData[] = [{
        description: {
            id: 'mmin',
            type: 'literal',
            reference: false
        },
        value: '6.0'
    }, {
        description: {
            id: 'mmax',
            type: 'literal',
            reference: false
        },
        value: '9.5'
    }, {
        description: {
            id: 'zmin',
            type: 'literal',
            reference: false
        },
        value: '0'
    }, {
        description: {
            id: 'zmax',
            type: 'literal',
            reference: false
        },
        value: '100'
    }, {
        description: {
            id: 'p',
            type: 'literal',
            reference: false
        },
        value: '0.0'
    }, {
        description: {
            id: 'etype',
            reference: false,
            type: 'literal',
        },
        value: 'observed'
    }, {
        description: {
            id: 'tlon',
            reference: false,
            type: 'literal'
        },
        value: '-77.00'
    }, {
        description: {
            id: 'tlat',
            reference: false,
            type: 'literal'
        },
        value: '-12.00'
    }];

    const outputs: WpsDataDescription[] = [{
        id: 'selectedRows',
        reference: false,
        type: 'complex'
    }];

    const results = await wpsClient.executeAsync(url, processId, inputs, outputs);

    return [{
        id: 'availableEqs',
        value: results[0]
    }];
}



export const step: Step = {
    step: 1,
    title: 'Eqs',
    description: 'Fetch eq data from database',
    inputs: [],
    outputs: [{
        id: 'tomatoes'
    }],
    function: loadEqs
};