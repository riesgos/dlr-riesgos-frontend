import { WpsProcess } from '../control/wpsProcess';
import { WpsDataDescription } from 'projects/services-wps/src/public_api';




export class EqTsInteraction implements WpsProcess {

    readonly id: string = "org.n52.project.riesgos.GetEpicentersProcess"; 
    
    readonly url: string = "http://tsunami-riesgos.awi.de:8080/wps/WebProcessingService";    
    
    readonly inputDescriptions: WpsDataDescription[] = [{
        id: "input-boundingbox",
        reference: false,
        type: "bbox"
    }];
    
    readonly outputDescription: WpsDataDescription = {
        id: "epicenters",
        reference: false, 
        format: "application/vnd.geo+json",
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