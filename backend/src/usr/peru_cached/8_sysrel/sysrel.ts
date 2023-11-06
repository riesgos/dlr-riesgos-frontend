import { Datum, Step } from "../../../scenarios/scenarios";
import config from '../../../config.json';
import infraSanitaria from './data/infra_sanitaria.json';
import infraTransmission from './data/infra_transmision.json';

async function calcSysRel(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const id = selectedEq.features[0].id.replace("peru_", "").replace("quakeml:quakeledger/", "");

    const wms = `${config.services.cacheServer}?SERVICE=WMS&LAYERS=riesgos:sysrel_${id}&TRANSPARENT=true&VERSION=1.1.1`;
    return [{
        id: 'sysRel',
        value: wms
    }, {
        id: 'sysRelSanitaria',
        value: infraSanitaria
    }, {
        id: 'sysRelTransmission',
        value: infraTransmission
    }];
}



export const step: Step = {
    id: 'SysRel',
    title: 'System reliability after EQ Peru',
    description: 'Description_system_reliability',
    inputs: [{
        id: 'selectedEq'
    }],
    outputs: [{
        id: 'sysRel'
    }, {
        id: 'sysRelSanitaria'
    }, {
        id: 'sysRelTransmission'
    }],
    function: calcSysRel
};
