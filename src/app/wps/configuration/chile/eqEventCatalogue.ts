import { Process, ProcessState } from '../../control/wps.datatypes';




export const EqEventCatalogue: Process = {

    state: ProcessState.unavailable,

    id: "org.n52.wps.python.algorithm.QuakeMLProcessBBox",

    url: "https://riesgos.52north.org/wps/WebProcessingService",

    name: "Earthquake Catalogue",

    description: "Catalogue of historical earthquakes.",

    requiredProducts: [{
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
    }],

    providedProduct: {
        id: "selected-rows",
        format: "application/vnd.geo+json",
        reference: false,
        type: "complex"
    },

    wpsVersion: "1.0.0"

}