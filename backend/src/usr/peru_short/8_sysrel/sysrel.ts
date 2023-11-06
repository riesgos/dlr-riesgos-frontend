import { Datum, Step } from "../../../scenarios/scenarios";
import { getSystemReliability } from "../../wpsServices";


async function calcSysRel(inputs: Datum[]) {

    const intensityRef = inputs.find(i => i.id === 'eqSimXmlRef')!;

    const result = await getSystemReliability('peru', intensityRef.value);

    return [{
        id: 'sysRel',
        value: result
    }];
}



export const step: Step = {
    id: 'SysRel',
    title: 'System reliability after EQ Peru',
    description: 'Description_system_reliability',
    inputs: [{
        id: 'eqSimXmlRef'
    }],
    outputs: [{
        id: 'sysRel'
    }],
    function: calcSysRel
};
