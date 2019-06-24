import { WpsProcess } from '../control/wpsProcess';
import { WpsDataDescription } from 'projects/services-wps/src/public_api';




export class TsPhysicalSimulation implements WpsProcess {

    readonly id: string = "get_tsunamap";
    
    readonly url: string = "http://tsunami-wps.awi.de/wps";    
    
    readonly inputDescriptions: WpsDataDescription[] = [{
        id: "lat",
        reference: false, 
        type: "literal"
    }, {
        id: "lon", 
        reference: false, 
        type: "literal"
    }, {
        id: "mag", 
        reference: false, 
        type: "literal"
    }];
    
    readonly outputDescription: WpsDataDescription = {
        id: "tsunamap", 
        type: "complex", 
        format: "application/xml",
        reference: false
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