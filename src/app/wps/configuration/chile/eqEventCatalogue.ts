import { Process, ProcessState } from '../../control/wps.datatypes';
import { UserconfigurableWpsDataDescription } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerDescription } from 'src/app/components/map/mappable_wpsdata';
import {Style, Fill, Stroke, Circle, Text} from 'ol/style';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';




const requiredProducts: UserconfigurableWpsDataDescription[] = [{
    id: "input-boundingbox",
    type: "bbox",
    fieldtype: "string",
    reference: false,
    description: "Please select an area of interest",
    defaultValue: [-75.00, -35.00, -65.00, -30.00],
}, {
    id: "mmin",
    type: "literal",
    fieldtype: "string",
    description: "minimum magnitude",
    reference: false,
    defaultValue: "6.0",
}, {
    id: "mmax",
    description: "maximum magnitude",
    defaultValue: "8.0",
    type: "literal",
    fieldtype: "string",
    reference: false
}, {
    id: "zmin",
    description: "minimum depth",
    defaultValue: "0",
    type: "literal",
    fieldtype: "string",
    reference: false
}, {
    id: "zmax",
    description: "maximum depth",
    defaultValue: "100",
    type: "literal",
    fieldtype: "string",
    reference: false
}, {
    id: "p",
    description: "p",
    type: "literal",
    fieldtype: "string",
    reference: false,
    defaultValue: "0.1",
}, {
    id: "etype",
    description: "etype",
    defaultValue: "deaggregation",
    reference: false,
    type: "literal",
    fieldtype: "string",
}, {
    id: "tlon",
    description: "longitude [decimal degrees]",
    defaultValue: "5.00",
    reference: false,
    fieldtype: "string",
    type: "literal"
}, {
    id: "tlat",
    description: "latitude [decimal degrees]",
    defaultValue: "-35.00",
    reference: false,
    fieldtype: "string",
    type: "literal"
}];



let green2red = function (magnitude) {
    const range = 9.5 - 5;
    const part = magnitude - 5;
    let perc = 360.0 * part / range;
    perc = Math.floor(perc);
    return `hsl(${perc}, 100%, 50%)`;
}


const output: VectorLayerDescription = {
    id: "selected-rows",
    format: "application/vnd.geo+json",
    reference: false,
    type: "complex", 
    style: (feature) => {
        let magnitude = feature.get("magnitude.mag.value");
        let style = new Style({
            image: new Circle({
              radius: (magnitude - 6.0)*10.0,
              fill: new Fill({
                  color: green2red(magnitude), 
                }),
              stroke: new Stroke({
                color: [0,0,0], 
                width: 1
              }), 
            })
        });
        return style;
    }, 
    text: (properties) => {
        let text = `<h3>Id: ${properties["origin.publicID"]}</h3>`;//`<h3>${dateFromISO8601(feature.get("origin.time.value"))} (Id: ${feature.getId()})</h3>`;
        let selectedProperties = {
            "Magnitude": properties["magnitude.mag.value"],
            "Depth": properties["origin.depth.value"] + " m",
            "Dip value": properties["focalMechanism.nodalPlanes.nodalPlane1.dip.value"] + " °"
        };
        text += "<table class='table'><tbody>";
        for(let property in selectedProperties) {
            let propertyValue = selectedProperties[property];
            text += `<tr><td>${property}</td> <td>${propertyValue}</td></tr>`;
        }
        text += "</tbody></table>";
        return text;
    }
}



export const EqEventCatalogue: WizardableProcess = {
    state: ProcessState.unavailable,
    id: "org.n52.wps.python.algorithm.QuakeMLProcessBBox",
    url: "https://riesgos.52north.org/wps/WebProcessingService",
    name: "Earthquake Catalogue",
    description: "Catalogue of historical earthquakes.",
    requiredProducts: requiredProducts,
    providedProduct: output,
    wpsVersion: "1.0.0", 
    shape: "earthquake"
}