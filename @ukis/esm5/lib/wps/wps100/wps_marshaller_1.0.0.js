/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wps100/wps_marshaller_1.0.0.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
var WpsMarshaller100 = /** @class */ (function () {
    function WpsMarshaller100() {
    }
    /**
     * @param {?} baseurl
     * @return {?}
     */
    WpsMarshaller100.prototype.getCapabilitiesUrl = /**
     * @param {?} baseurl
     * @return {?}
     */
    function (baseurl) {
        return baseurl + "?service=WPS&request=GetCapabilities&version=1.0.0";
    };
    /**
     * @param {?} baseurl
     * @param {?} processId
     * @return {?}
     */
    WpsMarshaller100.prototype.executeUrl = /**
     * @param {?} baseurl
     * @param {?} processId
     * @return {?}
     */
    function (baseurl, processId) {
        return baseurl + "?service=WPS&request=Execute&version=1.0.0&identifier=" + processId;
    };
    /**
     * @param {?} capabilities
     * @return {?}
     */
    WpsMarshaller100.prototype.unmarshalCapabilities = /**
     * @param {?} capabilities
     * @return {?}
     */
    function (capabilities) {
        /** @type {?} */
        var out = [];
        capabilities.processOfferings.process.forEach((/**
         * @param {?} process
         * @return {?}
         */
        function (process) {
            out.push({
                id: process.identifier.value
            });
        }));
        return out;
    };
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsMarshaller100.prototype.unmarshalSyncExecuteResponse = /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    function (responseJson, url, processId, inputs, outputDescriptions) {
        var e_1, _a;
        /** @type {?} */
        var out = [];
        if (responseJson.value.status.processFailed) { // Failure?
            out.push({
                description: {
                    id: responseJson.value.process.identifier.value,
                    reference: true,
                    type: 'error'
                },
                value: responseJson.value.statusLocation
            });
        }
        else if (responseJson.value.processOutputs) { // synchronous request?
            try {
                for (var _b = tslib_1.__values(responseJson.value.processOutputs.output), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var output = _c.value;
                    /** @type {?} */
                    var isReference = output.reference ? true : false;
                    /** @type {?} */
                    var datatype = void 0;
                    /** @type {?} */
                    var data = void 0;
                    /** @type {?} */
                    var format = void 0;
                    if (output.reference) {
                        datatype = 'complex';
                        data = output.reference.href || null;
                        format = (/** @type {?} */ (output.reference.mimeType));
                    }
                    else {
                        if (output.data && output.data.literalData) {
                            datatype = 'literal';
                            format = (/** @type {?} */ (output.data.literalData.dataType));
                        }
                        else if (output.data && output.data.complexData) {
                            datatype = 'complex';
                            format = (/** @type {?} */ (output.data.complexData.mimeType));
                        }
                        else {
                            datatype = 'bbox';
                            format = undefined;
                        }
                        // @ts-ignore
                        data = this.unmarshalOutputData(output.data);
                    }
                    out.push({
                        description: {
                            id: output.identifier.value,
                            format: format,
                            reference: isReference,
                            type: datatype
                        },
                        value: data,
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else if (responseJson.value.statusLocation) { // asynchronous request?
            out.push({
                description: {
                    id: responseJson.value.process.identifier.value,
                    reference: true,
                    type: 'status'
                },
                value: this.unmarshalGetStateResponse(responseJson, url, processId, inputs, outputDescriptions)
            });
        }
        return out;
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WpsMarshaller100.prototype.unmarshalOutputData = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        if (data.complexData) {
            switch (data.complexData.mimeType) {
                case 'application/vnd.geo+json':
                case 'application/json':
                    return data.complexData.content.map((/**
                     * @param {?} cont
                     * @return {?}
                     */
                    function (cont) { return JSON.parse(cont); }));
                case 'application/WMS':
                    return data.complexData.content;
                case 'text/xml':
                    return new XMLSerializer().serializeToString(data.complexData.content[0]); // @TODO: better: handle actual xml-data
                default:
                    throw new Error("Cannot unmarshal data of format " + data.complexData.mimeType);
            }
        }
        else if (data.literalData) {
            switch (data.literalData.dataType) {
                case 'string':
                default:
                    return data.literalData.value;
            }
        }
        throw new Error("Not yet implemented: " + data);
    };
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsMarshaller100.prototype.unmarshalAsyncExecuteResponse = /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    function (responseJson, url, processId, inputs, outputDescriptions) {
        return this.unmarshalGetStateResponse(responseJson, url, processId, inputs, outputDescriptions);
    };
    /**
     * @param {?} responseJson
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsMarshaller100.prototype.unmarshalGetStateResponse = /**
     * @param {?} responseJson
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    function (responseJson, serverUrl, processId, inputs, outputDescriptions) {
        /** @type {?} */
        var response = responseJson.value;
        /** @type {?} */
        var status = response.status.processSucceeded ? 'Succeeded' :
            response.status.processAccepted ? 'Accepted' :
                response.status.processStarted ? 'Running' :
                    response.status.processFailed ? 'Failed' :
                        'Failed';
        /** @type {?} */
        var state = {
            status: status,
            statusLocation: response.statusLocation,
        };
        if (response.processOutputs && response.processOutputs.output) {
            state.results = this.unmarshalSyncExecuteResponse(responseJson, serverUrl, processId, inputs, outputDescriptions);
        }
        return state;
    };
    /**
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} async
     * @return {?}
     */
    WpsMarshaller100.prototype.marshalExecBody = /**
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} async
     * @return {?}
     */
    function (processId, inputs, outputs, async) {
        /** @type {?} */
        var wps1Inputs = this.marshalInputs(inputs);
        /** @type {?} */
        var wps1ResponseForm = this.marshalResponseForm(outputs, async);
        /** @type {?} */
        var bodyValue = {
            dataInputs: wps1Inputs,
            identifier: processId,
            responseForm: wps1ResponseForm,
            service: 'WPS',
            version: '1.0.0'
        };
        /** @type {?} */
        var body = {
            name: {
                key: '{http://www.opengis.net/wps/1.0.0}Execute',
                localPart: 'Execute',
                namespaceURI: 'http://www.opengis.net/wps/1.0.0',
                prefix: 'wps',
                string: '{http://www.opengis.net/wps/1.0.0}wps:Execute'
            },
            value: bodyValue
        };
        return body;
    };
    /**
     * @protected
     * @param {?} outputs
     * @param {?=} async
     * @return {?}
     */
    WpsMarshaller100.prototype.marshalResponseForm = /**
     * @protected
     * @param {?} outputs
     * @param {?=} async
     * @return {?}
     */
    function (outputs, async) {
        var e_2, _a;
        if (async === void 0) { async = false; }
        /** @type {?} */
        var outputDefinitions = [];
        try {
            for (var outputs_1 = tslib_1.__values(outputs), outputs_1_1 = outputs_1.next(); !outputs_1_1.done; outputs_1_1 = outputs_1.next()) {
                var output = outputs_1_1.value;
                /** @type {?} */
                var defType = void 0;
                switch (output.type) {
                    case 'literal':
                        defType = {
                            identifier: { value: output.id },
                            asReference: output.reference,
                            mimeType: output.format
                        };
                        break;
                    case 'complex':
                        defType = {
                            identifier: { value: output.id },
                            asReference: output.reference,
                            mimeType: output.format
                        };
                        break;
                    default:
                        throw new Error("This Wps-outputtype has not been implemented yet! " + output + " ");
                }
                outputDefinitions.push(defType);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (outputs_1_1 && !outputs_1_1.done && (_a = outputs_1.return)) _a.call(outputs_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        /** @type {?} */
        var responseDocument = {
            output: outputDefinitions,
            status: async ? true : false,
            storeExecuteResponse: async ? true : false
        };
        /** @type {?} */
        var form = {
            responseDocument: responseDocument
        };
        return form;
    };
    /**
     * @protected
     * @param {?} inputArr
     * @return {?}
     */
    WpsMarshaller100.prototype.marshalInputs = /**
     * @protected
     * @param {?} inputArr
     * @return {?}
     */
    function (inputArr) {
        var e_3, _a;
        /** @type {?} */
        var theInputs = [];
        try {
            for (var inputArr_1 = tslib_1.__values(inputArr), inputArr_1_1 = inputArr_1.next(); !inputArr_1_1.done; inputArr_1_1 = inputArr_1.next()) {
                var inp = inputArr_1_1.value;
                if (inp.value === null || inp.value === undefined) {
                    throw new Error("Value for input " + inp.description.id + " is not set");
                }
                /** @type {?} */
                var marshalledInput = this.marshalInput(inp);
                theInputs.push(marshalledInput);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (inputArr_1_1 && !inputArr_1_1.done && (_a = inputArr_1.return)) _a.call(inputArr_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        /** @type {?} */
        var inputs = {
            input: theInputs
        };
        return inputs;
    };
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    WpsMarshaller100.prototype.marshalInput = /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    function (input) {
        /** @type {?} */
        var id = input.description.id;
        /** @type {?} */
        var title = input.description.id;
        /** @type {?} */
        var abstract = '';
        /** @type {?} */
        var inputType = {
            identifier: { value: id },
            title: { value: title },
            _abstract: { value: abstract }
        };
        if (input.description.reference) {
            inputType.reference = this.marshalReferenceInput(input);
        }
        else {
            inputType.data = this.marshalDataInput(input);
        }
        return inputType;
    };
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    WpsMarshaller100.prototype.marshalDataInput = /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    function (input) {
        /** @type {?} */
        var data;
        switch (input.description.type) {
            case 'literal':
                data = {
                    literalData: { value: String(input.value) }
                };
                break;
            case 'bbox':
                /** @type {?} */
                var values = input.value;
                data = {
                    boundingBoxData: {
                        lowerCorner: [values.lllat, values.lllon],
                        upperCorner: [values.urlat, values.urlon]
                    }
                };
                break;
            case 'complex':
                switch (input.description.format) {
                    case 'text/xml':
                        data = {
                            complexData: {
                                content: [input.value],
                                // @TODO: we assume here that text/xml-data is already stringified
                                mimeType: input.description.format
                            }
                        };
                        break;
                    default:
                        data = {
                            complexData: {
                                content: [JSON.stringify(input.value)],
                                mimeType: input.description.format
                            }
                        };
                }
                break;
            default:
                throw Error("This input is of type " + input.description.type + ". We can only marshal input of type literal, bbox or complex.");
        }
        return data;
    };
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    WpsMarshaller100.prototype.marshalReferenceInput = /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    function (input) {
        /** @type {?} */
        var ref = {
            href: input.value,
            method: 'GET',
            mimeType: input.description.format
        };
        return ref;
    };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} statusId
     * @return {?}
     */
    WpsMarshaller100.prototype.marshallGetStatusBody = /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} statusId
     * @return {?}
     */
    function (serverUrl, processId, statusId) {
        // WPS-1.0 does not send a body with a GetStatus request.
        return {};
    };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobID
     * @return {?}
     */
    WpsMarshaller100.prototype.marshallGetResultBody = /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobID
     * @return {?}
     */
    function (serverUrl, processId, jobID) {
        // WPS-1.0 does not send a body with a GetStatus request.
        return {};
    };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    WpsMarshaller100.prototype.dismissUrl = /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    function (serverUrl, processId, jobId) {
        /** this does only work in geoserver:
        return `${serverUrl}?service=WPS&version=1.0.0&request=Dismiss&executionId=${jobId}`; */
        throw new Error('Wps 1.0 does not support Dismiss-operations.');
    };
    /**
     * @param {?} processId
     * @return {?}
     */
    WpsMarshaller100.prototype.marshalDismissBody = /**
     * @param {?} processId
     * @return {?}
     */
    function (processId) {
        throw new Error('Wps 1.0 does not support Dismiss-operations.');
    };
    /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @return {?}
     */
    WpsMarshaller100.prototype.unmarshalDismissResponse = /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @return {?}
     */
    function (jsonResponse, serverUrl, processId) {
        throw new Error('Wps 1.0 does not support Dismiss-operations.');
    };
    return WpsMarshaller100;
}());
export { WpsMarshaller100 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3BzX21hcnNoYWxsZXJfMS4wLjAuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdWtpcy9zZXJ2aWNlcy1vZ2MvIiwic291cmNlcyI6WyJsaWIvd3BzL3dwczEwMC93cHNfbWFyc2hhbGxlcl8xLjAuMC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFTQTtJQUVJO0lBQWdCLENBQUM7Ozs7O0lBRWpCLDZDQUFrQjs7OztJQUFsQixVQUFtQixPQUFlO1FBQzlCLE9BQVUsT0FBTyx1REFBb0QsQ0FBQztJQUMxRSxDQUFDOzs7Ozs7SUFFRCxxQ0FBVTs7Ozs7SUFBVixVQUFXLE9BQWUsRUFBRSxTQUFpQjtRQUN6QyxPQUFVLE9BQU8sOERBQXlELFNBQVcsQ0FBQztJQUMxRixDQUFDOzs7OztJQUVELGdEQUFxQjs7OztJQUFyQixVQUFzQixZQUFpQzs7WUFDN0MsR0FBRyxHQUFvQixFQUFFO1FBQy9CLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTzs7OztRQUFDLFVBQUEsT0FBTztZQUNqRCxHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUNMLEVBQUUsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUs7YUFDL0IsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxFQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Ozs7Ozs7OztJQUVELHVEQUE0Qjs7Ozs7Ozs7SUFBNUIsVUFBNkIsWUFBaUMsRUFBRSxHQUFXLEVBQUUsU0FBaUIsRUFDMUYsTUFBa0IsRUFBRSxrQkFBMEM7OztZQUV4RCxHQUFHLEdBQWdCLEVBQUU7UUFFM0IsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBRSxXQUFXO1lBQ3RELEdBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQ0wsV0FBVyxFQUFFO29CQUNULEVBQUUsRUFBRSxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSztvQkFDL0MsU0FBUyxFQUFFLElBQUk7b0JBQ2YsSUFBSSxFQUFFLE9BQU87aUJBQ2hCO2dCQUNELEtBQUssRUFBRSxZQUFZLENBQUMsS0FBSyxDQUFDLGNBQWM7YUFDM0MsQ0FBQyxDQUFDO1NBQ047YUFBTSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUUsdUJBQXVCOztnQkFDbkUsS0FBcUIsSUFBQSxLQUFBLGlCQUFBLFlBQVksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQSxnQkFBQSw0QkFBRTtvQkFBMUQsSUFBTSxNQUFNLFdBQUE7O3dCQUNQLFdBQVcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUs7O3dCQUUvQyxRQUFRLFNBQXFEOzt3QkFDN0QsSUFBSSxTQUFBOzt3QkFDSixNQUFNLFNBQTJCO29CQUNyQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7d0JBQ2xCLFFBQVEsR0FBRyxTQUFTLENBQUM7d0JBQ3JCLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7d0JBQ3JDLE1BQU0sR0FBRyxtQkFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBaUIsQ0FBQztxQkFDdkQ7eUJBQU07d0JBQ0gsSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFOzRCQUN4QyxRQUFRLEdBQUcsU0FBUyxDQUFDOzRCQUNyQixNQUFNLEdBQUcsbUJBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFpQixDQUFDO3lCQUM5RDs2QkFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7NEJBQy9DLFFBQVEsR0FBRyxTQUFTLENBQUM7NEJBQ3JCLE1BQU0sR0FBRyxtQkFBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQWlCLENBQUM7eUJBQzlEOzZCQUFNOzRCQUNILFFBQVEsR0FBRyxNQUFNLENBQUM7NEJBQ2xCLE1BQU0sR0FBRyxTQUFTLENBQUM7eUJBQ3RCO3dCQUNELGFBQWE7d0JBQ2IsSUFBSSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ2hEO29CQUVELEdBQUcsQ0FBQyxJQUFJLENBQUM7d0JBQ0wsV0FBVyxFQUFFOzRCQUNULEVBQUUsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUs7NEJBQzNCLE1BQU0sRUFBRSxNQUFNOzRCQUNkLFNBQVMsRUFBRSxXQUFXOzRCQUN0QixJQUFJLEVBQUUsUUFBUTt5QkFDakI7d0JBQ0QsS0FBSyxFQUFFLElBQUk7cUJBQ2QsQ0FBQyxDQUFDO2lCQUNOOzs7Ozs7Ozs7U0FDSjthQUFNLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsRUFBRSx3QkFBd0I7WUFDcEUsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDTCxXQUFXLEVBQUU7b0JBQ1QsRUFBRSxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLO29CQUMvQyxTQUFTLEVBQUUsSUFBSTtvQkFDZixJQUFJLEVBQUUsUUFBUTtpQkFDakI7Z0JBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLENBQUM7YUFDbEcsQ0FBQyxDQUFDO1NBQ047UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Ozs7OztJQUVTLDhDQUFtQjs7Ozs7SUFBN0IsVUFBOEIsSUFBYztRQUN4QyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtnQkFDL0IsS0FBSywwQkFBMEIsQ0FBQztnQkFDaEMsS0FBSyxrQkFBa0I7b0JBQ25CLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRzs7OztvQkFBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQWhCLENBQWdCLEVBQUMsQ0FBQztnQkFDbEUsS0FBSyxpQkFBaUI7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BDLEtBQUssVUFBVTtvQkFDWCxPQUFPLElBQUksYUFBYSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztnQkFDdkg7b0JBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBbUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFVLENBQUMsQ0FBQzthQUN2RjtTQUNKO2FBQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3pCLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7Z0JBQy9CLEtBQUssUUFBUSxDQUFDO2dCQUNkO29CQUNJLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7YUFDckM7U0FDSjtRQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQXdCLElBQU0sQ0FBQyxDQUFDO0lBQ3BELENBQUM7Ozs7Ozs7OztJQUVELHdEQUE2Qjs7Ozs7Ozs7SUFBN0IsVUFBOEIsWUFBaUIsRUFBRSxHQUFXLEVBQUUsU0FBaUIsRUFBRSxNQUFrQixFQUFFLGtCQUF3QztRQUN6SSxPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUNwRyxDQUFDOzs7Ozs7Ozs7SUFFRCxvREFBeUI7Ozs7Ozs7O0lBQXpCLFVBQTBCLFlBQWlCLEVBQUUsU0FBaUIsRUFBRSxTQUFpQixFQUM3RSxNQUFpQixFQUFFLGtCQUF3Qzs7WUFFckQsUUFBUSxHQUFvQixZQUFZLENBQUMsS0FBSzs7WUFFOUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQy9ELFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDOUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM1QyxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzFDLFFBQVE7O1lBRUYsS0FBSyxHQUFhO1lBQ3BCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsY0FBYyxFQUFFLFFBQVEsQ0FBQyxjQUFjO1NBQzFDO1FBRUQsSUFBSSxRQUFRLENBQUMsY0FBYyxJQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO1lBQzNELEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1NBQ3JIO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7Ozs7Ozs7SUFFRCwwQ0FBZTs7Ozs7OztJQUFmLFVBQWdCLFNBQWlCLEVBQUUsTUFBa0IsRUFBRSxPQUErQixFQUFFLEtBQWM7O1lBRTVGLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQzs7WUFDdkMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7O1lBRTNELFNBQVMsR0FBWTtZQUN2QixVQUFVLEVBQUUsVUFBVTtZQUN0QixVQUFVLEVBQUUsU0FBUztZQUNyQixZQUFZLEVBQUUsZ0JBQWdCO1lBQzlCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsT0FBTyxFQUFFLE9BQU87U0FDbkI7O1lBRUssSUFBSSxHQUEyQjtZQUNqQyxJQUFJLEVBQUU7Z0JBQ0YsR0FBRyxFQUFFLDJDQUEyQztnQkFDaEQsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLFlBQVksRUFBRSxrQ0FBa0M7Z0JBQ2hELE1BQU0sRUFBRSxLQUFLO2dCQUNiLE1BQU0sRUFBRSwrQ0FBK0M7YUFDMUQ7WUFDRCxLQUFLLEVBQUUsU0FBUztTQUNuQjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBRWhCLENBQUM7Ozs7Ozs7SUFHUyw4Q0FBbUI7Ozs7OztJQUE3QixVQUE4QixPQUErQixFQUFFLEtBQWE7O1FBQWIsc0JBQUEsRUFBQSxhQUFhOztZQUVsRSxpQkFBaUIsR0FBbUMsRUFBRTs7WUFDNUQsS0FBcUIsSUFBQSxZQUFBLGlCQUFBLE9BQU8sQ0FBQSxnQ0FBQSxxREFBRTtnQkFBekIsSUFBTSxNQUFNLG9CQUFBOztvQkFDVCxPQUFPLFNBQThCO2dCQUN6QyxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7b0JBQ2pCLEtBQUssU0FBUzt3QkFDVixPQUFPLEdBQUc7NEJBQ04sVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUU7NEJBQ2hDLFdBQVcsRUFBRSxNQUFNLENBQUMsU0FBUzs0QkFDN0IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxNQUFNO3lCQUMxQixDQUFDO3dCQUNGLE1BQU07b0JBQ1YsS0FBSyxTQUFTO3dCQUNWLE9BQU8sR0FBRzs0QkFDTixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRTs0QkFDaEMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxTQUFTOzRCQUM3QixRQUFRLEVBQUUsTUFBTSxDQUFDLE1BQU07eUJBQzFCLENBQUM7d0JBQ0YsTUFBTTtvQkFDVjt3QkFDSSxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUFxRCxNQUFNLE1BQUcsQ0FBQyxDQUFDO2lCQUN2RjtnQkFDRCxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbkM7Ozs7Ozs7Ozs7WUFFSyxnQkFBZ0IsR0FBeUI7WUFDM0MsTUFBTSxFQUFFLGlCQUFpQjtZQUN6QixNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUs7WUFDNUIsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUs7U0FDN0M7O1lBRUssSUFBSSxHQUFxQjtZQUMzQixnQkFBZ0Isa0JBQUE7U0FDbkI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOzs7Ozs7SUFHUyx3Q0FBYTs7Ozs7SUFBdkIsVUFBd0IsUUFBb0I7OztZQUNsQyxTQUFTLEdBQWdCLEVBQUU7O1lBQ2pDLEtBQWtCLElBQUEsYUFBQSxpQkFBQSxRQUFRLENBQUEsa0NBQUEsd0RBQUU7Z0JBQXZCLElBQU0sR0FBRyxxQkFBQTtnQkFDVixJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO29CQUMvQyxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFtQixHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsZ0JBQWEsQ0FBQyxDQUFDO2lCQUN2RTs7b0JBQ0ssZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDO2dCQUM5QyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQ25DOzs7Ozs7Ozs7O1lBQ0ssTUFBTSxHQUFtQjtZQUMzQixLQUFLLEVBQUUsU0FBUztTQUNuQjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Ozs7OztJQUVTLHVDQUFZOzs7OztJQUF0QixVQUF1QixLQUFlOztZQUM1QixFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFOztZQUN6QixLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFOztZQUM1QixRQUFRLEdBQUcsRUFBRTs7WUFFYixTQUFTLEdBQWM7WUFDekIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUN6QixLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQ3ZCLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7U0FDakM7UUFFRCxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO1lBQzdCLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzNEO2FBQU07WUFDSCxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqRDtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7Ozs7OztJQUVTLDJDQUFnQjs7Ozs7SUFBMUIsVUFBMkIsS0FBZTs7WUFDbEMsSUFBYztRQUNsQixRQUFRLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFO1lBQzVCLEtBQUssU0FBUztnQkFDVixJQUFJLEdBQUc7b0JBQ0gsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7aUJBQzlDLENBQUM7Z0JBQ0YsTUFBTTtZQUNWLEtBQUssTUFBTTs7b0JBQ0QsTUFBTSxHQUFpQixLQUFLLENBQUMsS0FBSztnQkFDeEMsSUFBSSxHQUFHO29CQUNILGVBQWUsRUFBRTt3QkFDYixXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUM7d0JBQ3pDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQztxQkFDNUM7aUJBQ0osQ0FBQztnQkFDRixNQUFNO1lBQ1YsS0FBSyxTQUFTO2dCQUNWLFFBQVEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7b0JBQzlCLEtBQUssVUFBVTt3QkFDWCxJQUFJLEdBQUc7NEJBQ0gsV0FBVyxFQUFFO2dDQUNULE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7O2dDQUN0QixRQUFRLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNOzZCQUNyQzt5QkFDSixDQUFDO3dCQUNGLE1BQU07b0JBQ1Y7d0JBQ0ksSUFBSSxHQUFHOzRCQUNILFdBQVcsRUFBRTtnQ0FDVCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQ0FDdEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTTs2QkFDckM7eUJBQ0osQ0FBQztpQkFDVDtnQkFDRCxNQUFNO1lBQ1Y7Z0JBQ0ksTUFBTSxLQUFLLENBQUMsMkJBQXlCLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxrRUFBK0QsQ0FBQyxDQUFDO1NBQ25JO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7Ozs7O0lBRVMsZ0RBQXFCOzs7OztJQUEvQixVQUFnQyxLQUFlOztZQUNyQyxHQUFHLEdBQXVCO1lBQzVCLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSztZQUNqQixNQUFNLEVBQUUsS0FBSztZQUNiLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU07U0FDckM7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Ozs7Ozs7SUFFRCxnREFBcUI7Ozs7OztJQUFyQixVQUFzQixTQUFpQixFQUFFLFNBQWlCLEVBQUUsUUFBZ0I7UUFDeEUseURBQXlEO1FBQ3pELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7Ozs7OztJQUVELGdEQUFxQjs7Ozs7O0lBQXJCLFVBQXNCLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxLQUFhO1FBQ3JFLHlEQUF5RDtRQUN6RCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7Ozs7Ozs7SUFFRCxxQ0FBVTs7Ozs7O0lBQVYsVUFBVyxTQUFpQixFQUFFLFNBQWlCLEVBQUUsS0FBYTtRQUMxRDtnR0FDd0Y7UUFDeEYsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7Ozs7O0lBRUQsNkNBQWtCOzs7O0lBQWxCLFVBQW1CLFNBQWlCO1FBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztJQUNwRSxDQUFDOzs7Ozs7O0lBRUQsbURBQXdCOzs7Ozs7SUFBeEIsVUFBeUIsWUFBaUIsRUFBRSxTQUFpQixFQUFFLFNBQWlCO1FBQzVFLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUFDLEFBMVRELElBMFRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgV3BzTWFyc2hhbGxlciwgV3BzSW5wdXQsIFdwc091dHB1dERlc2NyaXB0aW9uLCBXcHNSZXN1bHQsIFdwc0NhcGFiaWxpdHksIFdwc0Jib3hWYWx1ZSwgV3BzRGF0YSwgV3BzRGF0YURlc2NyaXB0aW9uLCBXcHNTdGF0ZSwgV3BzRGF0YUZvcm1hdCB9IGZyb20gJy4uL3dwc19kYXRhdHlwZXMnO1xyXG5pbXBvcnQge1xyXG4gICAgV1BTQ2FwYWJpbGl0aWVzVHlwZSwgSVdwc0V4ZWN1dGVQcm9jZXNzQm9keSwgRXhlY3V0ZSwgRGF0YUlucHV0c1R5cGUsXHJcbiAgICBJbnB1dFR5cGUsIFJlc3BvbnNlRm9ybVR5cGUsIERhdGFUeXBlLCBJV3BzRXhlY3V0ZVJlc3BvbnNlLCBEb2N1bWVudE91dHB1dERlZmluaXRpb25UeXBlLFxyXG4gICAgUmVzcG9uc2VEb2N1bWVudFR5cGUsIElucHV0UmVmZXJlbmNlVHlwZSwgTGl0ZXJhbERhdGFUeXBlLCBFeGVjdXRlUmVzcG9uc2VcclxufSBmcm9tICcuL3dwc18xLjAuMCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBXcHNNYXJzaGFsbGVyMTAwIGltcGxlbWVudHMgV3BzTWFyc2hhbGxlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgICBnZXRDYXBhYmlsaXRpZXNVcmwoYmFzZXVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYCR7YmFzZXVybH0/c2VydmljZT1XUFMmcmVxdWVzdD1HZXRDYXBhYmlsaXRpZXMmdmVyc2lvbj0xLjAuMGA7XHJcbiAgICB9XHJcblxyXG4gICAgZXhlY3V0ZVVybChiYXNldXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYCR7YmFzZXVybH0/c2VydmljZT1XUFMmcmVxdWVzdD1FeGVjdXRlJnZlcnNpb249MS4wLjAmaWRlbnRpZmllcj0ke3Byb2Nlc3NJZH1gO1xyXG4gICAgfVxyXG5cclxuICAgIHVubWFyc2hhbENhcGFiaWxpdGllcyhjYXBhYmlsaXRpZXM6IFdQU0NhcGFiaWxpdGllc1R5cGUpOiBXcHNDYXBhYmlsaXR5W10ge1xyXG4gICAgICAgIGNvbnN0IG91dDogV3BzQ2FwYWJpbGl0eVtdID0gW107XHJcbiAgICAgICAgY2FwYWJpbGl0aWVzLnByb2Nlc3NPZmZlcmluZ3MucHJvY2Vzcy5mb3JFYWNoKHByb2Nlc3MgPT4ge1xyXG4gICAgICAgICAgICBvdXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBpZDogcHJvY2Vzcy5pZGVudGlmaWVyLnZhbHVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgdW5tYXJzaGFsU3luY0V4ZWN1dGVSZXNwb25zZShyZXNwb25zZUpzb246IElXcHNFeGVjdXRlUmVzcG9uc2UsIHVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZyxcclxuICAgICAgICBpbnB1dHM6IFdwc0lucHV0W10sIG91dHB1dERlc2NyaXB0aW9uczogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSk6IFdwc1Jlc3VsdFtdIHtcclxuXHJcbiAgICAgICAgY29uc3Qgb3V0OiBXcHNSZXN1bHRbXSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2VKc29uLnZhbHVlLnN0YXR1cy5wcm9jZXNzRmFpbGVkKSB7IC8vIEZhaWx1cmU/XHJcbiAgICAgICAgICAgIG91dC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJlc3BvbnNlSnNvbi52YWx1ZS5wcm9jZXNzLmlkZW50aWZpZXIudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVzcG9uc2VKc29uLnZhbHVlLnN0YXR1c0xvY2F0aW9uXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VKc29uLnZhbHVlLnByb2Nlc3NPdXRwdXRzKSB7IC8vIHN5bmNocm9ub3VzIHJlcXVlc3Q/XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgb3V0cHV0IG9mIHJlc3BvbnNlSnNvbi52YWx1ZS5wcm9jZXNzT3V0cHV0cy5vdXRwdXQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzUmVmZXJlbmNlID0gb3V0cHV0LnJlZmVyZW5jZSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YXR5cGU6ICdsaXRlcmFsJyB8ICdjb21wbGV4JyB8ICdiYm94JyB8ICdzdGF0dXMnIHwgJ2Vycm9yJztcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhO1xyXG4gICAgICAgICAgICAgICAgbGV0IGZvcm1hdDogV3BzRGF0YUZvcm1hdCB8IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGlmIChvdXRwdXQucmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGUgPSAnY29tcGxleCc7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG91dHB1dC5yZWZlcmVuY2UuaHJlZiB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IG91dHB1dC5yZWZlcmVuY2UubWltZVR5cGUgYXMgV3BzRGF0YUZvcm1hdDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dC5kYXRhICYmIG91dHB1dC5kYXRhLmxpdGVyYWxEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlID0gJ2xpdGVyYWwnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBvdXRwdXQuZGF0YS5saXRlcmFsRGF0YS5kYXRhVHlwZSBhcyBXcHNEYXRhRm9ybWF0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3V0cHV0LmRhdGEgJiYgb3V0cHV0LmRhdGEuY29tcGxleERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGUgPSAnY29tcGxleCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IG91dHB1dC5kYXRhLmNvbXBsZXhEYXRhLm1pbWVUeXBlIGFzIFdwc0RhdGFGb3JtYXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGUgPSAnYmJveCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLnVubWFyc2hhbE91dHB1dERhdGEob3V0cHV0LmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG91dC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogb3V0cHV0LmlkZW50aWZpZXIudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogZm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IGlzUmVmZXJlbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhdHlwZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VKc29uLnZhbHVlLnN0YXR1c0xvY2F0aW9uKSB7IC8vIGFzeW5jaHJvbm91cyByZXF1ZXN0P1xyXG4gICAgICAgICAgICBvdXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiByZXNwb25zZUpzb24udmFsdWUucHJvY2Vzcy5pZGVudGlmaWVyLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RhdHVzJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnVubWFyc2hhbEdldFN0YXRlUmVzcG9uc2UocmVzcG9uc2VKc29uLCB1cmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXREZXNjcmlwdGlvbnMpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdW5tYXJzaGFsT3V0cHV0RGF0YShkYXRhOiBEYXRhVHlwZSk6IGFueSB7XHJcbiAgICAgICAgaWYgKGRhdGEuY29tcGxleERhdGEpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChkYXRhLmNvbXBsZXhEYXRhLm1pbWVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdhcHBsaWNhdGlvbi92bmQuZ2VvK2pzb24nOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnYXBwbGljYXRpb24vanNvbic6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuY29tcGxleERhdGEuY29udGVudC5tYXAoY29udCA9PiBKU09OLnBhcnNlKGNvbnQpKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FwcGxpY2F0aW9uL1dNUyc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuY29tcGxleERhdGEuY29udGVudDtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQveG1sJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyhkYXRhLmNvbXBsZXhEYXRhLmNvbnRlbnRbMF0pOyAvLyBAVE9ETzogYmV0dGVyOiBoYW5kbGUgYWN0dWFsIHhtbC1kYXRhXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHVubWFyc2hhbCBkYXRhIG9mIGZvcm1hdCAke2RhdGEuY29tcGxleERhdGEubWltZVR5cGV9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGl0ZXJhbERhdGEpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChkYXRhLmxpdGVyYWxEYXRhLmRhdGFUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5saXRlcmFsRGF0YS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3QgeWV0IGltcGxlbWVudGVkOiAke2RhdGF9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5tYXJzaGFsQXN5bmNFeGVjdXRlUmVzcG9uc2UocmVzcG9uc2VKc29uOiBhbnksIHVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgaW5wdXRzOiBXcHNJbnB1dFtdLCBvdXRwdXREZXNjcmlwdGlvbnM6IFdwc0RhdGFEZXNjcmlwdGlvbltdKTogV3BzU3RhdGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVubWFyc2hhbEdldFN0YXRlUmVzcG9uc2UocmVzcG9uc2VKc29uLCB1cmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXREZXNjcmlwdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVubWFyc2hhbEdldFN0YXRlUmVzcG9uc2UocmVzcG9uc2VKc29uOiBhbnksIHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZyxcclxuICAgICAgICBpbnB1dHM6IFdwc0RhdGFbXSwgb3V0cHV0RGVzY3JpcHRpb25zOiBXcHNEYXRhRGVzY3JpcHRpb25bXSk6IFdwc1N0YXRlIHtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2U6IEV4ZWN1dGVSZXNwb25zZSA9IHJlc3BvbnNlSnNvbi52YWx1ZTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXMucHJvY2Vzc1N1Y2NlZWRlZCA/ICdTdWNjZWVkZWQnIDpcclxuICAgICAgICByZXNwb25zZS5zdGF0dXMucHJvY2Vzc0FjY2VwdGVkID8gJ0FjY2VwdGVkJyA6XHJcbiAgICAgICAgcmVzcG9uc2Uuc3RhdHVzLnByb2Nlc3NTdGFydGVkID8gJ1J1bm5pbmcnIDpcclxuICAgICAgICByZXNwb25zZS5zdGF0dXMucHJvY2Vzc0ZhaWxlZCA/ICdGYWlsZWQnIDpcclxuICAgICAgICAnRmFpbGVkJztcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBzdGF0ZTogV3BzU3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxyXG4gICAgICAgICAgICBzdGF0dXNMb2NhdGlvbjogcmVzcG9uc2Uuc3RhdHVzTG9jYXRpb24sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnByb2Nlc3NPdXRwdXRzICYmIHJlc3BvbnNlLnByb2Nlc3NPdXRwdXRzLm91dHB1dCkge1xyXG4gICAgICAgICAgICBzdGF0ZS5yZXN1bHRzID0gdGhpcy51bm1hcnNoYWxTeW5jRXhlY3V0ZVJlc3BvbnNlKHJlc3BvbnNlSnNvbiwgc2VydmVyVXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0RGVzY3JpcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBtYXJzaGFsRXhlY0JvZHkocHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzSW5wdXRbXSwgb3V0cHV0czogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSwgYXN5bmM6IGJvb2xlYW4pOiBJV3BzRXhlY3V0ZVByb2Nlc3NCb2R5IHtcclxuXHJcbiAgICAgICAgY29uc3Qgd3BzMUlucHV0cyA9IHRoaXMubWFyc2hhbElucHV0cyhpbnB1dHMpO1xyXG4gICAgICAgIGNvbnN0IHdwczFSZXNwb25zZUZvcm0gPSB0aGlzLm1hcnNoYWxSZXNwb25zZUZvcm0ob3V0cHV0cywgYXN5bmMpO1xyXG5cclxuICAgICAgICBjb25zdCBib2R5VmFsdWU6IEV4ZWN1dGUgPSB7XHJcbiAgICAgICAgICAgIGRhdGFJbnB1dHM6IHdwczFJbnB1dHMsXHJcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IHByb2Nlc3NJZCxcclxuICAgICAgICAgICAgcmVzcG9uc2VGb3JtOiB3cHMxUmVzcG9uc2VGb3JtLFxyXG4gICAgICAgICAgICBzZXJ2aWNlOiAnV1BTJyxcclxuICAgICAgICAgICAgdmVyc2lvbjogJzEuMC4wJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGJvZHk6IElXcHNFeGVjdXRlUHJvY2Vzc0JvZHkgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIGtleTogJ3todHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8xLjAuMH1FeGVjdXRlJyxcclxuICAgICAgICAgICAgICAgIGxvY2FsUGFydDogJ0V4ZWN1dGUnLFxyXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlVVJJOiAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC93cHMvMS4wLjAnLFxyXG4gICAgICAgICAgICAgICAgcHJlZml4OiAnd3BzJyxcclxuICAgICAgICAgICAgICAgIHN0cmluZzogJ3todHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8xLjAuMH13cHM6RXhlY3V0ZSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdmFsdWU6IGJvZHlWYWx1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBib2R5O1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJvdGVjdGVkIG1hcnNoYWxSZXNwb25zZUZvcm0ob3V0cHV0czogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSwgYXN5bmMgPSBmYWxzZSk6IFJlc3BvbnNlRm9ybVR5cGUge1xyXG5cclxuICAgICAgICBjb25zdCBvdXRwdXREZWZpbml0aW9uczogRG9jdW1lbnRPdXRwdXREZWZpbml0aW9uVHlwZVtdID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBvdXRwdXQgb2Ygb3V0cHV0cykge1xyXG4gICAgICAgICAgICBsZXQgZGVmVHlwZTogRG9jdW1lbnRPdXRwdXREZWZpbml0aW9uVHlwZTtcclxuICAgICAgICAgICAgc3dpdGNoIChvdXRwdXQudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnbGl0ZXJhbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmVHlwZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogeyB2YWx1ZTogb3V0cHV0LmlkIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzUmVmZXJlbmNlOiBvdXRwdXQucmVmZXJlbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW1lVHlwZTogb3V0cHV0LmZvcm1hdFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjb21wbGV4JzpcclxuICAgICAgICAgICAgICAgICAgICBkZWZUeXBlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiB7IHZhbHVlOiBvdXRwdXQuaWQgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXNSZWZlcmVuY2U6IG91dHB1dC5yZWZlcmVuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbWVUeXBlOiBvdXRwdXQuZm9ybWF0XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGlzIFdwcy1vdXRwdXR0eXBlIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCB5ZXQhICR7b3V0cHV0fSBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRwdXREZWZpbml0aW9ucy5wdXNoKGRlZlR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEb2N1bWVudDogUmVzcG9uc2VEb2N1bWVudFR5cGUgPSB7XHJcbiAgICAgICAgICAgIG91dHB1dDogb3V0cHV0RGVmaW5pdGlvbnMsXHJcbiAgICAgICAgICAgIHN0YXR1czogYXN5bmMgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgIHN0b3JlRXhlY3V0ZVJlc3BvbnNlOiBhc3luYyA/IHRydWUgOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGZvcm06IFJlc3BvbnNlRm9ybVR5cGUgPSB7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlRG9jdW1lbnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBmb3JtO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcm90ZWN0ZWQgbWFyc2hhbElucHV0cyhpbnB1dEFycjogV3BzSW5wdXRbXSk6IERhdGFJbnB1dHNUeXBlIHtcclxuICAgICAgICBjb25zdCB0aGVJbnB1dHM6IElucHV0VHlwZVtdID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBpbnAgb2YgaW5wdXRBcnIpIHtcclxuICAgICAgICAgICAgaWYgKGlucC52YWx1ZSA9PT0gbnVsbCB8fCBpbnAudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBWYWx1ZSBmb3IgaW5wdXQgJHtpbnAuZGVzY3JpcHRpb24uaWR9IGlzIG5vdCBzZXRgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBtYXJzaGFsbGVkSW5wdXQgPSB0aGlzLm1hcnNoYWxJbnB1dChpbnApO1xyXG4gICAgICAgICAgICB0aGVJbnB1dHMucHVzaChtYXJzaGFsbGVkSW5wdXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpbnB1dHM6IERhdGFJbnB1dHNUeXBlID0ge1xyXG4gICAgICAgICAgICBpbnB1dDogdGhlSW5wdXRzXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gaW5wdXRzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBtYXJzaGFsSW5wdXQoaW5wdXQ6IFdwc0lucHV0KTogSW5wdXRUeXBlIHtcclxuICAgICAgICBjb25zdCBpZCA9IGlucHV0LmRlc2NyaXB0aW9uLmlkO1xyXG4gICAgICAgIGNvbnN0IHRpdGxlID0gaW5wdXQuZGVzY3JpcHRpb24uaWQ7XHJcbiAgICAgICAgY29uc3QgYWJzdHJhY3QgPSAnJztcclxuXHJcbiAgICAgICAgY29uc3QgaW5wdXRUeXBlOiBJbnB1dFR5cGUgPSB7XHJcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IHsgdmFsdWU6IGlkIH0sXHJcbiAgICAgICAgICAgIHRpdGxlOiB7IHZhbHVlOiB0aXRsZSB9LFxyXG4gICAgICAgICAgICBfYWJzdHJhY3Q6IHsgdmFsdWU6IGFic3RyYWN0IH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoaW5wdXQuZGVzY3JpcHRpb24ucmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgIGlucHV0VHlwZS5yZWZlcmVuY2UgPSB0aGlzLm1hcnNoYWxSZWZlcmVuY2VJbnB1dChpbnB1dCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5wdXRUeXBlLmRhdGEgPSB0aGlzLm1hcnNoYWxEYXRhSW5wdXQoaW5wdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGlucHV0VHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbWFyc2hhbERhdGFJbnB1dChpbnB1dDogV3BzSW5wdXQpOiBEYXRhVHlwZSB7XHJcbiAgICAgICAgbGV0IGRhdGE6IERhdGFUeXBlO1xyXG4gICAgICAgIHN3aXRjaCAoaW5wdXQuZGVzY3JpcHRpb24udHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdsaXRlcmFsJzpcclxuICAgICAgICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGl0ZXJhbERhdGE6IHsgdmFsdWU6IFN0cmluZyhpbnB1dC52YWx1ZSkgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdiYm94JzpcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlczogV3BzQmJveFZhbHVlID0gaW5wdXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kaW5nQm94RGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dlckNvcm5lcjogW3ZhbHVlcy5sbGxhdCwgdmFsdWVzLmxsbG9uXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXJDb3JuZXI6IFt2YWx1ZXMudXJsYXQsIHZhbHVlcy51cmxvbl1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NvbXBsZXgnOlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChpbnB1dC5kZXNjcmlwdGlvbi5mb3JtYXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd0ZXh0L3htbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV4RGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFtpbnB1dC52YWx1ZV0sICAvLyBAVE9ETzogd2UgYXNzdW1lIGhlcmUgdGhhdCB0ZXh0L3htbC1kYXRhIGlzIGFscmVhZHkgc3RyaW5naWZpZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW1lVHlwZTogaW5wdXQuZGVzY3JpcHRpb24uZm9ybWF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV4RGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFtKU09OLnN0cmluZ2lmeShpbnB1dC52YWx1ZSldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbWVUeXBlOiBpbnB1dC5kZXNjcmlwdGlvbi5mb3JtYXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoYFRoaXMgaW5wdXQgaXMgb2YgdHlwZSAke2lucHV0LmRlc2NyaXB0aW9uLnR5cGV9LiBXZSBjYW4gb25seSBtYXJzaGFsIGlucHV0IG9mIHR5cGUgbGl0ZXJhbCwgYmJveCBvciBjb21wbGV4LmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbWFyc2hhbFJlZmVyZW5jZUlucHV0KGlucHV0OiBXcHNJbnB1dCk6IElucHV0UmVmZXJlbmNlVHlwZSB7XHJcbiAgICAgICAgY29uc3QgcmVmOiBJbnB1dFJlZmVyZW5jZVR5cGUgPSB7XHJcbiAgICAgICAgICAgIGhyZWY6IGlucHV0LnZhbHVlLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICBtaW1lVHlwZTogaW5wdXQuZGVzY3JpcHRpb24uZm9ybWF0XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gcmVmO1xyXG4gICAgfVxyXG5cclxuICAgIG1hcnNoYWxsR2V0U3RhdHVzQm9keShzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIHN0YXR1c0lkOiBzdHJpbmcpIHtcclxuICAgICAgICAvLyBXUFMtMS4wIGRvZXMgbm90IHNlbmQgYSBib2R5IHdpdGggYSBHZXRTdGF0dXMgcmVxdWVzdC5cclxuICAgICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcblxyXG4gICAgbWFyc2hhbGxHZXRSZXN1bHRCb2R5KHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgam9iSUQ6IHN0cmluZykge1xyXG4gICAgICAgIC8vIFdQUy0xLjAgZG9lcyBub3Qgc2VuZCBhIGJvZHkgd2l0aCBhIEdldFN0YXR1cyByZXF1ZXN0LlxyXG4gICAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNtaXNzVXJsKHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgam9iSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgLyoqIHRoaXMgZG9lcyBvbmx5IHdvcmsgaW4gZ2Vvc2VydmVyOlxyXG4gICAgICAgIHJldHVybiBgJHtzZXJ2ZXJVcmx9P3NlcnZpY2U9V1BTJnZlcnNpb249MS4wLjAmcmVxdWVzdD1EaXNtaXNzJmV4ZWN1dGlvbklkPSR7am9iSWR9YDsgKi9cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dwcyAxLjAgZG9lcyBub3Qgc3VwcG9ydCBEaXNtaXNzLW9wZXJhdGlvbnMuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFyc2hhbERpc21pc3NCb2R5KHByb2Nlc3NJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXcHMgMS4wIGRvZXMgbm90IHN1cHBvcnQgRGlzbWlzcy1vcGVyYXRpb25zLicpO1xyXG4gICAgfVxyXG5cclxuICAgIHVubWFyc2hhbERpc21pc3NSZXNwb25zZShqc29uUmVzcG9uc2U6IGFueSwgc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nKTogV3BzU3RhdGUge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignV3BzIDEuMCBkb2VzIG5vdCBzdXBwb3J0IERpc21pc3Mtb3BlcmF0aW9ucy4nKTtcclxuICAgIH1cclxufVxyXG4iXX0=