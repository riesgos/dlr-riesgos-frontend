import { fileExists, writeBinaryFile, writeJsonFile, writeTextFile } from "./files";
import { ScenarioState, Datum, isDatumReference, InputPicker, DatumReference, runScenario, isResolvedDatum, isDatumWithOptions, isDatumWithDefault, sleep } from "./utils";

const eqParasChile: any[] = [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.3538,
                    -31.9306
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674883",
                "preferredOriginID": "quakeml:quakeledger/80674883",
                "preferredMagnitudeID": "quakeml:quakeledger/80674883",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674883",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "12.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674883",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674883",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674883"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.4418,
                    -32.3742
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674884",
                "preferredOriginID": "quakeml:quakeledger/80674884",
                "preferredMagnitudeID": "quakeml:quakeledger/80674884",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674884",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "12.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674884",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674884",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674884"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.5308,
                    -32.8178
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674885",
                "preferredOriginID": "quakeml:quakeledger/80674885",
                "preferredMagnitudeID": "quakeml:quakeledger/80674885",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674885",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "12.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674885",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674885",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674885"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.2093,
                    -31.9499
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674902",
                "preferredOriginID": "quakeml:quakeledger/80674902",
                "preferredMagnitudeID": "quakeml:quakeledger/80674902",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674902",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "17.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674902",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674902",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674902"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.2966,
                    -32.3935
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674903",
                "preferredOriginID": "quakeml:quakeledger/80674903",
                "preferredMagnitudeID": "quakeml:quakeledger/80674903",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674903",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "17.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674903",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674903",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674903"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.3848,
                    -32.8371
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674904",
                "preferredOriginID": "quakeml:quakeledger/80674904",
                "preferredMagnitudeID": "quakeml:quakeledger/80674904",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674904",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "17.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674904",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674904",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674904"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.0647,
                    -31.9692
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674921",
                "preferredOriginID": "quakeml:quakeledger/80674921",
                "preferredMagnitudeID": "quakeml:quakeledger/80674921",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674921",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "22.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674921",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674921",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674921"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.1513,
                    -32.4128
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674922",
                "preferredOriginID": "quakeml:quakeledger/80674922",
                "preferredMagnitudeID": "quakeml:quakeledger/80674922",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674922",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "22.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674922",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674922",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674922"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.2388,
                    -32.8564
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674923",
                "preferredOriginID": "quakeml:quakeledger/80674923",
                "preferredMagnitudeID": "quakeml:quakeledger/80674923",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674923",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "22.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674923",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674923",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674923"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.92,
                    -31.9885
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674940",
                "preferredOriginID": "quakeml:quakeledger/80674940",
                "preferredMagnitudeID": "quakeml:quakeledger/80674940",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674940",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "27.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674940",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674940",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674940"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.0059,
                    -32.4321
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674941",
                "preferredOriginID": "quakeml:quakeledger/80674941",
                "preferredMagnitudeID": "quakeml:quakeledger/80674941",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674941",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "27.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674941",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674941",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674941"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.0927,
                    -32.8757
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674942",
                "preferredOriginID": "quakeml:quakeledger/80674942",
                "preferredMagnitudeID": "quakeml:quakeledger/80674942",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674942",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "27.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674942",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674942",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674942"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.7754,
                    -32.0078
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674959",
                "preferredOriginID": "quakeml:quakeledger/80674959",
                "preferredMagnitudeID": "quakeml:quakeledger/80674959",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674959",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "32.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674959",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674959",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674959"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.8605,
                    -32.4514
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674960",
                "preferredOriginID": "quakeml:quakeledger/80674960",
                "preferredMagnitudeID": "quakeml:quakeledger/80674960",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674960",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "32.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674960",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674960",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674960"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.9465,
                    -32.895
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674961",
                "preferredOriginID": "quakeml:quakeledger/80674961",
                "preferredMagnitudeID": "quakeml:quakeledger/80674961",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674961",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "32.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674961",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674961",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674961"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.6306,
                    -32.0271
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674978",
                "preferredOriginID": "quakeml:quakeledger/80674978",
                "preferredMagnitudeID": "quakeml:quakeledger/80674978",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674978",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "37.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674978",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674978",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674978"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.715,
                    -32.4707
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674979",
                "preferredOriginID": "quakeml:quakeledger/80674979",
                "preferredMagnitudeID": "quakeml:quakeledger/80674979",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674979",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "37.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674979",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674979",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674979"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.8004,
                    -32.9143
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674980",
                "preferredOriginID": "quakeml:quakeledger/80674980",
                "preferredMagnitudeID": "quakeml:quakeledger/80674980",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674980",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "37.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674980",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674980",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674980"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.4857,
                    -32.0464
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674997",
                "preferredOriginID": "quakeml:quakeledger/80674997",
                "preferredMagnitudeID": "quakeml:quakeledger/80674997",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674997",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "42.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674997",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674997",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674997"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.5695,
                    -32.49
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674998",
                "preferredOriginID": "quakeml:quakeledger/80674998",
                "preferredMagnitudeID": "quakeml:quakeledger/80674998",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674998",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "42.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674998",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674998",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674998"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.6541,
                    -32.9336
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80674999",
                "preferredOriginID": "quakeml:quakeledger/80674999",
                "preferredMagnitudeID": "quakeml:quakeledger/80674999",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80674999",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "42.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80674999",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80674999",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80674999"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.3408,
                    -32.0657
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80675016",
                "preferredOriginID": "quakeml:quakeledger/80675016",
                "preferredMagnitudeID": "quakeml:quakeledger/80675016",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80675016",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "47.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80675016",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80675016",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80675016"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.4238,
                    -32.5093
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80675017",
                "preferredOriginID": "quakeml:quakeledger/80675017",
                "preferredMagnitudeID": "quakeml:quakeledger/80675017",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80675017",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "47.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80675017",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80675017",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80675017"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.5077,
                    -32.9529
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80675018",
                "preferredOriginID": "quakeml:quakeledger/80675018",
                "preferredMagnitudeID": "quakeml:quakeledger/80675018",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80675018",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "47.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80675018",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80675018",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80675018"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.3869,
                    -32.6458
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80697115",
                "preferredOriginID": "quakeml:quakeledger/80697115",
                "preferredMagnitudeID": "quakeml:quakeledger/80697115",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80697115",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "16.4",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80697115",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80697115",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80697115"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.0668,
                    -31.7779
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80697132",
                "preferredOriginID": "quakeml:quakeledger/80697132",
                "preferredMagnitudeID": "quakeml:quakeledger/80697132",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80697132",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "21.4",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80697132",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80697132",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80697132"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.2409,
                    -32.6651
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80697134",
                "preferredOriginID": "quakeml:quakeledger/80697134",
                "preferredMagnitudeID": "quakeml:quakeledger/80697134",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80697134",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "21.4",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80697134",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80697134",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80697134"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.9222,
                    -31.7972
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80697151",
                "preferredOriginID": "quakeml:quakeledger/80697151",
                "preferredMagnitudeID": "quakeml:quakeledger/80697151",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80697151",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "26.4",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80697151",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80697151",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80697151"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.6564,
                    -32.7423
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80697210",
                "preferredOriginID": "quakeml:quakeledger/80697210",
                "preferredMagnitudeID": "quakeml:quakeledger/80697210",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80697210",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "41.4",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80697210",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80697210",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80697210"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.1688,
                    -31.8466
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741574",
                "preferredOriginID": "quakeml:quakeledger/80741574",
                "preferredMagnitudeID": "quakeml:quakeledger/80741574",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741574",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "18.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741574",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741574",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741574"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.2564,
                    -32.2902
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741575",
                "preferredOriginID": "quakeml:quakeledger/80741575",
                "preferredMagnitudeID": "quakeml:quakeledger/80741575",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741575",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "18.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741575",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741575",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741575"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.0235,
                    -31.8659
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741593",
                "preferredOriginID": "quakeml:quakeledger/80741593",
                "preferredMagnitudeID": "quakeml:quakeledger/80741593",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741593",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "23.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741593",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741593",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741593"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.1103,
                    -32.3095
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741594",
                "preferredOriginID": "quakeml:quakeledger/80741594",
                "preferredMagnitudeID": "quakeml:quakeledger/80741594",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741594",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "23.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741594",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741594",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741594"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.8782,
                    -31.8852
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741612",
                "preferredOriginID": "quakeml:quakeledger/80741612",
                "preferredMagnitudeID": "quakeml:quakeledger/80741612",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741612",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "28.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741612",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741612",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741612"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.9643,
                    -32.3288
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741613",
                "preferredOriginID": "quakeml:quakeledger/80741613",
                "preferredMagnitudeID": "quakeml:quakeledger/80741613",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741613",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "28.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741613",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741613",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741613"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.7328,
                    -31.9045
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741631",
                "preferredOriginID": "quakeml:quakeledger/80741631",
                "preferredMagnitudeID": "quakeml:quakeledger/80741631",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741631",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "33.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741631",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741631",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741631"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.8181,
                    -32.3481
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741632",
                "preferredOriginID": "quakeml:quakeledger/80741632",
                "preferredMagnitudeID": "quakeml:quakeledger/80741632",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741632",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "33.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741632",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741632",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741632"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.5872,
                    -31.9238
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741650",
                "preferredOriginID": "quakeml:quakeledger/80741650",
                "preferredMagnitudeID": "quakeml:quakeledger/80741650",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741650",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "38.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741650",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741650",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741650"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.6719,
                    -32.3674
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741651",
                "preferredOriginID": "quakeml:quakeledger/80741651",
                "preferredMagnitudeID": "quakeml:quakeledger/80741651",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741651",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "38.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741651",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741651",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741651"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.4417,
                    -31.9431
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741669",
                "preferredOriginID": "quakeml:quakeledger/80741669",
                "preferredMagnitudeID": "quakeml:quakeledger/80741669",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741669",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "43.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741669",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741669",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741669"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.5257,
                    -32.3867
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741670",
                "preferredOriginID": "quakeml:quakeledger/80741670",
                "preferredMagnitudeID": "quakeml:quakeledger/80741670",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741670",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "43.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741670",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741670",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741670"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.2961,
                    -31.9624
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741688",
                "preferredOriginID": "quakeml:quakeledger/80741688",
                "preferredMagnitudeID": "quakeml:quakeledger/80741688",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741688",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "48.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741688",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741688",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741688"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.3793,
                    -32.406
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741689",
                "preferredOriginID": "quakeml:quakeledger/80741689",
                "preferredMagnitudeID": "quakeml:quakeledger/80741689",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741689",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "48.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741689",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741689",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741689"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.1504,
                    -31.9817
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741707",
                "preferredOriginID": "quakeml:quakeledger/80741707",
                "preferredMagnitudeID": "quakeml:quakeledger/80741707",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741707",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "53.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741707",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741707",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741707"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.2329,
                    -32.4253
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80741708",
                "preferredOriginID": "quakeml:quakeledger/80741708",
                "preferredMagnitudeID": "quakeml:quakeledger/80741708",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80741708",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "53.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80741708",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80741708",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80741708"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.1658,
                    -31.9925
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80763804",
                "preferredOriginID": "quakeml:quakeledger/80763804",
                "preferredMagnitudeID": "quakeml:quakeledger/80763804",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80763804",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "19.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80763804",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80763804",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80763804"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.2533,
                    -32.4361
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80763805",
                "preferredOriginID": "quakeml:quakeledger/80763805",
                "preferredMagnitudeID": "quakeml:quakeledger/80763805",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80763805",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "19.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80763805",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80763805",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80763805"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.1073,
                    -32.4554
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80763824",
                "preferredOriginID": "quakeml:quakeledger/80763824",
                "preferredMagnitudeID": "quakeml:quakeledger/80763824",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80763824",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "24.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80763824",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80763824",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80763824"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.8752,
                    -32.0311
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80763842",
                "preferredOriginID": "quakeml:quakeledger/80763842",
                "preferredMagnitudeID": "quakeml:quakeledger/80763842",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80763842",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "29.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80763842",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80763842",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80763842"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.8151,
                    -32.494
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80763862",
                "preferredOriginID": "quakeml:quakeledger/80763862",
                "preferredMagnitudeID": "quakeml:quakeledger/80763862",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80763862",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "34.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80763862",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80763862",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80763862"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.5842,
                    -32.0697
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80763880",
                "preferredOriginID": "quakeml:quakeledger/80763880",
                "preferredMagnitudeID": "quakeml:quakeledger/80763880",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80763880",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "39.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80763880",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80763880",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80763880"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.4496,
                    -33.5083
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80924453",
                "preferredOriginID": "quakeml:quakeledger/80924453",
                "preferredMagnitudeID": "quakeml:quakeledger/80924453",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80924453",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "12.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80924453",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80924453",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80924453"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.3124,
                    -33.5575
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80924461",
                "preferredOriginID": "quakeml:quakeledger/80924461",
                "preferredMagnitudeID": "quakeml:quakeledger/80924461",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80924461",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "17.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80924461",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80924461",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80924461"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.1751,
                    -33.6067
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80924469",
                "preferredOriginID": "quakeml:quakeledger/80924469",
                "preferredMagnitudeID": "quakeml:quakeledger/80924469",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80924469",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "22.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80924469",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80924469",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80924469"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.0377,
                    -33.6559
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80924477",
                "preferredOriginID": "quakeml:quakeledger/80924477",
                "preferredMagnitudeID": "quakeml:quakeledger/80924477",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80924477",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "27.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80924477",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80924477",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80924477"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.9001,
                    -33.7051
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80924485",
                "preferredOriginID": "quakeml:quakeledger/80924485",
                "preferredMagnitudeID": "quakeml:quakeledger/80924485",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80924485",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "32.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80924485",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80924485",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80924485"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.7623,
                    -33.7543
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80924493",
                "preferredOriginID": "quakeml:quakeledger/80924493",
                "preferredMagnitudeID": "quakeml:quakeledger/80924493",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80924493",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "37.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80924493",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80924493",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80924493"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.6244,
                    -33.8035
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80924501",
                "preferredOriginID": "quakeml:quakeledger/80924501",
                "preferredMagnitudeID": "quakeml:quakeledger/80924501",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80924501",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "42.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80924501",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80924501",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80924501"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.4863,
                    -33.8527
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80924509",
                "preferredOriginID": "quakeml:quakeledger/80924509",
                "preferredMagnitudeID": "quakeml:quakeledger/80924509",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80924509",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "47.7",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80924509",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80924509",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80924509"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.2573,
                    -33.3718
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80933813",
                "preferredOriginID": "quakeml:quakeledger/80933813",
                "preferredMagnitudeID": "quakeml:quakeledger/80933813",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80933813",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "16.4",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80933813",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80933813",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80933813"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.1201,
                    -33.421
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80933821",
                "preferredOriginID": "quakeml:quakeledger/80933821",
                "preferredMagnitudeID": "quakeml:quakeledger/80933821",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80933821",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "21.4",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80933821",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80933821",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80933821"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.9827,
                    -33.4702
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/80933829",
                "preferredOriginID": "quakeml:quakeledger/80933829",
                "preferredMagnitudeID": "quakeml:quakeledger/80933829",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/80933829",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "26.4",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/80933829",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/80933829",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "23.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/80933829"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.258,
                    -32.8592
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/81705295",
                "preferredOriginID": "quakeml:quakeledger/81705295",
                "preferredMagnitudeID": "quakeml:quakeledger/81705295",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/81705295",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "19.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/81705295",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/81705295",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "6.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/81705295"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.9629,
                    -32.8871
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/81705297",
                "preferredOriginID": "quakeml:quakeledger/81705297",
                "preferredMagnitudeID": "quakeml:quakeledger/81705297",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/81705297",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "29.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/81705297",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/81705297",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "6.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/81705297"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.8152,
                    -32.9011
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/81705298",
                "preferredOriginID": "quakeml:quakeledger/81705298",
                "preferredMagnitudeID": "quakeml:quakeledger/81705298",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/81705298",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "34.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/81705298",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/81705298",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "6.5",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/81705298"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.107,
                    -32.455
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/82100023",
                "preferredOriginID": "quakeml:quakeledger/82100023",
                "preferredMagnitudeID": "quakeml:quakeledger/82100023",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/82100023",
                "origin.time.value": "2019-01-01T00:00:00.000000Z",
                "origin.depth.value": "24.5",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/82100023",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/82100023",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/82100023"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.7235,
                    -30.4383
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000110",
                "preferredOriginID": "quakeml:quakeledger/90000110",
                "preferredMagnitudeID": "quakeml:quakeledger/90000110",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000110",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "28.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000110",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000110",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000110"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.8082,
                    -30.8819
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000111",
                "preferredOriginID": "quakeml:quakeledger/90000111",
                "preferredMagnitudeID": "quakeml:quakeledger/90000111",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000111",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "28.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000111",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000111",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000111"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.8938,
                    -31.3255
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000112",
                "preferredOriginID": "quakeml:quakeledger/90000112",
                "preferredMagnitudeID": "quakeml:quakeledger/90000112",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000112",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "28.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000112",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000112",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000112"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.9802,
                    -31.7691
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000113",
                "preferredOriginID": "quakeml:quakeledger/90000113",
                "preferredMagnitudeID": "quakeml:quakeledger/90000113",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000113",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "28.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000113",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000113",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000113"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.0675,
                    -32.2127
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000114",
                "preferredOriginID": "quakeml:quakeledger/90000114",
                "preferredMagnitudeID": "quakeml:quakeledger/90000114",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000114",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "28.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000114",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000114",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000114"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.1558,
                    -32.6563
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000115",
                "preferredOriginID": "quakeml:quakeledger/90000115",
                "preferredMagnitudeID": "quakeml:quakeledger/90000115",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000115",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "28.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000115",
                "magnitude.mag.value": "8.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000115",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000115"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.611,
                    -29.9883
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000116",
                "preferredOriginID": "quakeml:quakeledger/90000116",
                "preferredMagnitudeID": "quakeml:quakeledger/90000116",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000116",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "32.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000116",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000116",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000116"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.6957,
                    -30.4319
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000117",
                "preferredOriginID": "quakeml:quakeledger/90000117",
                "preferredMagnitudeID": "quakeml:quakeledger/90000117",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000117",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "32.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000117",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000117",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000117"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.7813,
                    -30.8755
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000118",
                "preferredOriginID": "quakeml:quakeledger/90000118",
                "preferredMagnitudeID": "quakeml:quakeledger/90000118",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000118",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "32.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000118",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000118",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000118"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.8677,
                    -31.3191
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000119",
                "preferredOriginID": "quakeml:quakeledger/90000119",
                "preferredMagnitudeID": "quakeml:quakeledger/90000119",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000119",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "32.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000119",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000119",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000119"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.955,
                    -31.7627
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000120",
                "preferredOriginID": "quakeml:quakeledger/90000120",
                "preferredMagnitudeID": "quakeml:quakeledger/90000120",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000120",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "32.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000120",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000120",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000120"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -72.0433,
                    -32.2063
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000121",
                "preferredOriginID": "quakeml:quakeledger/90000121",
                "preferredMagnitudeID": "quakeml:quakeledger/90000121",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000121",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "32.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000121",
                "magnitude.mag.value": "8.5",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000121",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000121"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.4439,
                    -29.5256
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000124",
                "preferredOriginID": "quakeml:quakeledger/90000124",
                "preferredMagnitudeID": "quakeml:quakeledger/90000124",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000124",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "43.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000124",
                "magnitude.mag.value": "9.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000124",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000124"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.5303,
                    -29.9692
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000125",
                "preferredOriginID": "quakeml:quakeledger/90000125",
                "preferredMagnitudeID": "quakeml:quakeledger/90000125",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000125",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "43.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000125",
                "magnitude.mag.value": "9.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000125",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000125"
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.7059,
                    -30.8564
                ]
            },
            "properties": {
                "publicID": "quakeml:quakeledger/90000127",
                "preferredOriginID": "quakeml:quakeledger/90000127",
                "preferredMagnitudeID": "quakeml:quakeledger/90000127",
                "type": "earthquake",
                "description.text": "expert",
                "origin.publicID": "quakeml:quakeledger/90000127",
                "origin.time.value": "2018-01-01T00:00:00.000000Z",
                "origin.depth.value": "43.0",
                "origin.creationInfo.value": "GFZ",
                "magnitude.publicID": "quakeml:quakeledger/90000127",
                "magnitude.mag.value": "9.0",
                "magnitude.type": "MW",
                "magnitude.creationInfo.value": "GFZ",
                "focalMechanism.publicID": "quakeml:quakeledger/90000127",
                "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "9.0",
                "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "18.0",
                "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
            },
            "id": "quakeml:quakeledger/90000127"
        }
];


