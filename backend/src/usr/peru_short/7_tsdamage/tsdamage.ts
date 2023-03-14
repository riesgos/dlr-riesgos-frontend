import { Datum, Step } from "../../../scenarios/scenarios";
import { getNeptunusTsunamiDamage, getFragility } from "../../wpsServices";


async function tsDamage(inputs: Datum[]) {

    const chosenFragility = inputs.find(i => i.id === 'schemaTs')!;
    const updatedExposureRef = inputs.find(i => i.id === 'eqDamageRef')!;
    const tsWms = inputs.find(i => i.id === 'tsWms')!;



    const tsunamiWmsUrl = tsWms.value;
    const layerId = tsunamiWmsUrl.match(/geoserver\/(\d+)\/ows/)[1];
    const limaBbox = '-77.39,-12.53,-76.56,-11.69';
    const w = 2048;
    const h = 2048;
    const parameter = 'mwhLand_local';
    let tsunamiGeoTiffRequest = tsunamiWmsUrl.replace('wms', 'WCS');
    tsunamiGeoTiffRequest = tsunamiGeoTiffRequest.replace('1.3.0', '1.0.0');
    tsunamiGeoTiffRequest = tsunamiGeoTiffRequest.replace('GetCapabilities', 'GetCoverage');
    tsunamiGeoTiffRequest += `&format=image/geotiff&COVERAGE=${layerId}_${parameter}&bbox=${limaBbox}&CRS=EPSG:4326&width=${w}&height=${h}`;

    const fragilityRef = await getFragility(chosenFragility.value);
    
    const { wms, summary } = await getNeptunusTsunamiDamage('SARA_v1.0', fragilityRef, tsunamiGeoTiffRequest, updatedExposureRef.value);
  

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
        id: 'schemaTs',
        options: ['Medina_2019', 'SUPPASRI2013_v2.0'],
        default: 'Medina_2019'
    }, {
        id: 'tsWms'
    }, {
        id: 'eqDamageRef',
    }],
    outputs: [{
        id: 'tsDamageWms'
    }, {
        id: 'tsDamageSummary'
    }],
    function: tsDamage
};
