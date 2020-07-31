import { WpsProcess, Product } from '../../riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { HttpClient } from '@angular/common/http';
import { WpsData } from '@dlr-eoc/services-ogc';


const personToGreet: WpsData & Product = {
    uid: 'personToGreet',  // frontend-wide
    description: {
        id: 'person',  // the id of the input on the WPS
        reference: false,
        type: 'literal',
    },
    value: null  // we expect this value to be 
};

/**
 * Implements ...
 *  - WpsData: something that is returned from a WPS, and ...
 *  - Product: something that can be passed from service to service in the frontend.
 * Note that there are many useful subtypes of `Product`, like `StringSelectUconfProduct`, `VectorLayerProduct`, etc.
 * Many of these contain additional information that is required to display the product on a map. 
 */
const greeting: WpsData & Product = {
    // frontend-wide unique.
    uid: 'greeting',
    description: {
        // the id of the product on the WPS
        id: 'greeting',
        // whether to return a reference (a url pointing to the actual result) or to return the literal result immediately.
        reference: false,
        type: 'literal'
    },
    value: null // ... null, as of yet. But that value will be set by `MyGreeterService`
};


/**
 * Our new service.
 *  - Implements WpsProcess: this is to describe a remote WPS that can be executed from the frontend.
 *  - Implements WizzardableProcess: this adds additional information to be displayed in the configuration-wizard. 
 */
export class MyGreeterService extends WpsProcess implements WizardableProcess {
    wizardProperties: WizardProperties;

    constructor(httpClient: HttpClient) {
        const uid = 'myGreeterService';  // frontend-wide
        const id = 'GreeterService';   // id of process on WPS
        const name = 'My greeter service';
        const description = 'A simple greeter';
        const serviceUrl = 'https://myserver.org/wps';
        const wpsVersion = '1.0.0';
        super(uid, name, [personToGreet.uid], [greeting.uid], id, description, serviceUrl, wpsVersion, httpClient);

        this.wizardProperties = {
            providerName: 'My Company',
            providerUrl: 'mycompany.org',
            shape: 'bolt',   // what logo to use to the left of the service-name?
        };
    }
}