const eqParasPeru: any[] = [
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

function isString(x: any): x is string {
    return typeof x === "string" || x instanceof String;
}

function isArray(x: any): x is Array<any> {
    return Array.isArray(x);
}

function isRefUrl(s: string): boolean {
    return s.startsWith("https://") && s.includes("RetrieveResultServlet");
}


function decodeBase64Data(base64String: string): {type: string, data: Buffer} {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
        throw new Error(`Not a base-64-string: ${base64String}`);
    }

    const result = {
        type: matches[1],
        data: Buffer.from(matches[2], 'base64')
    }

    return result;
}



function mimeAndEncoding(response: Response): {mimeType: string | null, encoding: string | null} {
    let mimeType = response.headers.get('Content-Type');
    const charsetMatches = mimeType?.match(/charset=(.*)/);
    const encoding = charsetMatches ? charsetMatches[1] : response.headers.get('charset');
    if (mimeType?.includes(";")) {
        mimeType = mimeType?.split(";")[0];
    }
    return { mimeType, encoding };
}



async function saveValueToFile(eqParaId: string, serverUrl: string, port: number, datum: Datum) {
    let value = datum.value;
    await writeJsonFile(`../cache/${eqParaId}/${datum.id}.json`, value);
}

async function saveReferenceToFile(eqParaId: string, serverUrl: string, port: number, datum: DatumReference) {
    
    const response = await fetch(`${serverUrl}:${port}/files/${datum.reference}`);
    const {mimeType, encoding} = mimeAndEncoding(response);

    switch (datum.id) {
        case 'eqDamageShapefile':
        case 'tsDamageShapefile':
        case 'eqDamageShapefileChile':
        case 'tsDamageShapefileChile':
            const shapefileUrl = await response.text();
            const shapefileResponse = await fetch(shapefileUrl);
            const binaryData = await shapefileResponse.blob();
            const arrayBuffer = await binaryData.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await writeBinaryFile(`../cache/${eqParaId}/${datum.id}.shp.zip`, buffer);
            return;
        case 'eqSimGeotiffRef':
        case 'eqSimGeotiffRefChile':
            const tiffUrl = await response.text();
            const tiffResponse = await fetch(tiffUrl, {
                headers: {'Accept': 'image/geotiff'}
            });
            const {mimeType: tiffMimeType, encoding: tiffEncoding} = mimeAndEncoding(tiffResponse);
            // const binaryData2 = await tiffResponse.blob();
            // const arrayBuffer2 = await binaryData2.arrayBuffer();
            // const textResponse = await tiffResponse.text();
            const arrayBuffer2 = await tiffResponse.arrayBuffer();
            const buffer2 = Buffer.from(arrayBuffer2);
            await writeBinaryFile(`../cache/${eqParaId}/${datum.id}.geotiff`, buffer2);
            // writeFileSync(`../cache/${eqParaId}/${datum.id}.geotiff`, buffer2);
            return;
        case 'eqSimXmlRef':
        case 'eqSimXmlRefChile':
            const url = await response.text();
            const data = await fetch(url);
            const xmlText = await data.text();
            await writeTextFile(`../cache/${eqParaId}/${datum.id}.xml`, xmlText);
            return;
    }

    switch (mimeType) {
        case 'application/x-zipped-shp':
            const binaryData = await response.blob();
            const arrayBuffer = await binaryData.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await writeBinaryFile(`../cache/${eqParaId}/${datum.id}.shp.zip`, buffer);
            return;
        case 'image/geotiff':
            const binaryData2 = await response.blob();
            const arrayBuffer2 = await binaryData2.arrayBuffer();
            const buffer2 = Buffer.from(arrayBuffer2);
            await writeBinaryFile(`../cache/${eqParaId}/${datum.id}.geotiff`, buffer2);
            return;
        case 'application/json':
            const data = await response.json();
            await writeJsonFile(`../cache/${eqParaId}/${datum.id}.json`, data);
            return;
        case 'application/xml':
        case 'text/xml':
            const xmlBody = await response.text();
            await writeJsonFile(`../cache/${eqParaId}/${datum.id}.xml`, xmlBody);
            return;
        case 'text/html':
        default:
            const textData = await response.text();
            await writeTextFile(`../cache/${eqParaId}/${datum.id}.txt`, textData);
            return;
    }
}

