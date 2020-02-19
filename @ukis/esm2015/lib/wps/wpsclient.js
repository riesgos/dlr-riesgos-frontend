/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wpsclient.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { WpsMarshaller100 } from './wps100/wps_marshaller_1.0.0';
import { WpsMarshaller200 } from './wps200/wps_marshaller_2.0.0';
import { of } from 'rxjs';
import { map, switchMap, tap, share, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as XLink_1_0_Factory from 'w3c-schemas/lib/XLink_1_0';
/** @type {?} */
const XLink_1_0 = XLink_1_0_Factory.XLink_1_0;
import * as OWS_1_1_0_Factory from 'ogc-schemas/lib/OWS_1_1_0';
/** @type {?} */
const OWS_1_1_0 = OWS_1_1_0_Factory.OWS_1_1_0;
import * as OWS_2_0_Factory from 'ogc-schemas/lib/OWS_2_0';
/** @type {?} */
const OWS_2_0 = OWS_2_0_Factory.OWS_2_0;
import * as WPS_1_0_0_Factory from 'ogc-schemas/lib/WPS_1_0_0';
/** @type {?} */
const WPS_1_0_0 = WPS_1_0_0_Factory.WPS_1_0_0;
import * as WPS_2_0_Factory from 'ogc-schemas/lib/WPS_2_0';
/** @type {?} */
const WPS_2_0 = WPS_2_0_Factory.WPS_2_0;
import { pollUntil, delayedRetry } from './utils/polling';
import { Injectable, Inject } from '@angular/core';
import { Jsonix } from '@boundlessgeo/jsonix';
import { FakeCache } from './cache';
/**
 * The Wps-client abstracts away the differences between Wps1.0.0 and Wps2.0.0
 * There are two layers of marshalling:
 *  - the Wps-marshaller marshals user-facing data to wps-specific types
 *  - Jsonix marshals wps-specific data to xml.
 * user-facing data -> wpsmarshaller -> Wps-type-specific data -> Jsonix-marhsaller -> XML ->
 * -> webclient -> WPS -> XML -> Jsonix-unmarshaller -> Wps-type-specific data -> wpsmarshaller -> user-facing data
 */
export class WpsClient {
    /**
     * @param {?=} version
     * @param {?=} webclient
     * @param {?=} cache
     */
    constructor(version = '1.0.0', webclient, cache) {
        this.webclient = webclient;
        this.cache = new FakeCache();
        this.version = version;
        if (cache)
            this.cache = cache;
        /** @type {?} */
        let context;
        if (this.version === '1.0.0') {
            this.wpsmarshaller = new WpsMarshaller100();
            context = new Jsonix.Context([XLink_1_0, OWS_1_1_0, WPS_1_0_0]);
        }
        else if (this.version === '2.0.0') {
            this.wpsmarshaller = new WpsMarshaller200();
            context = new Jsonix.Context([XLink_1_0, OWS_2_0, WPS_2_0]);
        }
        else {
            throw new Error('You entered a WPS version other than 1.0.0 or 2.0.0.');
        }
        this.xmlunmarshaller = context.createUnmarshaller();
        this.xmlmarshaller = context.createMarshaller();
    }
    /**
     * @param {?} url
     * @return {?}
     */
    getCapabilities(url) {
        /** @type {?} */
        const getCapabilitiesUrl = this.wpsmarshaller.getCapabilitiesUrl(url);
        return this.getRaw(getCapabilitiesUrl).pipe(map((/**
         * @param {?} response
         * @return {?}
         */
        (response) => {
            /** @type {?} */
            const responseJson = this.xmlunmarshaller.unmarshalString(response);
            return this.wpsmarshaller.unmarshalCapabilities(responseJson.value);
        })) // @TODO: handle case when instead of WpsCapabilites an ExceptionReport is returned
        );
    }
    /**
     * @param {?} processId
     * @return {?}
     */
    describeProcess(processId) {
        throw new Error('Not implemented yet');
    }
    /**
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?=} pollingRate
     * @param {?=} tapFunction
     * @return {?}
     */
    executeAsync(url, processId, inputs, outputs, pollingRate = 1000, tapFunction) {
        /** @type {?} */
        const executeRequest$ = this.executeAsyncS(url, processId, inputs, outputs);
        /** @type {?} */
        const query$ = executeRequest$.pipe(
        // poll until suceeded
        mergeMap((/**
         * @param {?} currentState
         * @return {?}
         */
        (currentState) => {
            /** @type {?} */
            const nextState$ = this.getNextState(currentState, url, processId, inputs, outputs);
            /** @type {?} */
            const poll$ = pollUntil(nextState$, (/**
             * @param {?} response
             * @return {?}
             */
            (response) => {
                return response.status === 'Succeeded';
            }), tapFunction, pollingRate);
            return poll$;
        })), 
        // fetch results
        mergeMap((/**
         * @param {?} lastState
         * @return {?}
         */
        (lastState) => {
            return this.fetchResults(lastState, url, processId, inputs, outputs);
        })), 
        // In case of errors:
        tap((/**
         * @param {?} response
         * @return {?}
         */
        (response) => {
            for (const result of response) {
                if (result.description.type === 'error') {
                    console.log('server responded with 200, but body contained an error-result: ', result);
                    throw new Error(result.value);
                }
            }
        })));
        return this.cachedQuery(url, processId, inputs, outputs, query$);
    }
    /**
     * @private
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} query$
     * @return {?}
     */
    cachedQuery(url, processId, inputs, outputs, query$) {
        /** @type {?} */
        const cachedResponse$ = this.cache.get({ url, processId, inputs, outputs });
        return cachedResponse$.pipe(switchMap((/**
         * @param {?} results
         * @return {?}
         */
        (results) => {
            if (results) {
                return of(results);
            }
            else {
                return query$.pipe(tap((/**
                 * @param {?} response
                 * @return {?}
                 */
                (response) => {
                    this.cache.set({ url, processId, inputs, outputs }, response);
                })));
            }
        })));
    }
    /**
     * @private
     * @param {?} currentState
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    getNextState(currentState, serverUrl, processId, inputs, outputDescriptions) {
        /** @type {?} */
        let request$;
        if (this.version === '1.0.0') {
            if (!currentState.statusLocation) {
                throw Error('No status location');
            }
            request$ = this.getRaw(currentState.statusLocation);
        }
        else if (this.version === '2.0.0') {
            if (!currentState.jobID) {
                throw Error('No job-Id');
            }
            /** @type {?} */
            const execbody = this.wpsmarshaller.marshallGetStatusBody(serverUrl, processId, currentState.jobID);
            /** @type {?} */
            const xmlExecbody = this.xmlmarshaller.marshalString(execbody);
            request$ = this.postRaw(serverUrl, xmlExecbody);
        }
        else {
            throw new Error(`'GetStatus' has not yet been implemented for this WPS-Version (${this.version}).`);
        }
        /** @type {?} */
        const request1$ = request$.pipe(delayedRetry(2000, 2), map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        (xmlResponse) => {
            /** @type {?} */
            const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            const output = this.wpsmarshaller.unmarshalGetStateResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
            return output;
        })));
        return request1$;
    }
    /**
     * @private
     * @param {?} lastState
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    fetchResults(lastState, serverUrl, processId, inputs, outputDescriptions) {
        if (lastState.results) { // WPS 1.0: results should already be in last state
            return of(lastState.results);
        }
        else { // WPS 2.0: get results with post request
            if (!lastState.jobID) {
                throw new Error(`You want me to get a result, but I can't find a jobId. I don't know what to do now!`);
            }
            /** @type {?} */
            const execBody = this.wpsmarshaller.marshallGetResultBody(serverUrl, processId, lastState.jobID);
            /** @type {?} */
            const xmlExecBody = this.xmlmarshaller.marshalString(execBody);
            return this.postRaw(serverUrl, xmlExecBody).pipe(map((/**
             * @param {?} xmlResponse
             * @return {?}
             */
            (xmlResponse) => {
                /** @type {?} */
                const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
                /** @type {?} */
                const output = this.wpsmarshaller.unmarshalSyncExecuteResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
                return output;
            })));
        }
    }
    /**
     * @private
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    executeAsyncS(url, processId, inputs, outputDescriptions) {
        /** @type {?} */
        const executeUrl = this.wpsmarshaller.executeUrl(url, processId);
        /** @type {?} */
        const execbody = this.wpsmarshaller.marshalExecBody(processId, inputs, outputDescriptions, true);
        /** @type {?} */
        const xmlExecbody = this.xmlmarshaller.marshalString(execbody);
        return this.postRaw(executeUrl, xmlExecbody).pipe(map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        (xmlResponse) => {
            /** @type {?} */
            const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            const output = this.wpsmarshaller.unmarshalAsyncExecuteResponse(jsonResponse, url, processId, inputs, outputDescriptions);
            return output;
        })));
    }
    /**
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    execute(url, processId, inputs, outputDescriptions) {
        /** @type {?} */
        const executeUrl = this.wpsmarshaller.executeUrl(url, processId);
        /** @type {?} */
        const execbody = this.wpsmarshaller.marshalExecBody(processId, inputs, outputDescriptions, false);
        /** @type {?} */
        const xmlExecbody = this.xmlmarshaller.marshalString(execbody);
        return this.postRaw(executeUrl, xmlExecbody).pipe(map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        (xmlResponse) => {
            /** @type {?} */
            const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            const output = this.wpsmarshaller.unmarshalSyncExecuteResponse(jsonResponse, url, processId, inputs, outputDescriptions);
            return output;
        })));
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    dismiss(serverUrl, processId, jobId) {
        /** @type {?} */
        const dismissUrl = this.wpsmarshaller.dismissUrl(serverUrl, processId, jobId);
        /** @type {?} */
        const dismissBody = this.wpsmarshaller.marshalDismissBody(jobId);
        /** @type {?} */
        const xmlDismissBody = this.xmlmarshaller.marshalString(dismissBody);
        return this.postRaw(dismissUrl, xmlDismissBody).pipe(map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        (xmlResponse) => {
            /** @type {?} */
            const jsonResponse = this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            const output = this.wpsmarshaller.unmarshalDismissResponse(jsonResponse, serverUrl, processId);
            return output;
        })));
    }
    /**
     * @param {?} url
     * @param {?} xmlBody
     * @return {?}
     */
    postRaw(url, xmlBody) {
        /** @type {?} */
        const headers = {
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        };
        return this.webclient.post(url, xmlBody, { headers, responseType: 'text' }).pipe(delayedRetry(2000, 2), share() // turning hot: to make sure that multiple subscribers dont cause multiple requests
        );
    }
    /**
     * @param {?} url
     * @return {?}
     */
    getRaw(url) {
        /** @type {?} */
        const headers = {
            'Accept': 'text/xml, application/xml'
        };
        return this.webclient.get(url, { headers, responseType: 'text' }).pipe(delayedRetry(2000, 2));
    }
}
WpsClient.decorators = [
    { type: Injectable }
];
/** @nocollapse */
WpsClient.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: ['WpsVersion',] }] },
    { type: HttpClient },
    { type: undefined, decorators: [{ type: Inject, args: ['WpsCache',] }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.version;
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.xmlmarshaller;
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.xmlunmarshaller;
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.wpsmarshaller;
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.cache;
    /**
     * @type {?}
     * @private
     */
    WpsClient.prototype.webclient;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3BzY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHVraXMvc2VydmljZXMtb2djLyIsInNvdXJjZXMiOlsibGliL3dwcy93cHNjbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRSxPQUFPLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sS0FBSyxpQkFBaUIsTUFBTSwyQkFBMkIsQ0FBQzs7TUFBTyxTQUFTLEdBQUcsaUJBQWlCLENBQUMsU0FBUztBQUM3RyxPQUFPLEtBQUssaUJBQWlCLE1BQU0sMkJBQTJCLENBQUM7O01BQU8sU0FBUyxHQUFHLGlCQUFpQixDQUFDLFNBQVM7QUFDN0csT0FBTyxLQUFLLGVBQWUsTUFBTSx5QkFBeUIsQ0FBQzs7TUFBTyxPQUFPLEdBQUcsZUFBZSxDQUFDLE9BQU87QUFDbkcsT0FBTyxLQUFLLGlCQUFpQixNQUFNLDJCQUEyQixDQUFDOztNQUFPLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTO0FBQzdHLE9BQU8sS0FBSyxlQUFlLE1BQU0seUJBQXlCLENBQUM7O01BQU8sT0FBTyxHQUFHLGVBQWUsQ0FBQyxPQUFPO0FBQ25HLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FB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Q0FDTCxDQUFDO0lBQ04sQ0FBQzs7Ozs7O0lBRUQsT0FBTyxDQUFDLEdBQVcsRUFBRSxPQUFlOztjQUMxQixPQUFPLEdBQUc7WUFDWixjQUFjLEVBQUUsVUFBVTtZQUMxQixRQUFRLEVBQUUsMkJBQTJCO1NBQ3hDO1FBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FDNUUsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFDckIsS0FBSyxFQUFFLENBQUUsbUZBQW1GO1NBQy9GLENBQUM7SUFDTixDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxHQUFXOztjQUNSLE9BQU8sR0FBRztZQUNaLFFBQVEsRUFBRSwyQkFBMkI7U0FDeEM7UUFDRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQ2xFLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQ3hCLENBQUM7SUFDTixDQUFDOzs7WUE5T0osVUFBVTs7Ozs0Q0FVRixNQUFNLFNBQUMsWUFBWTtZQS9CbkIsVUFBVTs0Q0FpQ1YsTUFBTSxTQUFDLFVBQVU7Ozs7Ozs7SUFUdEIsNEJBQTJCOzs7OztJQUMzQixrQ0FBMkI7Ozs7O0lBQzNCLG9DQUE2Qjs7Ozs7SUFDN0Isa0NBQXFDOzs7OztJQUNyQywwQkFBdUM7Ozs7O0lBSW5DLDhCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFdwc01hcnNoYWxsZXIsIFdwc0lucHV0LCBXcHNWZXJpb24sIFdwc1Jlc3VsdCwgV3BzT3V0cHV0RGVzY3JpcHRpb24sIFdwc0RhdGEsIFdwc1N0YXRlLCBpc1dwc1N0YXRlLCBXcHNEYXRhRGVzY3JpcHRpb24gfSBmcm9tICcuL3dwc19kYXRhdHlwZXMnO1xyXG5pbXBvcnQgeyBXcHNNYXJzaGFsbGVyMTAwIH0gZnJvbSAnLi93cHMxMDAvd3BzX21hcnNoYWxsZXJfMS4wLjAnO1xyXG5pbXBvcnQgeyBXcHNNYXJzaGFsbGVyMjAwIH0gZnJvbSAnLi93cHMyMDAvd3BzX21hcnNoYWxsZXJfMi4wLjAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAsIHN3aXRjaE1hcCwgdGFwLCBzaGFyZSwgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCAqIGFzIFhMaW5rXzFfMF9GYWN0b3J5IGZyb20gJ3czYy1zY2hlbWFzL2xpYi9YTGlua18xXzAnOyBjb25zdCBYTGlua18xXzAgPSBYTGlua18xXzBfRmFjdG9yeS5YTGlua18xXzA7XHJcbmltcG9ydCAqIGFzIE9XU18xXzFfMF9GYWN0b3J5IGZyb20gJ29nYy1zY2hlbWFzL2xpYi9PV1NfMV8xXzAnOyBjb25zdCBPV1NfMV8xXzAgPSBPV1NfMV8xXzBfRmFjdG9yeS5PV1NfMV8xXzA7XHJcbmltcG9ydCAqIGFzIE9XU18yXzBfRmFjdG9yeSBmcm9tICdvZ2Mtc2NoZW1hcy9saWIvT1dTXzJfMCc7IGNvbnN0IE9XU18yXzAgPSBPV1NfMl8wX0ZhY3RvcnkuT1dTXzJfMDtcclxuaW1wb3J0ICogYXMgV1BTXzFfMF8wX0ZhY3RvcnkgZnJvbSAnb2djLXNjaGVtYXMvbGliL1dQU18xXzBfMCc7IGNvbnN0IFdQU18xXzBfMCA9IFdQU18xXzBfMF9GYWN0b3J5LldQU18xXzBfMDtcclxuaW1wb3J0ICogYXMgV1BTXzJfMF9GYWN0b3J5IGZyb20gJ29nYy1zY2hlbWFzL2xpYi9XUFNfMl8wJzsgY29uc3QgV1BTXzJfMCA9IFdQU18yXzBfRmFjdG9yeS5XUFNfMl8wO1xyXG5pbXBvcnQgeyBwb2xsVW50aWwsIGRlbGF5ZWRSZXRyeSB9IGZyb20gJy4vdXRpbHMvcG9sbGluZyc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBKc29uaXggfSBmcm9tICdAYm91bmRsZXNzZ2VvL2pzb25peCc7XHJcbmltcG9ydCB7IENhY2hlLCBGYWtlQ2FjaGUgfSBmcm9tICcuL2NhY2hlJztcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFRoZSBXcHMtY2xpZW50IGFic3RyYWN0cyBhd2F5IHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIFdwczEuMC4wIGFuZCBXcHMyLjAuMFxyXG4gKiBUaGVyZSBhcmUgdHdvIGxheWVycyBvZiBtYXJzaGFsbGluZzpcclxuICogIC0gdGhlIFdwcy1tYXJzaGFsbGVyIG1hcnNoYWxzIHVzZXItZmFjaW5nIGRhdGEgdG8gd3BzLXNwZWNpZmljIHR5cGVzXHJcbiAqICAtIEpzb25peCBtYXJzaGFscyB3cHMtc3BlY2lmaWMgZGF0YSB0byB4bWwuXHJcbiAqIHVzZXItZmFjaW5nIGRhdGEgLT4gd3BzbWFyc2hhbGxlciAtPiBXcHMtdHlwZS1zcGVjaWZpYyBkYXRhIC0+IEpzb25peC1tYXJoc2FsbGVyIC0+IFhNTCAtPlxyXG4gKiAtPiB3ZWJjbGllbnQgLT4gV1BTIC0+IFhNTCAtPiBKc29uaXgtdW5tYXJzaGFsbGVyIC0+IFdwcy10eXBlLXNwZWNpZmljIGRhdGEgLT4gd3BzbWFyc2hhbGxlciAtPiB1c2VyLWZhY2luZyBkYXRhXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBXcHNDbGllbnQge1xyXG5cclxuICAgIHByaXZhdGUgdmVyc2lvbjogV3BzVmVyaW9uO1xyXG4gICAgcHJpdmF0ZSB4bWxtYXJzaGFsbGVyOiBhbnk7XHJcbiAgICBwcml2YXRlIHhtbHVubWFyc2hhbGxlcjogYW55O1xyXG4gICAgcHJpdmF0ZSB3cHNtYXJzaGFsbGVyOiBXcHNNYXJzaGFsbGVyO1xyXG4gICAgcHJpdmF0ZSBjYWNoZTogQ2FjaGUgPSBuZXcgRmFrZUNhY2hlKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQEluamVjdCgnV3BzVmVyc2lvbicpIHZlcnNpb246IFdwc1ZlcmlvbiA9ICcxLjAuMCcsXHJcbiAgICAgICAgcHJpdmF0ZSB3ZWJjbGllbnQ6IEh0dHBDbGllbnQsXHJcbiAgICAgICAgQEluamVjdCgnV3BzQ2FjaGUnKSBjYWNoZT86IENhY2hlXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xyXG4gICAgICAgIGlmIChjYWNoZSkgdGhpcy5jYWNoZSA9IGNhY2hlO1xyXG4gICAgICAgIGxldCBjb250ZXh0O1xyXG4gICAgICAgIGlmICh0aGlzLnZlcnNpb24gPT09ICcxLjAuMCcpIHtcclxuICAgICAgICAgICAgdGhpcy53cHNtYXJzaGFsbGVyID0gbmV3IFdwc01hcnNoYWxsZXIxMDAoKTtcclxuICAgICAgICAgICAgY29udGV4dCA9IG5ldyBKc29uaXguQ29udGV4dChbWExpbmtfMV8wLCBPV1NfMV8xXzAsIFdQU18xXzBfMF0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uID09PSAnMi4wLjAnKSB7XHJcbiAgICAgICAgICAgIHRoaXMud3BzbWFyc2hhbGxlciA9IG5ldyBXcHNNYXJzaGFsbGVyMjAwKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSBuZXcgSnNvbml4LkNvbnRleHQoW1hMaW5rXzFfMCwgT1dTXzJfMCwgV1BTXzJfMF0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGVudGVyZWQgYSBXUFMgdmVyc2lvbiBvdGhlciB0aGFuIDEuMC4wIG9yIDIuMC4wLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnhtbHVubWFyc2hhbGxlciA9IGNvbnRleHQuY3JlYXRlVW5tYXJzaGFsbGVyKCk7XHJcbiAgICAgICAgdGhpcy54bWxtYXJzaGFsbGVyID0gY29udGV4dC5jcmVhdGVNYXJzaGFsbGVyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldENhcGFiaWxpdGllcyh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgY29uc3QgZ2V0Q2FwYWJpbGl0aWVzVXJsID0gdGhpcy53cHNtYXJzaGFsbGVyLmdldENhcGFiaWxpdGllc1VybCh1cmwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFJhdyhnZXRDYXBhYmlsaXRpZXNVcmwpLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VKc29uID0gdGhpcy54bWx1bm1hcnNoYWxsZXIudW5tYXJzaGFsU3RyaW5nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndwc21hcnNoYWxsZXIudW5tYXJzaGFsQ2FwYWJpbGl0aWVzKHJlc3BvbnNlSnNvbi52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0pIC8vIEBUT0RPOiBoYW5kbGUgY2FzZSB3aGVuIGluc3RlYWQgb2YgV3BzQ2FwYWJpbGl0ZXMgYW4gRXhjZXB0aW9uUmVwb3J0IGlzIHJldHVybmVkXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZGVzY3JpYmVQcm9jZXNzKHByb2Nlc3NJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCB5ZXQnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZXhlY3V0ZUFzeW5jKHVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgaW5wdXRzOiBXcHNJbnB1dFtdLCBvdXRwdXRzOiBXcHNPdXRwdXREZXNjcmlwdGlvbltdLFxyXG4gICAgICAgIHBvbGxpbmdSYXRlOiBudW1iZXIgPSAxMDAwLCB0YXBGdW5jdGlvbj86IChyZXNwb25zZTogV3BzU3RhdGUgfCBudWxsKSA9PiBhbnkpOiBPYnNlcnZhYmxlPFdwc1Jlc3VsdFtdPiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGV4ZWN1dGVSZXF1ZXN0JDogT2JzZXJ2YWJsZTxXcHNTdGF0ZT4gPSB0aGlzLmV4ZWN1dGVBc3luY1ModXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0cyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHF1ZXJ5JCA9IGV4ZWN1dGVSZXF1ZXN0JC5waXBlKFxyXG5cclxuICAgICAgICAgICAgLy8gcG9sbCB1bnRpbCBzdWNlZWRlZFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgoY3VycmVudFN0YXRlOiBXcHNTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dFN0YXRlJDogT2JzZXJ2YWJsZTxXcHNTdGF0ZT4gPSB0aGlzLmdldE5leHRTdGF0ZShjdXJyZW50U3RhdGUsIHVybCwgcHJvY2Vzc0lkLCBpbnB1dHMsIG91dHB1dHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvbGwkOiBPYnNlcnZhYmxlPFdwc1N0YXRlPiA9IHBvbGxVbnRpbDxXcHNTdGF0ZT4oXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0YXRlJCxcclxuICAgICAgICAgICAgICAgICAgICAocmVzcG9uc2U6IFdwc1N0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXMgPT09ICdTdWNjZWVkZWQnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGFwRnVuY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgcG9sbGluZ1JhdGVcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvbGwkO1xyXG4gICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgIC8vIGZldGNoIHJlc3VsdHNcclxuICAgICAgICAgICAgbWVyZ2VNYXAoKGxhc3RTdGF0ZTogV3BzU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZldGNoUmVzdWx0cyhsYXN0U3RhdGUsIHVybCwgcHJvY2Vzc0lkLCBpbnB1dHMsIG91dHB1dHMpO1xyXG4gICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgIC8vIEluIGNhc2Ugb2YgZXJyb3JzOlxyXG4gICAgICAgICAgICB0YXAoKHJlc3BvbnNlOiBXcHNEYXRhW10pID0+IHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcmVzdWx0IG9mIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5kZXNjcmlwdGlvbi50eXBlID09PSAnZXJyb3InKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZXJ2ZXIgcmVzcG9uZGVkIHdpdGggMjAwLCBidXQgYm9keSBjb250YWluZWQgYW4gZXJyb3ItcmVzdWx0OiAnLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkUXVlcnkodXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0cywgcXVlcnkkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNhY2hlZFF1ZXJ5KHVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgaW5wdXRzOiBXcHNJbnB1dFtdLFxyXG4gICAgICAgIG91dHB1dHM6IFdwc091dHB1dERlc2NyaXB0aW9uW10sIHF1ZXJ5JDogT2JzZXJ2YWJsZTxXcHNEYXRhW10+KTogT2JzZXJ2YWJsZTxXcHNEYXRhW10+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2FjaGVkUmVzcG9uc2UkOiBPYnNlcnZhYmxlPFdwc1Jlc3VsdFtdIHwgbnVsbD4gPSB0aGlzLmNhY2hlLmdldCh7dXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0c30pO1xyXG4gICAgICAgIHJldHVybiBjYWNoZWRSZXNwb25zZSQucGlwZShcclxuICAgICAgICAgICAgc3dpdGNoTWFwKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZihyZXN1bHRzKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5JC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXAoKHJlc3BvbnNlOiBXcHNEYXRhW10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuc2V0KHt1cmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXRzfSwgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE5leHRTdGF0ZShjdXJyZW50U3RhdGU6IFdwc1N0YXRlLCBzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzSW5wdXRbXSxcclxuICAgICAgICBvdXRwdXREZXNjcmlwdGlvbnM6IFdwc091dHB1dERlc2NyaXB0aW9uW10pOiBPYnNlcnZhYmxlPFdwc1N0YXRlPiB7XHJcblxyXG4gICAgICAgIGxldCByZXF1ZXN0JDogT2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG4gICAgICAgIGlmICh0aGlzLnZlcnNpb24gPT09ICcxLjAuMCcpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghY3VycmVudFN0YXRlLnN0YXR1c0xvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcignTm8gc3RhdHVzIGxvY2F0aW9uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVxdWVzdCQgPSB0aGlzLmdldFJhdyhjdXJyZW50U3RhdGUuc3RhdHVzTG9jYXRpb24pO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmVyc2lvbiA9PT0gJzIuMC4wJykge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50U3RhdGUuam9iSUQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdObyBqb2ItSWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBleGVjYm9keSA9IHRoaXMud3BzbWFyc2hhbGxlci5tYXJzaGFsbEdldFN0YXR1c0JvZHkoc2VydmVyVXJsLCBwcm9jZXNzSWQsIGN1cnJlbnRTdGF0ZS5qb2JJRCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHhtbEV4ZWNib2R5ID0gdGhpcy54bWxtYXJzaGFsbGVyLm1hcnNoYWxTdHJpbmcoZXhlY2JvZHkpO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdCQgPSB0aGlzLnBvc3RSYXcoc2VydmVyVXJsLCB4bWxFeGVjYm9keSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJ0dldFN0YXR1cycgaGFzIG5vdCB5ZXQgYmVlbiBpbXBsZW1lbnRlZCBmb3IgdGhpcyBXUFMtVmVyc2lvbiAoJHt0aGlzLnZlcnNpb259KS5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlcXVlc3QxJDogT2JzZXJ2YWJsZTxXcHNTdGF0ZT4gPSByZXF1ZXN0JC5waXBlKFxyXG4gICAgICAgICAgICBkZWxheWVkUmV0cnkoMjAwMCwgMiksXHJcbiAgICAgICAgICAgIG1hcCgoeG1sUmVzcG9uc2U6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QganNvblJlc3BvbnNlID0gdGhpcy54bWx1bm1hcnNoYWxsZXIudW5tYXJzaGFsU3RyaW5nKHhtbFJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dDogV3BzRGF0YVtdIHwgV3BzU3RhdGUgPVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud3BzbWFyc2hhbGxlci51bm1hcnNoYWxHZXRTdGF0ZVJlc3BvbnNlKGpzb25SZXNwb25zZSwgc2VydmVyVXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0RGVzY3JpcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlcXVlc3QxJDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZldGNoUmVzdWx0cyhsYXN0U3RhdGU6IFdwc1N0YXRlLCBzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzSW5wdXRbXSxcclxuICAgICAgICBvdXRwdXREZXNjcmlwdGlvbnM6IFdwc091dHB1dERlc2NyaXB0aW9uW10pOiBPYnNlcnZhYmxlPFdwc0RhdGFbXT4ge1xyXG5cclxuICAgICAgICBpZiAobGFzdFN0YXRlLnJlc3VsdHMpIHsgLy8gV1BTIDEuMDogcmVzdWx0cyBzaG91bGQgYWxyZWFkeSBiZSBpbiBsYXN0IHN0YXRlXHJcbiAgICAgICAgICAgIHJldHVybiBvZihsYXN0U3RhdGUucmVzdWx0cyk7XHJcbiAgICAgICAgfSBlbHNlIHsgLy8gV1BTIDIuMDogZ2V0IHJlc3VsdHMgd2l0aCBwb3N0IHJlcXVlc3RcclxuXHJcbiAgICAgICAgICAgIGlmICghbGFzdFN0YXRlLmpvYklEKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFlvdSB3YW50IG1lIHRvIGdldCBhIHJlc3VsdCwgYnV0IEkgY2FuJ3QgZmluZCBhIGpvYklkLiBJIGRvbid0IGtub3cgd2hhdCB0byBkbyBub3chYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGV4ZWNCb2R5ID0gdGhpcy53cHNtYXJzaGFsbGVyLm1hcnNoYWxsR2V0UmVzdWx0Qm9keShzZXJ2ZXJVcmwsIHByb2Nlc3NJZCwgbGFzdFN0YXRlLmpvYklEKTtcclxuICAgICAgICAgICAgY29uc3QgeG1sRXhlY0JvZHkgPSB0aGlzLnhtbG1hcnNoYWxsZXIubWFyc2hhbFN0cmluZyhleGVjQm9keSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb3N0UmF3KHNlcnZlclVybCwgeG1sRXhlY0JvZHkpLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAoKHhtbFJlc3BvbnNlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBqc29uUmVzcG9uc2UgPSB0aGlzLnhtbHVubWFyc2hhbGxlci51bm1hcnNoYWxTdHJpbmcoeG1sUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dCA9IHRoaXMud3BzbWFyc2hhbGxlci51bm1hcnNoYWxTeW5jRXhlY3V0ZVJlc3BvbnNlKGpzb25SZXNwb25zZSwgc2VydmVyVXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0RGVzY3JpcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIGV4ZWN1dGVBc3luY1ModXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBpbnB1dHM6IFdwc0lucHV0W10sXHJcbiAgICAgICAgb3V0cHV0RGVzY3JpcHRpb25zOiBXcHNPdXRwdXREZXNjcmlwdGlvbltdKTogT2JzZXJ2YWJsZTxXcHNTdGF0ZT4ge1xyXG5cclxuICAgICAgICBjb25zdCBleGVjdXRlVXJsID0gdGhpcy53cHNtYXJzaGFsbGVyLmV4ZWN1dGVVcmwodXJsLCBwcm9jZXNzSWQpO1xyXG4gICAgICAgIGNvbnN0IGV4ZWNib2R5ID0gdGhpcy53cHNtYXJzaGFsbGVyLm1hcnNoYWxFeGVjQm9keShwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0RGVzY3JpcHRpb25zLCB0cnVlKTtcclxuICAgICAgICBjb25zdCB4bWxFeGVjYm9keSA9IHRoaXMueG1sbWFyc2hhbGxlci5tYXJzaGFsU3RyaW5nKGV4ZWNib2R5KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zdFJhdyhleGVjdXRlVXJsLCB4bWxFeGVjYm9keSkucGlwZShcclxuICAgICAgICAgICAgbWFwKCh4bWxSZXNwb25zZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uUmVzcG9uc2UgPSB0aGlzLnhtbHVubWFyc2hhbGxlci51bm1hcnNoYWxTdHJpbmcoeG1sUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0OiBXcHNTdGF0ZSA9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cHNtYXJzaGFsbGVyLnVubWFyc2hhbEFzeW5jRXhlY3V0ZVJlc3BvbnNlKGpzb25SZXNwb25zZSwgdXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0RGVzY3JpcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBleGVjdXRlKHVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgaW5wdXRzOiBXcHNJbnB1dFtdLFxyXG4gICAgICAgIG91dHB1dERlc2NyaXB0aW9uczogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSk6IE9ic2VydmFibGU8V3BzUmVzdWx0W10+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZXhlY3V0ZVVybCA9IHRoaXMud3BzbWFyc2hhbGxlci5leGVjdXRlVXJsKHVybCwgcHJvY2Vzc0lkKTtcclxuICAgICAgICBjb25zdCBleGVjYm9keSA9IHRoaXMud3BzbWFyc2hhbGxlci5tYXJzaGFsRXhlY0JvZHkocHJvY2Vzc0lkLCBpbnB1dHMsIG91dHB1dERlc2NyaXB0aW9ucywgZmFsc2UpO1xyXG4gICAgICAgIGNvbnN0IHhtbEV4ZWNib2R5ID0gdGhpcy54bWxtYXJzaGFsbGVyLm1hcnNoYWxTdHJpbmcoZXhlY2JvZHkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wb3N0UmF3KGV4ZWN1dGVVcmwsIHhtbEV4ZWNib2R5KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHhtbFJlc3BvbnNlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb25SZXNwb25zZSA9IHRoaXMueG1sdW5tYXJzaGFsbGVyLnVubWFyc2hhbFN0cmluZyh4bWxSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXQ6IFdwc0RhdGFbXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cHNtYXJzaGFsbGVyLnVubWFyc2hhbFN5bmNFeGVjdXRlUmVzcG9uc2UoanNvblJlc3BvbnNlLCB1cmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXREZXNjcmlwdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc21pc3Moc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBqb2JJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZGlzbWlzc1VybCA9IHRoaXMud3BzbWFyc2hhbGxlci5kaXNtaXNzVXJsKHNlcnZlclVybCwgcHJvY2Vzc0lkLCBqb2JJZCk7XHJcbiAgICAgICAgY29uc3QgZGlzbWlzc0JvZHkgPSB0aGlzLndwc21hcnNoYWxsZXIubWFyc2hhbERpc21pc3NCb2R5KGpvYklkKTtcclxuICAgICAgICBjb25zdCB4bWxEaXNtaXNzQm9keSA9IHRoaXMueG1sbWFyc2hhbGxlci5tYXJzaGFsU3RyaW5nKGRpc21pc3NCb2R5KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zdFJhdyhkaXNtaXNzVXJsLCB4bWxEaXNtaXNzQm9keSkucGlwZShcclxuICAgICAgICAgICAgbWFwKCh4bWxSZXNwb25zZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uUmVzcG9uc2UgPSB0aGlzLnhtbHVubWFyc2hhbGxlci51bm1hcnNoYWxTdHJpbmcoeG1sUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gdGhpcy53cHNtYXJzaGFsbGVyLnVubWFyc2hhbERpc21pc3NSZXNwb25zZShqc29uUmVzcG9uc2UsIHNlcnZlclVybCwgcHJvY2Vzc0lkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0UmF3KHVybDogc3RyaW5nLCB4bWxCb2R5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC94bWwnLFxyXG4gICAgICAgICAgICAnQWNjZXB0JzogJ3RleHQveG1sLCBhcHBsaWNhdGlvbi94bWwnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy53ZWJjbGllbnQucG9zdCh1cmwsIHhtbEJvZHksIHsgaGVhZGVycywgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSkucGlwZShcclxuICAgICAgICAgICAgZGVsYXllZFJldHJ5KDIwMDAsIDIpLFxyXG4gICAgICAgICAgICBzaGFyZSgpICAvLyB0dXJuaW5nIGhvdDogdG8gbWFrZSBzdXJlIHRoYXQgbXVsdGlwbGUgc3Vic2NyaWJlcnMgZG9udCBjYXVzZSBtdWx0aXBsZSByZXF1ZXN0c1xyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmF3KHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0ge1xyXG4gICAgICAgICAgICAnQWNjZXB0JzogJ3RleHQveG1sLCBhcHBsaWNhdGlvbi94bWwnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy53ZWJjbGllbnQuZ2V0KHVybCwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KS5waXBlKFxyXG4gICAgICAgICAgICBkZWxheWVkUmV0cnkoMjAwMCwgMilcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==