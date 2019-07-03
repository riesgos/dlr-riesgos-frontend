import { Process, ProcessState, WpsProcess } from '../../wps/wps.datatypes';
import { UserconfigurableWpsDataDescription, UserconfigurableWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerDescription, BboxLayerDescription, VectorLayerData, BboxLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style, Fill, Stroke, Circle, Text } from 'ol/style';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { UtilStoreService } from '@ukis/services-util-store';



export const inputBoundingbox: UserconfigurableWpsData & BboxLayerData = {
    description: {
        id: "input-boundingbox",
        type: "bbox",
        reference: false,
        description: "Please select an area of interest",
        defaultValue: [-75.00, -35.00, -65.00, -30.00],
        wizardProperties: {
            name: "AOI",
            fieldtype: "bbox",
        },
    },
    value: null
}

export const mmin: UserconfigurableWpsData = {
    description: {
        id: "mmin",
        type: "literal",
        wizardProperties: {
            name: "mmin",
            fieldtype: "string",
        },
        description: "minimum magnitude",
        reference: false,
        defaultValue: "6.0",
    },
    value: null
}


export const mmax: UserconfigurableWpsData = {
    description: {
        id: "mmax",
        type: "literal",
        wizardProperties: {
            name: "mmax",
            fieldtype: "string",
        },
        description: "maximum magnitude",
        reference: false,
        defaultValue: "9.0",
    },
    value: null
}


export const zmin: UserconfigurableWpsData = {
    description: {
        id: "zmin",
        description: "minimum depth",
        defaultValue: "0",
        type: "literal",
        wizardProperties: {
            name: "zmin",
            fieldtype: "string",
        },
        reference: false
    },
    value: null
};

export const zmax: UserconfigurableWpsData = {
    description: {
        id: "zmax",
        description: "maximum depth",
        defaultValue: "100",
        type: "literal",
        wizardProperties: {
            name: "zmax",
            fieldtype: "string",
        },
        reference: false
    },
    value: null
}


export const p: UserconfigurableWpsData = {
    description: {
        id: "p",
        description: "p",
        type: "literal",
        wizardProperties: {
            name: "p",
            fieldtype: "string",
        },
        reference: false,
        defaultValue: "0.1",
    },
    value: null
};


export const etype: UserconfigurableWpsData = {
    description: {
        id: "etype",
        description: "etype",
        defaultValue: "deaggregation",
        reference: false,
        type: "literal",
        wizardProperties: {
            name: "Catalogue type",
            fieldtype: "string",
        },
    },
    value: null
};

export const tlon: UserconfigurableWpsData = {
    description: {
        id: "tlon",
        description: "longitude [decimal degrees]",
        defaultValue: "5.00",
        reference: false,
        wizardProperties: {
            name: "tlon",
            fieldtype: "string",
        },
        type: "literal"
    },
    value: null
};


export const tlat: UserconfigurableWpsData = {
    description: {
        id: "tlat",
        description: "latitude [decimal degrees]",
        defaultValue: "-35.00",
        reference: false,
        wizardProperties: {
            name: "tlat",
            fieldtype: "string",
        },
        type: "literal"
    },
    value: null
}




let green2red = function (magnitude) {
    const range = 9.5 - 5;
    const part = magnitude - 5;
    let perc = 360.0 * part / range;
    perc = Math.floor(perc);
    return `hsl(${perc}, 100%, 50%)`;
}


export const selectedEqs: VectorLayerData = {
    description: {
        id: "selected-rows",
        format: "application/vnd.geo+json",
        reference: false,
        type: "complex",

        vectorLayerAttributes: {
            style: (feature) => {
                let magnitude = feature.get("magnitude.mag.value");
                let style = new Style({
                    image: new Circle({
                        radius: (magnitude - 6.0) * 10.0,
                        fill: new Fill({
                            color: green2red(magnitude),
                        }),
                        stroke: new Stroke({
                            color: [0, 0, 0],
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
                for (let property in selectedProperties) {
                    let propertyValue = selectedProperties[property];
                    text += `<tr><td>${property}</td> <td>${propertyValue}</td></tr>`;
                }
                text += "</tbody></table>";
                return text;
            }
        }
    },
    value: null
}



export const EqEventCatalogue: WizardableProcess & WpsProcess = {
    state: ProcessState.unavailable,
    id: "org.n52.wps.python.algorithm.QuakeMLProcessBBox",
    url: "https://riesgos.52north.org/wps/WebProcessingService",
    name: "Earthquake Catalogue",
    description: "Catalogue of historical earthquakes.",
    requiredProducts: ["input-boundingbox", "mmin", "mmax", "zmin", "zmax", "p", "etype", "tlon", "tlat"],
    providedProduct: "selected-rows",
    wpsVersion: "1.0.0",

    wizardProperties: {
        shape: "earthquake"
    }
}