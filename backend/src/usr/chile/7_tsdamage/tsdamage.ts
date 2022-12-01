import { Datum, Step } from "../../../scenarios/scenarios";
import { getNeptunusTsunamiDamage, getFragility } from "../../wpsServices";


async function tsDamage(inputs: Datum[]) {

    const chosenFragility = inputs.find(i => i.id === 'schemaTsChile')!;
    const updatedExposureRef = inputs.find(i => i.id === 'eqDamageRefChile')!;
    const tsWms = inputs.find(i => i.id === 'tsWmsChile')!;



    const tsunamiWmsUrl = tsWms.value;
    const layerId = tsunamiWmsUrl.match(/geoserver\/(\d+)\/ows/)[1];
    const valpaBbox = '-71.939,-33.371,-71.205,-32.848';
    const w = 2048;
    const h = 2048;
    const parameter = 'mwhLand_local';
    let tsunamiGeoTiffRequest = tsunamiWmsUrl.replace('wms', 'WCS');
    tsunamiGeoTiffRequest = tsunamiGeoTiffRequest.replace('1.3.0', '1.0.0');
    tsunamiGeoTiffRequest = tsunamiGeoTiffRequest.replace('GetCapabilities', 'GetCoverage');
    tsunamiGeoTiffRequest += `&format=image/geotiff&COVERAGE=${layerId}_${parameter}&bbox=${valpaBbox}&CRS=EPSG:4326&width=${w}&height=${h}`;

    const fragilityRef = await getFragility(chosenFragility.value);
    
    const { wms, summary } = await getNeptunusTsunamiDamage('SARA_v1.0', fragilityRef, tsunamiGeoTiffRequest, updatedExposureRef.value);
  

    return [{
        id: 'tsDamageWmsChile',
        value: wms
    }, {
        id: 'tsDamageSummaryChile',
        value: summary
    }];
}



export const step: Step = {
    id: 'TsDamageChile',
    title: 'Multihazard_damage_estimation/Tsunami',
    description: 'ts_damage_svc_description',
    inputs: [{
        id: 'schemaTsChile',
        options: ['Medina_2019', 'SUPPASRI2013_v2.0']
    }, {
        id: 'tsWmsChile'
    }, {
        id: 'eqDamageRefChile',
    }],
    outputs: [{
        id: 'tsDamageWmsChile'
    }, {
        id: 'tsDamageSummaryChile'
    }],
    function: tsDamage
};
