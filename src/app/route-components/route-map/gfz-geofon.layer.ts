import { Vector as OlVectorLayer } from 'ol/layer';
import { Vector as OlVectorSource } from 'ol/source';
import { GeoJSON as OlGeoJSON } from 'ol/format';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
import { CustomLayer } from '@ukis/services-layers';


function buildStyle(feature) {
    const mag = feature.get('magnitude')
    const text = "Mag: " + mag + " Depth: " + feature.get('depth') + "km"
        + "\n(" + feature.get("date") + ")";

    const radius_scaled = Math.max(3, mag + (Math.pow(mag, 2) / 5));
    return [new Style({
        image: new Circle({
            radius: radius_scaled,
            fill: new Fill({ color: '#333' }),
            stroke: new Stroke({ color: '#ccc', width: 1 })
        }),
        text: new Text({
            font: '11px Calibri,sans-serif',
            fill: new Fill({ color: '#333' }),
            offsetY: radius_scaled + 18,
            text: text,
            stroke: new Stroke({
                color: '#fff',
                width: 2
            })
        })
    })];
}

export function geofonCustomLayer() {
    return new CustomLayer({
        name: 'geofon',
        displayName: 'GEOFON GFZ Potsdam (last 14 days)',
        id: 'geofon',
        visible: false,
        type: 'custom',
        removable: false,
        attribution: '<a href="https://geofon.gfz-potsdam.de/">GEOFON GFZ Potsdam</a>.',
        opacity: 1,
        custom_layer: new OlVectorLayer({
            title: 'geofon',
            source: new OlVectorSource({
                url: 'https://wt-e83c9b1d8d7232532be8f3d0e8009520-0.sandbox.auth0-extend.com/geofon-get-latest',
                format: new OlGeoJSON()
            }),
            style: buildStyle
        })
    })
}