import { WpsProcess } from '../control/wpsProcess';
import { WpsDataDescription } from 'projects/services-wps/src/public_api';




export class EqGroundMotion implements WpsProcess {
    
    readonly id: string = "org.n52.wps.python.algorithm.ShakemapProcess"; 

    readonly url: string = "https://riesgos.52north.org/wps/WebProcessingService";    
    
    readonly inputDescriptions: WpsDataDescription[] = [{
            id: "quakeml-input", 
            format: "application/vnd.geo+json",
            reference: false, 
            type: "complex"
        }];
    
    readonly outputDescription: WpsDataDescription = {
        id: "shakemap-output", 
        type: "complex",
        reference: false,
        format: "application/WMS"
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