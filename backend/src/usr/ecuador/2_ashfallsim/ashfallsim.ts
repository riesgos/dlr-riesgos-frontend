import { Datum, Step } from "../../../scenarios/scenarios";
import { readJsonFile } from "../../../utils/files";


async function getAshfallPolys(vei: number, prob: number) {
    const fileName = `${__dirname}/ashfall_polygons/ash_prob${prob}_vei${vei}.geojson`;
    const data = await readJsonFile(fileName);
    return data;
}

async function getAshfallPoints(vei: number, prob: number) {
    let probFormatted = `${prob}`;
    if (prob === 0) probFormatted = '0' + probFormatted;
    const fileName = `${__dirname}/ashfall_points/VEI_${vei}_${probFormatted}percent.geojson`
    const data = await readJsonFile(fileName);
    return data;
}


async function getAshfall(data: Datum[]) {

    const vei = +(data.find(d => d.id === 'vei')!.value + '').replace('VEI', '');
    const prob = +(data.find(d => d.id === 'ashfallProb')!.value);

    const ashfallVectors = await getAshfallPolys(vei, prob);
    const ashfallPoints = await getAshfallPoints(vei, prob);
    
    return [{
        id: 'ashfallVectors',
        value: ashfallVectors,
    }, {
        id: 'ashfallPoints',
        value: ashfallPoints
    }]
}

export const step: Step = {
    id: 'Ashfall',
    title: 'AshfallService',
    description: 'AshfallServiceDescription',
    inputs: [{
        id: 'vei',
    }, {
        id: 'ashfallProb',
        options: ['1', '50', '99']
    }],
    outputs: [{
        id: 'ashfallVectors'
    }, {
        id: 'ashfallPoints'
    }],
    function: getAshfall
}