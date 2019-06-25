import { ProcessDescription } from '../configurationProvider';




export const EqGroundMotion : ProcessDescription = {

    id: "org.n52.wps.python.algorithm.ShakemapProcess",

    url: "https://riesgos.52north.org/wps/WebProcessingService",

    name: "Groundmotion Simulation", 

    description: "Simulates the ground motion caused by a given eathquakes parameters",

    requiredProducts: [{
            id: "quakeml-input",
            data: null,
            format: "application/vnd.geo+json",
            reference: false,
            type: "complex"
        }],

    providedProduct: {
            id: "shakemap-output",
            data: null,
            type: "complex",
            reference: false,
            format: "application/WMS"
        }, 

    wpsVersion: "1.0.0"

}