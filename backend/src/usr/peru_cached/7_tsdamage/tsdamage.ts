import { Datum, Step } from "../../../scenarios/scenarios";
import { readJsonFile } from "../../../utils/files";
import config from "../../../config.json";


async function tsDamage(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const id = selectedEq.features[0].id.replace("peru_", "").replace("quakeml:quakeledger/", "");
  
    const wms = `${config.services.cacheServer}?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AtsDamage_${id}`;
    const summary = await readJsonFile(`${__dirname}/../../../../data/data/cached_data/tsDamageSummary_${id}.json`);
    
    return [{
        id: 'tsDamageWms',
        value: wms
    }, {
        id: 'tsDamageSummary',
        value: summary
    }];
}



export const step: Step = {
    id: 'TsDamage',
    title: 'Multihazard_damage_estimation/Tsunami',
    description: 'ts_damage_svc_description',
    inputs: [{
        id: 'selectedEq',
    }],
    outputs: [{
        id: 'tsDamageWms'
    }, {
        id: 'tsDamageSummary'
    }],
    function: tsDamage
};