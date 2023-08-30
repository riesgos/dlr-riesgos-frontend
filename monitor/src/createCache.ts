import { writeFileSync } from "promise-fs";
import { ScenarioState, Datum, isDatumReference, InputPicker, DatumWithOptions, DatumReference, runScenario } from "./utils";



export async function runAndSavePeruShort(serverUrl: string, port: number) {

    function resolveAllRefs(data: ScenarioState): Datum[] {
        const out: Datum[] = [];
        for (const datum of data.data) {
            if (isDatumReference(datum)) {

            }
        }
        return out;
    }

    function createParaPicker(eqPara: any): InputPicker {
        function paraPicker(input: DatumWithOptions): Datum {
            if (input.id === "exposureModelName") {
                return {id: "exposureModelName", value: "LimaBlocks"}
            } else {
                return {id: input.id, value: input.options[0]}
            }
        }
        return paraPicker;
    }

    const scenarioId = "PeruShort";

    const eqParas: any[] = [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -80.1176,
                    -8.8907
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_80000011",
                "preferredOriginID": "quakeml:quakeledger/peru_80000011",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_80000011",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/peru_80000011",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "35.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_80000011",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_80000011",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "334.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "12.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_80000011"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -80.1645,
                    -8.6877
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_80000021",
                "preferredOriginID": "quakeml:quakeledger/peru_80000021",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_80000021",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/peru_80000021",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "35.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_80000021",
                "magnitude.mag.value": "8.6",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_80000021",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "334.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "12.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_80000021"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -80.2208,
                    -8.4567
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_80000031",
                "preferredOriginID": "quakeml:quakeledger/peru_80000031",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_80000031",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/peru_80000031",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "35.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_80000031",
                "magnitude.mag.value": "8.7",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_80000031",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "334.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "12.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_80000031"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -80.2878,
                    -8.1937
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_80000041",
                "preferredOriginID": "quakeml:quakeledger/peru_80000041",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_80000041",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/peru_80000041",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "35.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_80000041",
                "magnitude.mag.value": "8.8",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_80000041",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "334.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "12.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_80000041"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -80.3676,
                    -7.8942
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_80000051",
                "preferredOriginID": "quakeml:quakeledger/peru_80000051",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_80000051",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/peru_80000051",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "35.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_80000051",
                "magnitude.mag.value": "8.9",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_80000051",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "334.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "12.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_80000051"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -80.462,
                    -7.5531
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_80000111",
                "preferredOriginID": "quakeml:quakeledger/peru_80000111",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_80000111",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/peru_80000111",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "34.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_80000111",
                "magnitude.mag.value": "9.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_80000111",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "334.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "12.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_80000111"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -80.462,
                    -7.5531
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_80000211",
                "preferredOriginID": "quakeml:quakeledger/peru_80000211",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_80000211",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/peru_80000211",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "34.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_80000211",
                "magnitude.mag.value": "9.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_80000211",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "334.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "12.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_80000211"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -80.012,
                    -8.6531
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_80000311",
                "preferredOriginID": "quakeml:quakeledger/peru_80000311",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_80000311",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/peru_80000311",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "34.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_80000311",
                "magnitude.mag.value": "9.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_80000311",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "334.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "12.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_80000311"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -79.662,
                    -8.9931
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_80000411",
                "preferredOriginID": "quakeml:quakeledger/peru_80000411",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_80000411",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/peru_80000411",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "34.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_80000411",
                "magnitude.mag.value": "9.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_80000411",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "334.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "12.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_80000411"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.7168,
                    -17.1578
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_80000511",
                "preferredOriginID": "quakeml:quakeledger/peru_80000511",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_80000511",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/peru_80000511",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "40.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_80000511",
                "magnitude.mag.value": "9.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_80000511",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "312.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_80000511"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.9318,
                    -12.1908
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000011",
                "preferredOriginID": "quakeml:quakeledger/peru_70000011",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000011",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000011",
                "origin.time.value": "1746-10-28T00:00:00.000000Z",
                "origin.depth.value": "8.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000011",
                "magnitude.mag.value": "9.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000011",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "329.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000011"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -78.696,
                    -10.927
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000012",
                "preferredOriginID": "quakeml:quakeledger/peru_70000012",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000012",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000012",
                "origin.time.value": "1746-10-28T00:00:00.000000Z",
                "origin.depth.value": "8.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000012",
                "magnitude.mag.value": "8.8",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000012",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "329.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000012"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -78.1865,
                    -11.7749
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000013",
                "preferredOriginID": "quakeml:quakeledger/peru_70000013",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000013",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000013",
                "origin.time.value": "1746-10-28T00:00:00.000000Z",
                "origin.depth.value": "8.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000013",
                "magnitude.mag.value": "8.9",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000013",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "329.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000013"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.677,
                    -12.6229
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000014",
                "preferredOriginID": "quakeml:quakeledger/peru_70000014",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000014",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000014",
                "origin.time.value": "1746-10-28T00:00:00.000000Z",
                "origin.depth.value": "8.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000014",
                "magnitude.mag.value": "8.9",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000014",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "329.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000014"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -78.9508,
                    -10.5031
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000015",
                "preferredOriginID": "quakeml:quakeledger/peru_70000015",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000015",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000015",
                "origin.time.value": "1746-10-28T00:00:00.000000Z",
                "origin.depth.value": "8.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000015",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000015",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "329.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000015"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -78.4413,
                    -11.351
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000016",
                "preferredOriginID": "quakeml:quakeledger/peru_70000016",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000016",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000016",
                "origin.time.value": "1746-10-28T00:00:00.000000Z",
                "origin.depth.value": "8.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000016",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000016",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "329.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000016"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.9318,
                    -12.1989
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000017",
                "preferredOriginID": "quakeml:quakeledger/peru_70000017",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000017",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000017",
                "origin.time.value": "1746-10-28T00:00:00.000000Z",
                "origin.depth.value": "8.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000017",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000017",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "329.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000017"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.4223,
                    -13.0469
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000018",
                "preferredOriginID": "quakeml:quakeledger/peru_70000018",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000018",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000018",
                "origin.time.value": "1746-10-28T00:00:00.000000Z",
                "origin.depth.value": "8.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000018",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000018",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "329.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000018"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -76.603,
                    -13.386
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000021",
                "preferredOriginID": "quakeml:quakeledger/peru_70000021",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000021",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000021",
                "origin.time.value": "2007-08-15T00:00:00.000000Z",
                "origin.depth.value": "30.2",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000021",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000021",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "318.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.9",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "62.2",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000021"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -73.641,
                    -16.265
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000031",
                "preferredOriginID": "quakeml:quakeledger/peru_70000031",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000031",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000031",
                "origin.time.value": "2001-06-23T00:00:00.000000Z",
                "origin.depth.value": "33.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000031",
                "magnitude.mag.value": "8.4",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000031",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "315.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "16.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "70.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000031"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -77.487,
                    -11.094
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000041",
                "preferredOriginID": "quakeml:quakeledger/peru_70000041",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000041",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000041",
                "origin.time.value": "1940-05-24T00:00:00.000000Z",
                "origin.depth.value": "45.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000041",
                "magnitude.mag.value": "8.2",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000041",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "324.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "15.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000041"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -78.228,
                    -10.665
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/peru_70000051",
                "preferredOriginID": "quakeml:quakeledger/peru_70000051",
                "preferredMagnitudeID": "quakeml:quakeledger/peru_70000051",
                "type": "earthquake",
                "description.text": "observed",
                "origin.publicID": "quakeml:quakeledger/peru_70000051",
                "origin.time.value": "1966-10-17T00:00:00.000000Z",
                "origin.depth.value": "40.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/peru_70000051",
                "magnitude.mag.value": "8.1",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/peru_70000051",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "324.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "15.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/peru_70000051"
        }
    ];

    for (const eqPara of eqParas) {
        console.log(`Working on eq ${eqPara.id} ...`)

        const inputPicker = createParaPicker(eqPara);

        const state = await runScenario(serverUrl, port, scenarioId, inputPicker);

        const stateResolved: Datum[] = resolveAllRefs(state);

        for (const entry of stateResolved) {
            writeFileSync(`../cache/${eqPara.id}/${entry.id}`, entry.value);
        }
    }

}


await runAndSavePeruShort("http://localhost", 3000);