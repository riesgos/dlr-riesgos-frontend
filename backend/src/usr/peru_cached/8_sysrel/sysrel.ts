import { Datum, Step } from "../../../scenarios/scenarios";


async function calcSysRel(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const id = selectedEq.features[0].id.replace("peru_", "").replace("quakeml:quakeledger/", "");

    const wms = `http://localhost:8080/geoserver/riesgos/wms?SERVICE=WMS&LAYERS=riesgos:sysrel_${id}&TRANSPARENT=true&VERSION=1.1.1`;
    return [{
        id: 'sysRel',
        value: wms
    }];
}



export const step: Step = {
    id: 'SysRel',
    title: 'System reliability after EQ',
    description: 'Description_system_reliability',
    inputs: [{
        id: 'selectedEq'
    }],
    outputs: [{
        id: 'sysRel'
    }],
    function: calcSysRel
};