async function writeAllDataToFiles(eqParaId: string, serverUrl: string, port: number, data: ScenarioState): Promise<void> {
    for (const datum of data.data) {
        if (isDatumReference(datum)) {
            await saveReferenceToFile(eqParaId, serverUrl, port, datum);
        } else {
            await saveValueToFile(eqParaId, serverUrl, port, datum);
        }
    }
}

function createParaPicker(eqPara: any): InputPicker {
    async function paraPicker(input: {id: string}, state: ScenarioState, scenarioId: string, stepId: string): Promise<Datum | DatumReference> {

        // 1. Some inputs with pre-determined values
        if (input.id === "exposureModelName") {
            return {
                id: input.id,
                value: "LimaBlocks"
            };
        }
        if (input.id === "exposureModelNameChile") {
            return {
                id: input.id,
                value: "ValpOBM23Region"
            }
        }
        if (input.id === "userChoice" || input.id === "userChoiceChile") {
            return {
                id: input.id,
                value: eqPara
            };
        }
        if (input.id === "schemaTs" || input.id === "schemaTsChile") {
            return {
                id: input.id,
                value: "Medina_2019"
            };
        }
        
        // 2. Some inputs which already have a value
        if (isDatumReference(input)) return input;
        if (isResolvedDatum(input)) return input;
        const foundInState = state.data.find(d => d.id === input.id);
        if (foundInState) {
            if (isDatumReference(foundInState)) return foundInState;
            if (isResolvedDatum(foundInState)) return foundInState;
        }

        // 3. Some inputs with options
        if (isDatumWithDefault(input)) return {id: input.id, value: input.default};
        if (isDatumWithOptions(input)) {
            const index = Math.floor(Math.random() * input.options.length);
            const chosenOption = input.options[index];
            return {...input, value: chosenOption};
        }

        throw Error(`Don't know how to pick a value for ${input.id}`);
    }
    return paraPicker;
}

async function runAndSave(scenarioId: "PeruShort" | "ChileShort", serverUrl: string, port: number, overwriteExisting=true) {

    const eqParas = scenarioId === "PeruShort" ? eqParasPeru : eqParasChile;

    for (const eqPara of eqParas) {
        if (!overwriteExisting && fileExists(`../cache/${eqPara.id}`)) {
            console.log(`Already have ${eqPara.id}. Moving on.`);
            continue;
        }

        try {   
            console.log(`Working on eq ${eqPara.id}`)
            const start = new Date();
    
            const inputPicker = createParaPicker(eqPara);
    
            const state = await runScenario(serverUrl, port, scenarioId, inputPicker, false, false);
    
            await writeAllDataToFiles(eqPara.id, serverUrl, port, state);
    
            const end = new Date();
            const diff = ((end.getTime() - start.getTime()) / 1000.0).toFixed(2);
            console.log(`took ${diff} seconds`);
        } catch (error) {
            console.error(error);
            writeTextFile("./error.json", (error as any).message);
            // throw error;
        }
    }

}


runAndSave("ChileShort", "http://localhost", 8008, false);