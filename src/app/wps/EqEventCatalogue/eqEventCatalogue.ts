import { WpsProcess } from '../control/wpsProcess';
import { WpsDataDescription } from 'projects/services-wps/src/public_api';




export class EqEventCatalogue implements WpsProcess {
    
    readonly id: string = "org.n52.wps.python.algorithm.QuakeMLProcessBBox"; 

    readonly url: string = "https://riesgos.52north.org/wps/WebProcessingService";    
    
    readonly inputDescriptions: WpsDataDescription[] = [{
            id: "input-boundingbox", 
            type: "bbox",
            reference: false,
            description: "Please select an area of interest", 
            defaultValue: [-75.00, -35.00, -65.00, -30.00],
        },{
            id: "mmin", 
            type: "literal", 
            description: "minimum magnitude", 
            reference: false, 
            defaultValue: "6.0",
        },{
            id: "mmax", 
            description: "maximum magnitude", 
            defaultValue: "8.0",
            type: "literal", 
            reference: false
        }, {
            id: "zmin", 
            description: "minimum depth",
            defaultValue: "0",
            type: "literal", 
            reference: false
        },{
            id: "zmax", 
            description: "maximum depth",
            defaultValue: "100", 
            type: "literal", 
            reference: false
        },{
            id: "p",
            description: "p",
            type: "literal", 
            reference: false,
            defaultValue: "0.1",
        },{
            id: "etype", 
            description: "etype", 
            defaultValue: "deaggregation", 
            reference: false, 
            type: "literal"
        },{
            id: "tlon", 
            description: "longitude [decimal degrees]",
            defaultValue: "5.00",
            reference: false, 
            type: "literal"
        },{
            id: "tlat", 
            description: "latitude [decimal degrees]", 
            defaultValue: "-35.00", 
            reference: false, 
            type: "literal"
        }
    ];
    
    readonly outputDescription: WpsDataDescription = {
        id: "selected-rows", 
        format: "application/vnd.geo+json",
        reference: false,
        type: "complex"
    };


    processId(): string {
        return this.id;
    }

    providesProducts(): string[] {
        return [this.outputDescription.id];
    }

    requiresProducts(): string[] {
        return this.inputDescriptions.map(inpt => inpt.id);
    }

}