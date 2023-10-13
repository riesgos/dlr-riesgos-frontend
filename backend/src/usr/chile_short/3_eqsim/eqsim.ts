import { Datum, Step } from "../../../scenarios/scenarios";
import { getEqSim } from "../../wpsServices";



async function simulateEq(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEqChile')!.value;
    const gmpe = inputs.find(i => i.id === 'gmpeChile')!.value;
    const vsgrid = inputs.find(i => i.id === 'vsgridChile')!.value;

    const { wms, xml, geotiffRef } = await getEqSim(gmpe, vsgrid, selectedEq);

    return [{
        id: 'eqSimWmsChile',
        value: wms,
    }, {
        id: 'eqSimXmlRefChile',
        value: xml
    }, {
        id: 'eqSimGeotiffRefChile',
        value: geotiffRef
    }];
}



export const step: Step = {
    id: 'EqSimulationChile',
    title: 'Earthquake Simulation',
    description: 'EqSimulationShortText',
    inputs: [{
        id: 'selectedEqChile'
    }, {
        id: 'gmpeChile',
        options: [ 'MontalvaEtAl2016SInter', 'GhofraniAtkinson2014', 'AbrahamsonEtAl2015SInter', 'YoungsEtAl1997SInterNSHMP2008' ],
        default: 'MontalvaEtAl2016SInter'
    }, {
        id: 'vsgridChile',
        options: ['USGSSlopeBasedTopographyProxy', 'FromSeismogeotechnicsMicrozonation'],
        default: 'USGSSlopeBasedTopographyProxy'
    }],
    outputs: [{
        id: 'eqSimWmsChile'
    }, {
        id: 'eqSimXmlRefChile'
    }, {
        id: 'eqSimGeotiffRefChile'
    }],
    function: simulateEq
};