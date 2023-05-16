import { Datum, Step } from "../../../scenarios/scenarios";
import { getEqSim } from "../../wpsServices";



async function simulateEq(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const gmpe = inputs.find(i => i.id === 'gmpe')!.value;
    const vsgrid = inputs.find(i => i.id === 'vsgrid')!.value;

    const { wms, xml } = await getEqSim(gmpe, vsgrid, selectedEq);

    return [{
        id: 'eqSimWms',
        value: wms,
    }, {
        id: 'eqSimXmlRef',
        value: xml
    }];
}



export const step: Step = {
    id: 'EqSimulation',
    title: 'Earthquake Simulation',
    description: 'EqSimulationShortText',
    inputs: [{
        id: 'selectedEq'
    }, {
        id: 'gmpe',
        options: [ 'MontalvaEtAl2016SInter', 'GhofraniAtkinson2014', 'AbrahamsonEtAl2015SInter', 'YoungsEtAl1997SInterNSHMP2008' ],
        default: 'MontalvaEtAl2016SInter'
    }, {
        id: 'vsgrid',
        options: ['USGSSlopeBasedTopographyProxy', 'FromSeismogeotechnicsMicrozonation'],
        default: 'USGSSlopeBasedTopographyProxy'
    }],
    outputs: [{
        id: 'eqSimWms'
    }, {
        id: 'eqSimXmlRef'
    }],
    function: simulateEq
};