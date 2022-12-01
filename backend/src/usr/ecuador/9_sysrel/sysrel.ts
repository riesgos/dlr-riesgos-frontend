import { Datum, Step } from "../../../scenarios/scenarios";
import { getSystemReliabilityEcuador } from "../../wpsServices";


async function sysrel(data: Datum[]) {

    const velocityXmlRef = data.find(d => d.id === 'laharShakemapRefs')!.value.velRef;
    const heightXmlRef = data.find(d => d.id === 'laharShakemapRefs')!.value.heightRef;

    const sysrel = await getSystemReliabilityEcuador(heightXmlRef, velocityXmlRef);

    return [{
        id: 'sysrelEcuador',
        value: sysrel
    }];
}

export const step: Step = {
    id: 'SystemReliabilityEcuador',
    title: 'System reliability after Lahar',
    description: 'Description_system_reliability',
    inputs: [{
        id: 'laharShakemapRefs'
    }],
    outputs: [{
        id: 'sysrelEcuador'
    }],
    function: sysrel
}