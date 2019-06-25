import { ProcessDescription } from '../configurationProvider';




export const EqEventCatalogue: ProcessDescription = {

        id: "org.n52.wps.python.algorithm.QuakeMLProcessBBox",

        url: "https://riesgos.52north.org/wps/WebProcessingService",

        name: "Earthquake Catalogue",

        description: "Catalogue of historical earthquakes.",

        requiredProducts: [{
            id: "input-boundingbox",
            type: "bbox",
            fieldtype: "string",
            data: null,
            reference: false,
            description: "Please select an area of interest",
            defaultValue: [-75.00, -35.00, -65.00, -30.00],
        }, {
            id: "mmin",
            data: null,
            type: "literal",
            fieldtype: "string",
            description: "minimum magnitude",
            reference: false,
            defaultValue: "6.0",
        }, {
            id: "mmax",
            data: null,
            description: "maximum magnitude",
            defaultValue: "8.0",
            type: "literal",
            fieldtype: "string",
            reference: false
        }, {
            id: "zmin",
            data: null,
            description: "minimum depth",
            defaultValue: "0",
            type: "literal",
            fieldtype: "string",
            reference: false
        }, {
            id: "zmax",
            data: null,
            description: "maximum depth",
            defaultValue: "100",
            type: "literal",
            fieldtype: "string",
            reference: false
        }, {
            id: "p",
            data: null,
            description: "p",
            type: "literal",
            fieldtype: "string",
            reference: false,
            defaultValue: "0.1",
        }, {
            id: "etype",
            data: null,
            description: "etype",
            defaultValue: "deaggregation",
            reference: false,
            type: "literal",
            fieldtype: "string",
        }, {
            id: "tlon",
            data: null,
            description: "longitude [decimal degrees]",
            defaultValue: "5.00",
            reference: false,
            fieldtype: "string",
            type: "literal"
        }, {
            id: "tlat",
            data: null,
            description: "latitude [decimal degrees]",
            defaultValue: "-35.00",
            reference: false,
            fieldtype: "string",
            type: "literal"
        }],

        providedProduct: {
            id: "selected-rows",
            data: null,
            format: "application/vnd.geo+json",
            reference: false,
            type: "complex"
        }, 

        wpsVersion: "1.0.0"

}