/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wpsclient.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { WpsMarshaller100 } from './wps100/wps_marshaller_1.0.0';
import { WpsMarshaller200 } from './wps200/wps_marshaller_2.0.0';
import { of } from 'rxjs';
import { map, switchMap, tap, share, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as XLink_1_0_Factory from 'w3c-schemas/lib/XLink_1_0';
/** @type {?} */
var XLink_1_0 = XLink_1_0_Factory.XLink_1_0;
import * as OWS_1_1_0_Factory from 'ogc-schemas/lib/OWS_1_1_0';
/** @type {?} */
var OWS_1_1_0 = OWS_1_1_0_Factory.OWS_1_1_0;
import * as OWS_2_0_Factory from 'ogc-schemas/lib/OWS_2_0';
/** @type {?} */
var OWS_2_0 = OWS_2_0_Factory.OWS_2_0;
import * as WPS_1_0_0_Factory from 'ogc-schemas/lib/WPS_1_0_0';
/** @type {?} */
var WPS_1_0_0 = WPS_1_0_0_Factory.WPS_1_0_0;
import * as WPS_2_0_Factory from 'ogc-schemas/lib/WPS_2_0';
/** @type {?} */
var WPS_2_0 = WPS_2_0_Factory.WPS_2_0;
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
var WpsClient = /** @class */ (function () {
    function WpsClient(version, webclient, cache) {
        if (version === void 0) { version = '1.0.0'; }
        this.webclient = webclient;
        this.cache = new FakeCache();
        this.version = version;
        if (cache)
            this.cache = cache;
        /** @type {?} */
        var context;
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
    WpsClient.prototype.getCapabilities = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        var _this = this;
        /** @type {?} */
        var getCapabilitiesUrl = this.wpsmarshaller.getCapabilitiesUrl(url);
        return this.getRaw(getCapabilitiesUrl).pipe(map((/**
         * @param {?} response
         * @return {?}
         */
        function (response) {
            /** @type {?} */
            var responseJson = _this.xmlunmarshaller.unmarshalString(response);
            return _this.wpsmarshaller.unmarshalCapabilities(responseJson.value);
        })) // @TODO: handle case when instead of WpsCapabilites an ExceptionReport is returned
        );
    };
    /**
     * @param {?} processId
     * @return {?}
     */
    WpsClient.prototype.describeProcess = /**
     * @param {?} processId
     * @return {?}
     */
    function (processId) {
        throw new Error('Not implemented yet');
    };
    /**
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?=} pollingRate
     * @param {?=} tapFunction
     * @return {?}
     */
    WpsClient.prototype.executeAsync = /**
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?=} pollingRate
     * @param {?=} tapFunction
     * @return {?}
     */
    function (url, processId, inputs, outputs, pollingRate, tapFunction) {
        var _this = this;
        if (pollingRate === void 0) { pollingRate = 1000; }
        /** @type {?} */
        var executeRequest$ = this.executeAsyncS(url, processId, inputs, outputs);
        /** @type {?} */
        var query$ = executeRequest$.pipe(
        // poll until suceeded
        mergeMap((/**
         * @param {?} currentState
         * @return {?}
         */
        function (currentState) {
            /** @type {?} */
            var nextState$ = _this.getNextState(currentState, url, processId, inputs, outputs);
            /** @type {?} */
            var poll$ = pollUntil(nextState$, (/**
             * @param {?} response
             * @return {?}
             */
            function (response) {
                return response.status === 'Succeeded';
            }), tapFunction, pollingRate);
            return poll$;
        })), 
        // fetch results
        mergeMap((/**
         * @param {?} lastState
         * @return {?}
         */
        function (lastState) {
            return _this.fetchResults(lastState, url, processId, inputs, outputs);
        })), 
        // In case of errors:
        tap((/**
         * @param {?} response
         * @return {?}
         */
        function (response) {
            var e_1, _a;
            try {
                for (var response_1 = tslib_1.__values(response), response_1_1 = response_1.next(); !response_1_1.done; response_1_1 = response_1.next()) {
                    var result = response_1_1.value;
                    if (result.description.type === 'error') {
                        console.log('server responded with 200, but body contained an error-result: ', result);
                        throw new Error(result.value);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (response_1_1 && !response_1_1.done && (_a = response_1.return)) _a.call(response_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        })));
        return this.cachedQuery(url, processId, inputs, outputs, query$);
    };
    /**
     * @private
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} query$
     * @return {?}
     */
    WpsClient.prototype.cachedQuery = /**
     * @private
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} query$
     * @return {?}
     */
    function (url, processId, inputs, outputs, query$) {
        var _this = this;
        /** @type {?} */
        var cachedResponse$ = this.cache.get({ url: url, processId: processId, inputs: inputs, outputs: outputs });
        return cachedResponse$.pipe(switchMap((/**
         * @param {?} results
         * @return {?}
         */
        function (results) {
            if (results) {
                return of(results);
            }
            else {
                return query$.pipe(tap((/**
                 * @param {?} response
                 * @return {?}
                 */
                function (response) {
                    _this.cache.set({ url: url, processId: processId, inputs: inputs, outputs: outputs }, response);
                })));
            }
        })));
    };
    /**
     * @private
     * @param {?} currentState
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsClient.prototype.getNextState = /**
     * @private
     * @param {?} currentState
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    function (currentState, serverUrl, processId, inputs, outputDescriptions) {
        var _this = this;
        /** @type {?} */
        var request$;
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
            var execbody = this.wpsmarshaller.marshallGetStatusBody(serverUrl, processId, currentState.jobID);
            /** @type {?} */
            var xmlExecbody = this.xmlmarshaller.marshalString(execbody);
            request$ = this.postRaw(serverUrl, xmlExecbody);
        }
        else {
            throw new Error("'GetStatus' has not yet been implemented for this WPS-Version (" + this.version + ").");
        }
        /** @type {?} */
        var request1$ = request$.pipe(delayedRetry(2000, 2), map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        function (xmlResponse) {
            /** @type {?} */
            var jsonResponse = _this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            var output = _this.wpsmarshaller.unmarshalGetStateResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
            return output;
        })));
        return request1$;
    };
    /**
     * @private
     * @param {?} lastState
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsClient.prototype.fetchResults = /**
     * @private
     * @param {?} lastState
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    function (lastState, serverUrl, processId, inputs, outputDescriptions) {
        var _this = this;
        if (lastState.results) { // WPS 1.0: results should already be in last state
            return of(lastState.results);
        }
        else { // WPS 2.0: get results with post request
            if (!lastState.jobID) {
                throw new Error("You want me to get a result, but I can't find a jobId. I don't know what to do now!");
            }
            /** @type {?} */
            var execBody = this.wpsmarshaller.marshallGetResultBody(serverUrl, processId, lastState.jobID);
            /** @type {?} */
            var xmlExecBody = this.xmlmarshaller.marshalString(execBody);
            return this.postRaw(serverUrl, xmlExecBody).pipe(map((/**
             * @param {?} xmlResponse
             * @return {?}
             */
            function (xmlResponse) {
                /** @type {?} */
                var jsonResponse = _this.xmlunmarshaller.unmarshalString(xmlResponse);
                /** @type {?} */
                var output = _this.wpsmarshaller.unmarshalSyncExecuteResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
                return output;
            })));
        }
    };
    /**
     * @private
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsClient.prototype.executeAsyncS = /**
     * @private
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    function (url, processId, inputs, outputDescriptions) {
        var _this = this;
        /** @type {?} */
        var executeUrl = this.wpsmarshaller.executeUrl(url, processId);
        /** @type {?} */
        var execbody = this.wpsmarshaller.marshalExecBody(processId, inputs, outputDescriptions, true);
        /** @type {?} */
        var xmlExecbody = this.xmlmarshaller.marshalString(execbody);
        return this.postRaw(executeUrl, xmlExecbody).pipe(map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        function (xmlResponse) {
            /** @type {?} */
            var jsonResponse = _this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            var output = _this.wpsmarshaller.unmarshalAsyncExecuteResponse(jsonResponse, url, processId, inputs, outputDescriptions);
            return output;
        })));
    };
    /**
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsClient.prototype.execute = /**
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    function (url, processId, inputs, outputDescriptions) {
        var _this = this;
        /** @type {?} */
        var executeUrl = this.wpsmarshaller.executeUrl(url, processId);
        /** @type {?} */
        var execbody = this.wpsmarshaller.marshalExecBody(processId, inputs, outputDescriptions, false);
        /** @type {?} */
        var xmlExecbody = this.xmlmarshaller.marshalString(execbody);
        return this.postRaw(executeUrl, xmlExecbody).pipe(map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        function (xmlResponse) {
            /** @type {?} */
            var jsonResponse = _this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            var output = _this.wpsmarshaller.unmarshalSyncExecuteResponse(jsonResponse, url, processId, inputs, outputDescriptions);
            return output;
        })));
    };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    WpsClient.prototype.dismiss = /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    function (serverUrl, processId, jobId) {
        var _this = this;
        /** @type {?} */
        var dismissUrl = this.wpsmarshaller.dismissUrl(serverUrl, processId, jobId);
        /** @type {?} */
        var dismissBody = this.wpsmarshaller.marshalDismissBody(jobId);
        /** @type {?} */
        var xmlDismissBody = this.xmlmarshaller.marshalString(dismissBody);
        return this.postRaw(dismissUrl, xmlDismissBody).pipe(map((/**
         * @param {?} xmlResponse
         * @return {?}
         */
        function (xmlResponse) {
            /** @type {?} */
            var jsonResponse = _this.xmlunmarshaller.unmarshalString(xmlResponse);
            /** @type {?} */
            var output = _this.wpsmarshaller.unmarshalDismissResponse(jsonResponse, serverUrl, processId);
            return output;
        })));
    };
    /**
     * @param {?} url
     * @param {?} xmlBody
     * @return {?}
     */
    WpsClient.prototype.postRaw = /**
     * @param {?} url
     * @param {?} xmlBody
     * @return {?}
     */
    function (url, xmlBody) {
        /** @type {?} */
        var headers = {
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        };
        return this.webclient.post(url, xmlBody, { headers: headers, responseType: 'text' }).pipe(delayedRetry(2000, 2), share() // turning hot: to make sure that multiple subscribers dont cause multiple requests
        );
    };
    /**
     * @param {?} url
     * @return {?}
     */
    WpsClient.prototype.getRaw = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var headers = {
            'Accept': 'text/xml, application/xml'
        };
        return this.webclient.get(url, { headers: headers, responseType: 'text' }).pipe(delayedRetry(2000, 2));
    };
    WpsClient.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    WpsClient.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: ['WpsVersion',] }] },
        { type: HttpClient },
        { type: undefined, decorators: [{ type: Inject, args: ['WpsCache',] }] }
    ]; };
    return WpsClient;
}());
export { WpsClient };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3BzY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHVraXMvc2VydmljZXMtb2djLyIsInNvdXJjZXMiOlsibGliL3dwcy93cHNjbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDakUsT0FBTyxFQUFjLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0QyxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEtBQUssaUJBQWlCLE1BQU0sMkJBQTJCLENBQUM7O0lBQU8sU0FBUyxHQUFHLGlCQUFpQixDQUFDLFNBQVM7QUFDN0csT0FBTyxLQUFLLGlCQUFpQixNQUFNLDJCQUEyQixDQUFDOztJQUFPLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTO0FBQzdHLE9BQU8sS0FBSyxlQUFlLE1BQU0seUJBQXlCLENBQUM7O0lBQU8sT0FBTyxHQUFHLGVBQWUsQ0FBQyxPQUFPO0FBQ25HLE9BQU8sS0FBSyxpQkFBaUIsTUFBTSwyQkFBMkIsQ0FBQzs7SUFBTyxTQUFTLEdBQUcsaUJBQWlCLENBQUMsU0FBUztBQUM3RyxPQUFPLEtBQUssZUFBZSxNQUFNLHlCQUF5QixDQUFDOztJQUFPLE9BQU8sR0FBRyxlQUFlLENBQUMsT0FBTztBQUNuRyxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzFELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QyxPQUFPLEVBQVMsU0FBUyxFQUFFLE1BQU0sU0FBUyxDQUFDOzs7Ozs7Ozs7QUFZM0M7SUFTSSxtQkFDMEIsT0FBNEIsRUFDMUMsU0FBcUIsRUFDVCxLQUFhO1FBRmpDLHdCQUFBLEVBQUEsaUJBQWtEO1FBQzFDLGNBQVMsR0FBVCxTQUFTLENBQVk7UUFKekIsVUFBSyxHQUFVLElBQUksU0FBUyxFQUFFLENBQUM7UUFPbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxLQUFLO1lBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O1lBQzFCLE9BQU87UUFDWCxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO1lBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzVDLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDbkU7YUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzVDLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDL0Q7YUFBTTtZQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztTQUMzRTtRQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUNwRCxDQUFDOzs7OztJQUdELG1DQUFlOzs7O0lBQWYsVUFBZ0IsR0FBVztRQUEzQixpQkFRQzs7WUFQUyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQztRQUNyRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQ3ZDLEdBQUc7Ozs7UUFBQyxVQUFDLFFBQWE7O2dCQUNSLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7WUFDbkUsT0FBTyxLQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RSxDQUFDLEVBQUMsQ0FBQyxtRkFBbUY7U0FDekYsQ0FBQztJQUNOLENBQUM7Ozs7O0lBR0QsbUNBQWU7Ozs7SUFBZixVQUFnQixTQUFpQjtRQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDM0MsQ0FBQzs7Ozs7Ozs7OztJQUdELGdDQUFZOzs7Ozs7Ozs7SUFBWixVQUFhLEdBQVcsRUFBRSxTQUFpQixFQUFFLE1BQWtCLEVBQUUsT0FBK0IsRUFDNUYsV0FBMEIsRUFBRSxXQUFnRDtRQURoRixpQkF3Q0M7UUF2Q0csNEJBQUEsRUFBQSxrQkFBMEI7O1lBRXBCLGVBQWUsR0FBeUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7O1lBRTNGLE1BQU0sR0FBRyxlQUFlLENBQUMsSUFBSTtRQUUvQixzQkFBc0I7UUFDdEIsUUFBUTs7OztRQUFDLFVBQUMsWUFBc0I7O2dCQUN0QixVQUFVLEdBQXlCLEtBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQzs7Z0JBRW5HLEtBQUssR0FBeUIsU0FBUyxDQUN6QyxVQUFVOzs7O1lBQ1YsVUFBQyxRQUFrQjtnQkFDZixPQUFPLFFBQVEsQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDO1lBQzNDLENBQUMsR0FDRCxXQUFXLEVBQ1gsV0FBVyxDQUNkO1lBRUQsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQyxFQUFDO1FBRUYsZ0JBQWdCO1FBQ2hCLFFBQVE7Ozs7UUFBQyxVQUFDLFNBQW1CO1lBQ3pCLE9BQU8sS0FBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekUsQ0FBQyxFQUFDO1FBRUYscUJBQXFCO1FBQ3JCLEdBQUc7Ozs7UUFBQyxVQUFDLFFBQW1COzs7Z0JBQ3BCLEtBQXFCLElBQUEsYUFBQSxpQkFBQSxRQUFRLENBQUEsa0NBQUEsd0RBQUU7b0JBQTFCLElBQU0sTUFBTSxxQkFBQTtvQkFDYixJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTt3QkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpRUFBaUUsRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDdkYsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ2pDO2lCQUNKOzs7Ozs7Ozs7UUFDTCxDQUFDLEVBQUMsQ0FDTDtRQUVELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckUsQ0FBQzs7Ozs7Ozs7OztJQUVPLCtCQUFXOzs7Ozs7Ozs7SUFBbkIsVUFBb0IsR0FBVyxFQUFFLFNBQWlCLEVBQUUsTUFBa0IsRUFDbEUsT0FBK0IsRUFBRSxNQUE2QjtRQURsRSxpQkFpQkM7O1lBZFMsZUFBZSxHQUFtQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEdBQUcsS0FBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUM7UUFDekcsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUN2QixTQUFTOzs7O1FBQUMsVUFBQyxPQUFPO1lBQ2QsSUFBSSxPQUFPLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDdEI7aUJBQU07Z0JBQ0gsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUNkLEdBQUc7Ozs7Z0JBQUMsVUFBQyxRQUFtQjtvQkFDcEIsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQyxHQUFHLEtBQUEsRUFBRSxTQUFTLFdBQUEsRUFBRSxNQUFNLFFBQUEsRUFBRSxPQUFPLFNBQUEsRUFBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRSxDQUFDLEVBQUMsQ0FDTCxDQUFDO2FBQ0w7UUFDTCxDQUFDLEVBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQzs7Ozs7Ozs7OztJQUVPLGdDQUFZOzs7Ozs7Ozs7SUFBcEIsVUFBcUIsWUFBc0IsRUFBRSxTQUFpQixFQUFFLFNBQWlCLEVBQUUsTUFBa0IsRUFDakcsa0JBQTBDO1FBRDlDLGlCQW9DQzs7WUFqQ08sUUFBNEI7UUFDaEMsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLE9BQU8sRUFBRTtZQUUxQixJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRTtnQkFDOUIsTUFBTSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQzthQUNyQztZQUNELFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUV2RDthQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7WUFFakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JCLE1BQU0sS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzVCOztnQkFDSyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUM7O2dCQUM3RixXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO1lBRTlELFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztTQUVuRDthQUFNO1lBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyxvRUFBa0UsSUFBSSxDQUFDLE9BQU8sT0FBSSxDQUFDLENBQUM7U0FDdkc7O1lBRUssU0FBUyxHQUF5QixRQUFRLENBQUMsSUFBSSxDQUNqRCxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUNyQixHQUFHOzs7O1FBQUMsVUFBQyxXQUFtQjs7Z0JBQ2QsWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQzs7Z0JBQ2hFLE1BQU0sR0FDUixLQUFJLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQztZQUNoSCxPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDLEVBQUMsQ0FDTDtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7Ozs7Ozs7Ozs7SUFFTyxnQ0FBWTs7Ozs7Ozs7O0lBQXBCLFVBQXFCLFNBQW1CLEVBQUUsU0FBaUIsRUFBRSxTQUFpQixFQUFFLE1BQWtCLEVBQzlGLGtCQUEwQztRQUQ5QyxpQkFzQkM7UUFuQkcsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsbURBQW1EO1lBQ3hFLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNoQzthQUFNLEVBQUUseUNBQXlDO1lBRTlDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO2dCQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLHFGQUFxRixDQUFDLENBQUM7YUFDMUc7O2dCQUVLLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQzs7Z0JBQzFGLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7WUFFOUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQzVDLEdBQUc7Ozs7WUFBQyxVQUFDLFdBQW1COztvQkFDZCxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDOztvQkFDaEUsTUFBTSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsNEJBQTRCLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixDQUFDO2dCQUM5SCxPQUFPLE1BQU0sQ0FBQztZQUNsQixDQUFDLEVBQUMsQ0FDTCxDQUFDO1NBQ0w7SUFDTCxDQUFDOzs7Ozs7Ozs7SUFHTyxpQ0FBYTs7Ozs7Ozs7SUFBckIsVUFBc0IsR0FBVyxFQUFFLFNBQWlCLEVBQUUsTUFBa0IsRUFDcEUsa0JBQTBDO1FBRDlDLGlCQWVDOztZQVpTLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDOztZQUMxRCxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxJQUFJLENBQUM7O1lBQzFGLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFFOUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQzdDLEdBQUc7Ozs7UUFBQyxVQUFDLFdBQW1COztnQkFDZCxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDOztnQkFDaEUsTUFBTSxHQUNSLEtBQUksQ0FBQyxhQUFhLENBQUMsNkJBQTZCLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixDQUFDO1lBQzlHLE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUMsRUFBQyxDQUNMLENBQUM7SUFDTixDQUFDOzs7Ozs7OztJQUVELDJCQUFPOzs7Ozs7O0lBQVAsVUFBUSxHQUFXLEVBQUUsU0FBaUIsRUFBRSxNQUFrQixFQUN0RCxrQkFBMEM7UUFEOUMsaUJBZUM7O1lBWlMsVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7O1lBQzFELFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEtBQUssQ0FBQzs7WUFDM0YsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztRQUU5RCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FDN0MsR0FBRzs7OztRQUFDLFVBQUMsV0FBbUI7O2dCQUNkLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7O2dCQUNoRSxNQUFNLEdBQ1IsS0FBSSxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLENBQUM7WUFDN0csT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQyxFQUFDLENBQ0wsQ0FBQztJQUNOLENBQUM7Ozs7Ozs7SUFFRCwyQkFBTzs7Ozs7O0lBQVAsVUFBUSxTQUFpQixFQUFFLFNBQWlCLEVBQUUsS0FBYTtRQUEzRCxpQkFhQzs7WUFYUyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUM7O1lBQ3ZFLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQzs7WUFDMUQsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQztRQUVwRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FDaEQsR0FBRzs7OztRQUFDLFVBQUMsV0FBbUI7O2dCQUNkLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7O2dCQUNoRSxNQUFNLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztZQUM5RixPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDLEVBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQzs7Ozs7O0lBRUQsMkJBQU87Ozs7O0lBQVAsVUFBUSxHQUFXLEVBQUUsT0FBZTs7WUFDMUIsT0FBTyxHQUFHO1lBQ1osY0FBYyxFQUFFLFVBQVU7WUFDMUIsUUFBUSxFQUFFLDJCQUEyQjtTQUN4QztRQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sU0FBQSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FDNUUsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFDckIsS0FBSyxFQUFFLENBQUUsbUZBQW1GO1NBQy9GLENBQUM7SUFDTixDQUFDOzs7OztJQUVELDBCQUFNOzs7O0lBQU4sVUFBTyxHQUFXOztZQUNSLE9BQU8sR0FBRztZQUNaLFFBQVEsRUFBRSwyQkFBMkI7U0FDeEM7UUFDRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sU0FBQSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FDbEUsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FDeEIsQ0FBQztJQUNOLENBQUM7O2dCQTlPSixVQUFVOzs7O2dEQVVGLE1BQU0sU0FBQyxZQUFZO2dCQS9CbkIsVUFBVTtnREFpQ1YsTUFBTSxTQUFDLFVBQVU7O0lBbU8xQixnQkFBQztDQUFBLEFBL09ELElBK09DO1NBOU9ZLFNBQVM7Ozs7OztJQUVsQiw0QkFBMkI7Ozs7O0lBQzNCLGtDQUEyQjs7Ozs7SUFDM0Isb0NBQTZCOzs7OztJQUM3QixrQ0FBcUM7Ozs7O0lBQ3JDLDBCQUF1Qzs7Ozs7SUFJbkMsOEJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgV3BzTWFyc2hhbGxlciwgV3BzSW5wdXQsIFdwc1ZlcmlvbiwgV3BzUmVzdWx0LCBXcHNPdXRwdXREZXNjcmlwdGlvbiwgV3BzRGF0YSwgV3BzU3RhdGUsIGlzV3BzU3RhdGUsIFdwc0RhdGFEZXNjcmlwdGlvbiB9IGZyb20gJy4vd3BzX2RhdGF0eXBlcyc7XHJcbmltcG9ydCB7IFdwc01hcnNoYWxsZXIxMDAgfSBmcm9tICcuL3dwczEwMC93cHNfbWFyc2hhbGxlcl8xLjAuMCc7XHJcbmltcG9ydCB7IFdwc01hcnNoYWxsZXIyMDAgfSBmcm9tICcuL3dwczIwMC93cHNfbWFyc2hhbGxlcl8yLjAuMCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCwgc3dpdGNoTWFwLCB0YXAsIHNoYXJlLCBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0ICogYXMgWExpbmtfMV8wX0ZhY3RvcnkgZnJvbSAndzNjLXNjaGVtYXMvbGliL1hMaW5rXzFfMCc7IGNvbnN0IFhMaW5rXzFfMCA9IFhMaW5rXzFfMF9GYWN0b3J5LlhMaW5rXzFfMDtcclxuaW1wb3J0ICogYXMgT1dTXzFfMV8wX0ZhY3RvcnkgZnJvbSAnb2djLXNjaGVtYXMvbGliL09XU18xXzFfMCc7IGNvbnN0IE9XU18xXzFfMCA9IE9XU18xXzFfMF9GYWN0b3J5Lk9XU18xXzFfMDtcclxuaW1wb3J0ICogYXMgT1dTXzJfMF9GYWN0b3J5IGZyb20gJ29nYy1zY2hlbWFzL2xpYi9PV1NfMl8wJzsgY29uc3QgT1dTXzJfMCA9IE9XU18yXzBfRmFjdG9yeS5PV1NfMl8wO1xyXG5pbXBvcnQgKiBhcyBXUFNfMV8wXzBfRmFjdG9yeSBmcm9tICdvZ2Mtc2NoZW1hcy9saWIvV1BTXzFfMF8wJzsgY29uc3QgV1BTXzFfMF8wID0gV1BTXzFfMF8wX0ZhY3RvcnkuV1BTXzFfMF8wO1xyXG5pbXBvcnQgKiBhcyBXUFNfMl8wX0ZhY3RvcnkgZnJvbSAnb2djLXNjaGVtYXMvbGliL1dQU18yXzAnOyBjb25zdCBXUFNfMl8wID0gV1BTXzJfMF9GYWN0b3J5LldQU18yXzA7XHJcbmltcG9ydCB7IHBvbGxVbnRpbCwgZGVsYXllZFJldHJ5IH0gZnJvbSAnLi91dGlscy9wb2xsaW5nJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEpzb25peCB9IGZyb20gJ0Bib3VuZGxlc3NnZW8vanNvbml4JztcclxuaW1wb3J0IHsgQ2FjaGUsIEZha2VDYWNoZSB9IGZyb20gJy4vY2FjaGUnO1xyXG5cclxuXHJcblxyXG4vKipcclxuICogVGhlIFdwcy1jbGllbnQgYWJzdHJhY3RzIGF3YXkgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gV3BzMS4wLjAgYW5kIFdwczIuMC4wXHJcbiAqIFRoZXJlIGFyZSB0d28gbGF5ZXJzIG9mIG1hcnNoYWxsaW5nOlxyXG4gKiAgLSB0aGUgV3BzLW1hcnNoYWxsZXIgbWFyc2hhbHMgdXNlci1mYWNpbmcgZGF0YSB0byB3cHMtc3BlY2lmaWMgdHlwZXNcclxuICogIC0gSnNvbml4IG1hcnNoYWxzIHdwcy1zcGVjaWZpYyBkYXRhIHRvIHhtbC5cclxuICogdXNlci1mYWNpbmcgZGF0YSAtPiB3cHNtYXJzaGFsbGVyIC0+IFdwcy10eXBlLXNwZWNpZmljIGRhdGEgLT4gSnNvbml4LW1hcmhzYWxsZXIgLT4gWE1MIC0+XHJcbiAqIC0+IHdlYmNsaWVudCAtPiBXUFMgLT4gWE1MIC0+IEpzb25peC11bm1hcnNoYWxsZXIgLT4gV3BzLXR5cGUtc3BlY2lmaWMgZGF0YSAtPiB3cHNtYXJzaGFsbGVyIC0+IHVzZXItZmFjaW5nIGRhdGFcclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFdwc0NsaWVudCB7XHJcblxyXG4gICAgcHJpdmF0ZSB2ZXJzaW9uOiBXcHNWZXJpb247XHJcbiAgICBwcml2YXRlIHhtbG1hcnNoYWxsZXI6IGFueTtcclxuICAgIHByaXZhdGUgeG1sdW5tYXJzaGFsbGVyOiBhbnk7XHJcbiAgICBwcml2YXRlIHdwc21hcnNoYWxsZXI6IFdwc01hcnNoYWxsZXI7XHJcbiAgICBwcml2YXRlIGNhY2hlOiBDYWNoZSA9IG5ldyBGYWtlQ2FjaGUoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBASW5qZWN0KCdXcHNWZXJzaW9uJykgdmVyc2lvbjogV3BzVmVyaW9uID0gJzEuMC4wJyxcclxuICAgICAgICBwcml2YXRlIHdlYmNsaWVudDogSHR0cENsaWVudCxcclxuICAgICAgICBASW5qZWN0KCdXcHNDYWNoZScpIGNhY2hlPzogQ2FjaGVcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb247XHJcbiAgICAgICAgaWYgKGNhY2hlKSB0aGlzLmNhY2hlID0gY2FjaGU7XHJcbiAgICAgICAgbGV0IGNvbnRleHQ7XHJcbiAgICAgICAgaWYgKHRoaXMudmVyc2lvbiA9PT0gJzEuMC4wJykge1xyXG4gICAgICAgICAgICB0aGlzLndwc21hcnNoYWxsZXIgPSBuZXcgV3BzTWFyc2hhbGxlcjEwMCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0ID0gbmV3IEpzb25peC5Db250ZXh0KFtYTGlua18xXzAsIE9XU18xXzFfMCwgV1BTXzFfMF8wXSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24gPT09ICcyLjAuMCcpIHtcclxuICAgICAgICAgICAgdGhpcy53cHNtYXJzaGFsbGVyID0gbmV3IFdwc01hcnNoYWxsZXIyMDAoKTtcclxuICAgICAgICAgICAgY29udGV4dCA9IG5ldyBKc29uaXguQ29udGV4dChbWExpbmtfMV8wLCBPV1NfMl8wLCBXUFNfMl8wXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgZW50ZXJlZCBhIFdQUyB2ZXJzaW9uIG90aGVyIHRoYW4gMS4wLjAgb3IgMi4wLjAuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueG1sdW5tYXJzaGFsbGVyID0gY29udGV4dC5jcmVhdGVVbm1hcnNoYWxsZXIoKTtcclxuICAgICAgICB0aGlzLnhtbG1hcnNoYWxsZXIgPSBjb250ZXh0LmNyZWF0ZU1hcnNoYWxsZXIoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0Q2FwYWJpbGl0aWVzKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBjb25zdCBnZXRDYXBhYmlsaXRpZXNVcmwgPSB0aGlzLndwc21hcnNoYWxsZXIuZ2V0Q2FwYWJpbGl0aWVzVXJsKHVybCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmF3KGdldENhcGFiaWxpdGllc1VybCkucGlwZShcclxuICAgICAgICAgICAgbWFwKChyZXNwb25zZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZUpzb24gPSB0aGlzLnhtbHVubWFyc2hhbGxlci51bm1hcnNoYWxTdHJpbmcocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud3BzbWFyc2hhbGxlci51bm1hcnNoYWxDYXBhYmlsaXRpZXMocmVzcG9uc2VKc29uLnZhbHVlKTtcclxuICAgICAgICAgICAgfSkgLy8gQFRPRE86IGhhbmRsZSBjYXNlIHdoZW4gaW5zdGVhZCBvZiBXcHNDYXBhYmlsaXRlcyBhbiBFeGNlcHRpb25SZXBvcnQgaXMgcmV0dXJuZWRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkZXNjcmliZVByb2Nlc3MocHJvY2Vzc0lkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkIHlldCcpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBleGVjdXRlQXN5bmModXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBpbnB1dHM6IFdwc0lucHV0W10sIG91dHB1dHM6IFdwc091dHB1dERlc2NyaXB0aW9uW10sXHJcbiAgICAgICAgcG9sbGluZ1JhdGU6IG51bWJlciA9IDEwMDAsIHRhcEZ1bmN0aW9uPzogKHJlc3BvbnNlOiBXcHNTdGF0ZSB8IG51bGwpID0+IGFueSk6IE9ic2VydmFibGU8V3BzUmVzdWx0W10+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZXhlY3V0ZVJlcXVlc3QkOiBPYnNlcnZhYmxlPFdwc1N0YXRlPiA9IHRoaXMuZXhlY3V0ZUFzeW5jUyh1cmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXRzKTtcclxuXHJcbiAgICAgICAgY29uc3QgcXVlcnkkID0gZXhlY3V0ZVJlcXVlc3QkLnBpcGUoXHJcblxyXG4gICAgICAgICAgICAvLyBwb2xsIHVudGlsIHN1Y2VlZGVkXHJcbiAgICAgICAgICAgIG1lcmdlTWFwKChjdXJyZW50U3RhdGU6IFdwc1N0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0U3RhdGUkOiBPYnNlcnZhYmxlPFdwc1N0YXRlPiA9IHRoaXMuZ2V0TmV4dFN0YXRlKGN1cnJlbnRTdGF0ZSwgdXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9sbCQ6IE9ic2VydmFibGU8V3BzU3RhdGU+ID0gcG9sbFVudGlsPFdwc1N0YXRlPihcclxuICAgICAgICAgICAgICAgICAgICBuZXh0U3RhdGUkLFxyXG4gICAgICAgICAgICAgICAgICAgIChyZXNwb25zZTogV3BzU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cyA9PT0gJ1N1Y2NlZWRlZCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0YXBGdW5jdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBwb2xsaW5nUmF0ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9sbCQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgLy8gZmV0Y2ggcmVzdWx0c1xyXG4gICAgICAgICAgICBtZXJnZU1hcCgobGFzdFN0YXRlOiBXcHNTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hSZXN1bHRzKGxhc3RTdGF0ZSwgdXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0cyk7XHJcbiAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgLy8gSW4gY2FzZSBvZiBlcnJvcnM6XHJcbiAgICAgICAgICAgIHRhcCgocmVzcG9uc2U6IFdwc0RhdGFbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCByZXN1bHQgb2YgcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmRlc2NyaXB0aW9uLnR5cGUgPT09ICdlcnJvcicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlcnZlciByZXNwb25kZWQgd2l0aCAyMDAsIGJ1dCBib2R5IGNvbnRhaW5lZCBhbiBlcnJvci1yZXN1bHQ6ICcsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWRRdWVyeSh1cmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXRzLCBxdWVyeSQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2FjaGVkUXVlcnkodXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBpbnB1dHM6IFdwc0lucHV0W10sXHJcbiAgICAgICAgb3V0cHV0czogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSwgcXVlcnkkOiBPYnNlcnZhYmxlPFdwc0RhdGFbXT4pOiBPYnNlcnZhYmxlPFdwc0RhdGFbXT4ge1xyXG5cclxuICAgICAgICBjb25zdCBjYWNoZWRSZXNwb25zZSQ6IE9ic2VydmFibGU8V3BzUmVzdWx0W10gfCBudWxsPiA9IHRoaXMuY2FjaGUuZ2V0KHt1cmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXRzfSk7XHJcbiAgICAgICAgcmV0dXJuIGNhY2hlZFJlc3BvbnNlJC5waXBlKFxyXG4gICAgICAgICAgICBzd2l0Y2hNYXAoKHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKHJlc3VsdHMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcXVlcnkkLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcCgocmVzcG9uc2U6IFdwc0RhdGFbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5zZXQoe3VybCwgcHJvY2Vzc0lkLCBpbnB1dHMsIG91dHB1dHN9LCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0TmV4dFN0YXRlKGN1cnJlbnRTdGF0ZTogV3BzU3RhdGUsIHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgaW5wdXRzOiBXcHNJbnB1dFtdLFxyXG4gICAgICAgIG91dHB1dERlc2NyaXB0aW9uczogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSk6IE9ic2VydmFibGU8V3BzU3RhdGU+IHtcclxuXHJcbiAgICAgICAgbGV0IHJlcXVlc3QkOiBPYnNlcnZhYmxlPHN0cmluZz47XHJcbiAgICAgICAgaWYgKHRoaXMudmVyc2lvbiA9PT0gJzEuMC4wJykge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50U3RhdGUuc3RhdHVzTG9jYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdObyBzdGF0dXMgbG9jYXRpb24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXF1ZXN0JCA9IHRoaXMuZ2V0UmF3KGN1cnJlbnRTdGF0ZS5zdGF0dXNMb2NhdGlvbik7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uID09PSAnMi4wLjAnKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRTdGF0ZS5qb2JJRCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ05vIGpvYi1JZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGV4ZWNib2R5ID0gdGhpcy53cHNtYXJzaGFsbGVyLm1hcnNoYWxsR2V0U3RhdHVzQm9keShzZXJ2ZXJVcmwsIHByb2Nlc3NJZCwgY3VycmVudFN0YXRlLmpvYklEKTtcclxuICAgICAgICAgICAgY29uc3QgeG1sRXhlY2JvZHkgPSB0aGlzLnhtbG1hcnNoYWxsZXIubWFyc2hhbFN0cmluZyhleGVjYm9keSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0JCA9IHRoaXMucG9zdFJhdyhzZXJ2ZXJVcmwsIHhtbEV4ZWNib2R5KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnR2V0U3RhdHVzJyBoYXMgbm90IHlldCBiZWVuIGltcGxlbWVudGVkIGZvciB0aGlzIFdQUy1WZXJzaW9uICgke3RoaXMudmVyc2lvbn0pLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVxdWVzdDEkOiBPYnNlcnZhYmxlPFdwc1N0YXRlPiA9IHJlcXVlc3QkLnBpcGUoXHJcbiAgICAgICAgICAgIGRlbGF5ZWRSZXRyeSgyMDAwLCAyKSxcclxuICAgICAgICAgICAgbWFwKCh4bWxSZXNwb25zZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uUmVzcG9uc2UgPSB0aGlzLnhtbHVubWFyc2hhbGxlci51bm1hcnNoYWxTdHJpbmcoeG1sUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0OiBXcHNEYXRhW10gfCBXcHNTdGF0ZSA9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cHNtYXJzaGFsbGVyLnVubWFyc2hhbEdldFN0YXRlUmVzcG9uc2UoanNvblJlc3BvbnNlLCBzZXJ2ZXJVcmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXREZXNjcmlwdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVxdWVzdDEkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmV0Y2hSZXN1bHRzKGxhc3RTdGF0ZTogV3BzU3RhdGUsIHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgaW5wdXRzOiBXcHNJbnB1dFtdLFxyXG4gICAgICAgIG91dHB1dERlc2NyaXB0aW9uczogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSk6IE9ic2VydmFibGU8V3BzRGF0YVtdPiB7XHJcblxyXG4gICAgICAgIGlmIChsYXN0U3RhdGUucmVzdWx0cykgeyAvLyBXUFMgMS4wOiByZXN1bHRzIHNob3VsZCBhbHJlYWR5IGJlIGluIGxhc3Qgc3RhdGVcclxuICAgICAgICAgICAgcmV0dXJuIG9mKGxhc3RTdGF0ZS5yZXN1bHRzKTtcclxuICAgICAgICB9IGVsc2UgeyAvLyBXUFMgMi4wOiBnZXQgcmVzdWx0cyB3aXRoIHBvc3QgcmVxdWVzdFxyXG5cclxuICAgICAgICAgICAgaWYgKCFsYXN0U3RhdGUuam9iSUQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgWW91IHdhbnQgbWUgdG8gZ2V0IGEgcmVzdWx0LCBidXQgSSBjYW4ndCBmaW5kIGEgam9iSWQuIEkgZG9uJ3Qga25vdyB3aGF0IHRvIGRvIG5vdyFgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZXhlY0JvZHkgPSB0aGlzLndwc21hcnNoYWxsZXIubWFyc2hhbGxHZXRSZXN1bHRCb2R5KHNlcnZlclVybCwgcHJvY2Vzc0lkLCBsYXN0U3RhdGUuam9iSUQpO1xyXG4gICAgICAgICAgICBjb25zdCB4bWxFeGVjQm9keSA9IHRoaXMueG1sbWFyc2hhbGxlci5tYXJzaGFsU3RyaW5nKGV4ZWNCb2R5KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvc3RSYXcoc2VydmVyVXJsLCB4bWxFeGVjQm9keSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcCgoeG1sUmVzcG9uc2U6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzb25SZXNwb25zZSA9IHRoaXMueG1sdW5tYXJzaGFsbGVyLnVubWFyc2hhbFN0cmluZyh4bWxSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gdGhpcy53cHNtYXJzaGFsbGVyLnVubWFyc2hhbFN5bmNFeGVjdXRlUmVzcG9uc2UoanNvblJlc3BvbnNlLCBzZXJ2ZXJVcmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXREZXNjcmlwdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgZXhlY3V0ZUFzeW5jUyh1cmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzSW5wdXRbXSxcclxuICAgICAgICBvdXRwdXREZXNjcmlwdGlvbnM6IFdwc091dHB1dERlc2NyaXB0aW9uW10pOiBPYnNlcnZhYmxlPFdwc1N0YXRlPiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGV4ZWN1dGVVcmwgPSB0aGlzLndwc21hcnNoYWxsZXIuZXhlY3V0ZVVybCh1cmwsIHByb2Nlc3NJZCk7XHJcbiAgICAgICAgY29uc3QgZXhlY2JvZHkgPSB0aGlzLndwc21hcnNoYWxsZXIubWFyc2hhbEV4ZWNCb2R5KHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXREZXNjcmlwdGlvbnMsIHRydWUpO1xyXG4gICAgICAgIGNvbnN0IHhtbEV4ZWNib2R5ID0gdGhpcy54bWxtYXJzaGFsbGVyLm1hcnNoYWxTdHJpbmcoZXhlY2JvZHkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wb3N0UmF3KGV4ZWN1dGVVcmwsIHhtbEV4ZWNib2R5KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHhtbFJlc3BvbnNlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb25SZXNwb25zZSA9IHRoaXMueG1sdW5tYXJzaGFsbGVyLnVubWFyc2hhbFN0cmluZyh4bWxSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXQ6IFdwc1N0YXRlID1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndwc21hcnNoYWxsZXIudW5tYXJzaGFsQXN5bmNFeGVjdXRlUmVzcG9uc2UoanNvblJlc3BvbnNlLCB1cmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXREZXNjcmlwdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGV4ZWN1dGUodXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBpbnB1dHM6IFdwc0lucHV0W10sXHJcbiAgICAgICAgb3V0cHV0RGVzY3JpcHRpb25zOiBXcHNPdXRwdXREZXNjcmlwdGlvbltdKTogT2JzZXJ2YWJsZTxXcHNSZXN1bHRbXT4ge1xyXG5cclxuICAgICAgICBjb25zdCBleGVjdXRlVXJsID0gdGhpcy53cHNtYXJzaGFsbGVyLmV4ZWN1dGVVcmwodXJsLCBwcm9jZXNzSWQpO1xyXG4gICAgICAgIGNvbnN0IGV4ZWNib2R5ID0gdGhpcy53cHNtYXJzaGFsbGVyLm1hcnNoYWxFeGVjQm9keShwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0RGVzY3JpcHRpb25zLCBmYWxzZSk7XHJcbiAgICAgICAgY29uc3QgeG1sRXhlY2JvZHkgPSB0aGlzLnhtbG1hcnNoYWxsZXIubWFyc2hhbFN0cmluZyhleGVjYm9keSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc3RSYXcoZXhlY3V0ZVVybCwgeG1sRXhlY2JvZHkpLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcCgoeG1sUmVzcG9uc2U6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QganNvblJlc3BvbnNlID0gdGhpcy54bWx1bm1hcnNoYWxsZXIudW5tYXJzaGFsU3RyaW5nKHhtbFJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dDogV3BzRGF0YVtdID1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndwc21hcnNoYWxsZXIudW5tYXJzaGFsU3luY0V4ZWN1dGVSZXNwb25zZShqc29uUmVzcG9uc2UsIHVybCwgcHJvY2Vzc0lkLCBpbnB1dHMsIG91dHB1dERlc2NyaXB0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzbWlzcyhzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGpvYklkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG5cclxuICAgICAgICBjb25zdCBkaXNtaXNzVXJsID0gdGhpcy53cHNtYXJzaGFsbGVyLmRpc21pc3NVcmwoc2VydmVyVXJsLCBwcm9jZXNzSWQsIGpvYklkKTtcclxuICAgICAgICBjb25zdCBkaXNtaXNzQm9keSA9IHRoaXMud3BzbWFyc2hhbGxlci5tYXJzaGFsRGlzbWlzc0JvZHkoam9iSWQpO1xyXG4gICAgICAgIGNvbnN0IHhtbERpc21pc3NCb2R5ID0gdGhpcy54bWxtYXJzaGFsbGVyLm1hcnNoYWxTdHJpbmcoZGlzbWlzc0JvZHkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wb3N0UmF3KGRpc21pc3NVcmwsIHhtbERpc21pc3NCb2R5KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHhtbFJlc3BvbnNlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb25SZXNwb25zZSA9IHRoaXMueG1sdW5tYXJzaGFsbGVyLnVubWFyc2hhbFN0cmluZyh4bWxSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXQgPSB0aGlzLndwc21hcnNoYWxsZXIudW5tYXJzaGFsRGlzbWlzc1Jlc3BvbnNlKGpzb25SZXNwb25zZSwgc2VydmVyVXJsLCBwcm9jZXNzSWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3RSYXcodXJsOiBzdHJpbmcsIHhtbEJvZHk6IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbCcsXHJcbiAgICAgICAgICAgICdBY2NlcHQnOiAndGV4dC94bWwsIGFwcGxpY2F0aW9uL3htbCdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLndlYmNsaWVudC5wb3N0KHVybCwgeG1sQm9keSwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KS5waXBlKFxyXG4gICAgICAgICAgICBkZWxheWVkUmV0cnkoMjAwMCwgMiksXHJcbiAgICAgICAgICAgIHNoYXJlKCkgIC8vIHR1cm5pbmcgaG90OiB0byBtYWtlIHN1cmUgdGhhdCBtdWx0aXBsZSBzdWJzY3JpYmVycyBkb250IGNhdXNlIG11bHRpcGxlIHJlcXVlc3RzXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYXcodXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7XHJcbiAgICAgICAgICAgICdBY2NlcHQnOiAndGV4dC94bWwsIGFwcGxpY2F0aW9uL3htbCdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLndlYmNsaWVudC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pLnBpcGUoXHJcbiAgICAgICAgICAgIGRlbGF5ZWRSZXRyeSgyMDAwLCAyKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIl19