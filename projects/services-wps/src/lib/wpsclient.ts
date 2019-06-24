import { WpsMarshaller, WpsInput, WpsVerion, WpsResult, WpsOutputDescription } from "./wps_datatypes";
import { WpsFactory100 } from "./wps100/wps_1.0.0_factory";
import { WpsFactory200 } from "./wps200/wps_2.0_factory";
import { Cache } from "./utils/cache";
import { Observable, timer, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { Jsonix } from '@boundlessgeo/jsonix'; //let Jsonix = require('jsonix').Jsonix;
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import * as XLink_1_0_Factory from 'w3c-schemas/lib/XLink_1_0'; let XLink_1_0 = XLink_1_0_Factory.XLink_1_0; //let XLink_1_0 = require('w3c-schemas/lib/XLink_1_0').XLink_1_0;
import * as OWS_1_1_0_Factory from 'ogc-schemas/lib/OWS_1_1_0'; let OWS_1_1_0 = OWS_1_1_0_Factory.OWS_1_1_0; //let OWS_1_1_0 = require('ogc-schemas/lib/OWS_1_1_0').OWS_1_1_0;
import * as OWS_2_0_Factory from 'ogc-schemas/lib/OWS_2_0'; let OWS_2_0 = OWS_2_0_Factory.OWS_2_0; //let OWS_2_0 = require('ogc-schemas/lib/OWS_2_0').OWS_2_0;
import * as WPS_1_0_0_Factory from 'ogc-schemas/lib/WPS_1_0_0'; let WPS_1_0_0 = WPS_1_0_0_Factory.WPS_1_0_0; //let WPS_1_0_0 = require('ogc-schemas/lib/WPS_1_0_0').WPS_1_0_0;
import * as WPS_2_0_Factory from 'ogc-schemas/lib/WPS_2_0'; import { doAfter, doUntil, poll, pollUntil } from "./utils/polling";
import { Injectable } from '@angular/core';
let WPS_2_0 = WPS_2_0_Factory.WPS_2_0; //let WPS_2_0 = require('ogc-schemas/lib/WPS_2_0').WPS_2_0;


/**
 * The Wps-client abstracts away the differences between Wps1.0.0 and Wps2.0.0
 * There are two layers of marshalling: 
 *  - the Wps-marshaller marshals user-facing data to wps-specific types
 *  - Jsonix marshals wps-specific data to xml.
 * user-facing data -> wpsmarshaller -> Wps-type-specific data -> Jsonix-marhsaller -> XML -> webclient -> WPS -> XML -> Jsonix-unmarshaller -> Wps-type-specific data -> wpsmarshaller -> user-facing data
 */
@Injectable()
export class WpsClient {

    private version: WpsVerion;
    private xmlmarshaller;
    private xmlunmarshaller;
    private wpsmarshaller: WpsMarshaller;
    private cache: Cache;


    constructor(version: WpsVerion = "1.0.0", private webclient: HttpClient) {
        this.cache = new Cache();
        this.version = version;
        let context;
        if (this.version == "1.0.0") {
            this.wpsmarshaller = new WpsFactory100();
            context = new Jsonix.Context([XLink_1_0, OWS_1_1_0, WPS_1_0_0]);
        }
        else if (this.version == "2.0.0") {
            this.wpsmarshaller = new WpsFactory200();
            context = new Jsonix.Context([XLink_1_0, OWS_2_0, WPS_2_0]);
        }
        this.xmlunmarshaller = context.createUnmarshaller();
        this.xmlmarshaller = context.createMarshaller();
    }


    getCapabilities(url: string): Observable<any> {
        let getCapabilitiesUrl = this.wpsmarshaller.getCapabilitiesUrl(url);
        let headers = new HttpHeaders({
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        });
        return this.webclient.get(getCapabilitiesUrl, { headers: headers, responseType: 'text' }).pipe(
            map(response => {
                return this.xmlunmarshaller.unmarshalString(response)
            }),
            map(responseJson => {
                return this.wpsmarshaller.unmarshalCapabilities(responseJson.value)
            }) // @TODO: handle case when instead of WpsCapabilites an ExceptionReport is returned
        );
    }


    describeProcess(processId: string): Observable<any> {
        throw new Error("Not implemented yet")
    }


    executeAsync(url: string, processId: string, inputs: WpsInput[], output: WpsOutputDescription, pollingRate: number = 1000, tapFunction?: (response: any) => void): Observable<WpsResult[]> {
        
        const executeRequest = this.execute(url, processId, inputs, output, true);

        const cachedResponse = this.cache.get(executeRequest);
        if(cachedResponse) return of(cachedResponse); 

        return executeRequest.pipe(
            switchMap(executeResponse => {
                const getStateRequest = this.checkState(executeResponse[0].data);
                return pollUntil(
                    getStateRequest, 
                    pollingRate,
                    (stateResponse) => {
                        const resultsObtained = stateResponse[0].type != "status";
                        return resultsObtained;
                    },
                    tapFunction
                )
            }),
            tap( response => this.cache.set(executeRequest, response) )
        );

    }

    execute(url: string, processId: string, inputs: WpsInput[], output: WpsOutputDescription, async: boolean): Observable<WpsResult[]> {

        const executeUrl = this.wpsmarshaller.executeUrl(url, processId);
        const execbody = this.wpsmarshaller.marshalExecBody(processId, inputs, output, async);
        const xmlExecbody = this.xmlmarshaller.marshalString(execbody);

        const headers = new HttpHeaders({
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        });
        return this.webclient.post(executeUrl, xmlExecbody, { headers: headers, responseType: 'text' }).pipe(
            map(xmlResponse => {
                const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
                const output = this.wpsmarshaller.unmarshalExecuteResponse(jsonResponse);
                return output;
            })
        );
    }

    private checkState(statusUrl: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        });
        return this.webclient.get(statusUrl, {headers: headers, responseType: 'text'}).pipe(
            map( xmlResponse => {
                const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
                const output = this.wpsmarshaller.unmarshalExecuteResponse(jsonResponse);
                return output;
            })
        ); 
    }

    dismiss(processId: string): Observable<any> {
        throw new Error("Not implemented yet")
    }
}
