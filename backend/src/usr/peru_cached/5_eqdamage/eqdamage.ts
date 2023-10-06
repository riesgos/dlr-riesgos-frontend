import { Datum, Step } from "../../../scenarios/scenarios";
import { readJsonFile } from "../../../utils/files";
import config from "../../../config.json";

async function calculateDamage(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const id = selectedEq.features[0].id.replace("peru_", "").replace("quakeml:quakeledger/", "");
    
    const wms = `${config.services.cacheServer}?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AeqDamage_${id}`;
    const summary = await readJsonFile(`${__dirname}/../../../../data/data/cached_data/eqDamageSummary_${id}.json`);

    return [{
        id: 'eqDamageWms',
        value: wms
    }, {
        id: 'eqDamageSummary',
        value: summary
    }];
}



export const step: Step = {
    id: 'EqDamage',
    title: 'Multihazard_damage_estimation/Earthquake',
    description: 'eq_damage_svc_description',
    inputs: [{
        id: 'selectedEq'
    }],
    outputs: [{
        id: 'eqDamageWms'
    }, {
        id: 'eqDamageSummary'
    }],
    function: calculateDamage
};
