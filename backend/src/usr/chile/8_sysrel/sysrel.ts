import { Datum, Step } from "../../../scenarios/scenarios";
import { getSystemReliability } from "../../wpsServices";


async function calcSysRel(inputs: Datum[]) {

    const intensityRef = inputs.find(i => i.id === 'eqSimXmlRefChile')!;

    const result = await getSystemReliability('chile', intensityRef.value);

    return [{
        id: 'damageConsumerAreasChile',
        value: result
    }];
}



export const step: Step = {
    id: 'damageConsumerAreasChile',
    title: 'System reliability after EQ',
    description: 'Description_system_reliability',
    inputs: [{
        id: 'eqSimXmlRefChile'
    }],
    outputs: [{
        id: 'damageConsumerAreasChile'
    }],
    function: calcSysRel
};
