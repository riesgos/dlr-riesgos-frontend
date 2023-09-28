import { Datum, Step } from "../../../scenarios/scenarios";


async function calcSysRel(inputs: Datum[]) {

    const selectedEq = inputs.find(i => i.id === 'selectedEq')!.value;
    const id = selectedEq.features[0].id.replace("peru_", "");

    const wms = `http://localhost:8080/geoserver/riesgos/wms?SERVICE=WMS&VERSION=1.1.1&TRANSPARENT=true&STYLES&LAYERS=riesgos%3AsysRel_${id}`;

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
