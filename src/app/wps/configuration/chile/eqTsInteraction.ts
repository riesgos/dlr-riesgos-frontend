import { ProcessDescription } from '../configurationProvider';




export const EqTsInteraction: ProcessDescription = {

   id: "org.n52.project.riesgos.GetEpicentersProcess",

    url: "http://tsunami-riesgos.awi.de:8080/wps/WebProcessingService", 

    name: "Earthquake/tsunami interaction", 

    description: "Relates a tsunami to a given earthquake", 

    requiredProducts: [{
            id: "input-boundingbox",
            reference: false,
            type: "bbox",
            data: null
        }],

    providedProduct: {
            id: "epicenters",
            reference: false,
            format: "application/vnd.geo+json",
            type: "complex",
            data: null
    }, 

    wpsVersion: "1.0.0"

}