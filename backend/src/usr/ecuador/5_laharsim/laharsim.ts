import { Datum, Step } from "../../../scenarios/scenarios";
import { getLahar, getLaharContourWms } from "../../wpsServices";





async function getLahars(data: Datum[]) {

    const vei = +(data.find(d => d.id === 'vei')!.value + '').replace('VEI', '');
    const direction = data.find(d => d.id === 'direction')!.value;

    const { erosionWms, heightRef, heightWms, pressureWms, velRef, velWms } = await getLahar(direction, vei);
    const contourWms = getLaharContourWms(direction, vei);

    return [{
        id: 'laharWmses',
        value: {velWms, heightWms, erosionWms, pressureWms, contourWms}
    }, {
        id: 'laharShakemapRefs',
        value: {heightRef, velRef}
    }];
}


export const step: Step = {
    id: 'LaharSim',
    title: 'LaharService',
    description: 'Process_description_lahar_simulation',
    inputs: [{
        id: 'vei'
    }, {
        id: 'direction',
        options: ['North', 'South']
    }],
    outputs: [{
        id: 'laharWmses'
    }, {
        id: 'laharShakemapRefs'
    }],
    function: getLahars
}