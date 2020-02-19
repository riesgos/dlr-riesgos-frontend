/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wps200/wps_marshaller_2.0.0.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { isStatusInfo, isResult } from './helpers';
var WpsMarshaller200 = /** @class */ (function () {
    function WpsMarshaller200() {
    }
    /**
     * @param {?} baseurl
     * @return {?}
     */
    WpsMarshaller200.prototype.getCapabilitiesUrl = /**
     * @param {?} baseurl
     * @return {?}
     */
    function (baseurl) {
        return baseurl + "?service=WPS&request=GetCapabilities&version=2.0.0";
    };
    /**
     * @param {?} baseurl
     * @param {?} processId
     * @return {?}
     */
    WpsMarshaller200.prototype.executeUrl = /**
     * @param {?} baseurl
     * @param {?} processId
     * @return {?}
     */
    function (baseurl, processId) {
        return baseurl + "?service=WPS&request=Execute&version=2.0.0&identifier=" + processId;
    };
    /**
     * @param {?} capabilities
     * @return {?}
     */
    WpsMarshaller200.prototype.unmarshalCapabilities = /**
     * @param {?} capabilities
     * @return {?}
     */
    function (capabilities) {
        /** @type {?} */
        var out = [];
        capabilities.contents.processSummary.forEach((/**
         * @param {?} summary
         * @return {?}
         */
        function (summary) {
            out.push({
                id: summary.identifier.value
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
    WpsMarshaller200.prototype.unmarshalSyncExecuteResponse = /**
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
        if (isResult(responseJson.value)) {
            var _loop_1 = function (output) {
                /** @type {?} */
                var outputDescription = outputDescriptions.find((/**
                 * @param {?} od
                 * @return {?}
                 */
                function (od) { return od.id === output.id; }));
                if (!outputDescription) {
                    throw new Error("Could not find an output-description for the parameter " + output.id + ".");
                }
                /** @type {?} */
                var isReference = outputDescription.reference;
                /** @type {?} */
                var datatype = outputDescription.type;
                /** @type {?} */
                var format = outputDescription.format;
                /** @type {?} */
                var data = void 0;
                if (output.reference) {
                    data = output.reference.href || null;
                }
                else if (output.data) {
                    data = this_1.unmarshalOutputData(output.data, outputDescription);
                }
                else {
                    throw new Error("Output has neither reference nor data field.");
                }
                out.push({
                    description: {
                        id: output.id,
                        format: format,
                        reference: isReference,
                        type: datatype
                    },
                    value: data,
                });
            };
            var this_1 = this;
            try {
                for (var _b = tslib_1.__values(responseJson.value.output), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var output = _c.value;
                    _loop_1(output);
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
        else if (isStatusInfo(responseJson.value)) {
            /** @type {?} */
            var state = {
                status: responseJson.value.status,
                jobID: responseJson.value.jobID,
                percentCompleted: responseJson.value.percentCompleted
            };
            out.push({
                description: {
                    id: processId,
                    reference: true,
                    type: 'status'
                },
                value: state
            });
        }
        return out;
    };
    /**
     * @protected
     * @param {?} data
     * @param {?} description
     * @return {?}
     */
    WpsMarshaller200.prototype.unmarshalOutputData = /**
     * @protected
     * @param {?} data
     * @param {?} description
     * @return {?}
     */
    function (data, description) {
        if (description.type === 'complex') {
            switch (data.mimeType) {
                case 'application/vnd.geo+json':
                case 'application/json':
                    return data.content.map((/**
                     * @param {?} cont
                     * @return {?}
                     */
                    function (cont) { return JSON.parse(cont); }));
                case 'application/WMS':
                    return data.content;
                case 'text/xml':
                    return new XMLSerializer().serializeToString(data.content[0]); // @TODO: better: handle actual xml-data
                default:
                    throw new Error("Cannot unmarshal complex data of format " + data.mimeType);
            }
        }
        else if (description.type === 'literal') {
            return data.content;
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
    WpsMarshaller200.prototype.unmarshalAsyncExecuteResponse = /**
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
    WpsMarshaller200.prototype.unmarshalGetStateResponse = /**
     * @param {?} responseJson
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    function (responseJson, serverUrl, processId, inputs, outputDescriptions) {
        if (isStatusInfo(responseJson.value)) {
            /** @type {?} */
            var state = {
                status: responseJson.value.status,
                jobID: responseJson.value.jobID,
                percentCompleted: responseJson.value.percentCompleted
            };
            return state;
        }
        else {
            throw new Error("Not a status-info: " + responseJson);
        }
    };
    /**
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} async
     * @return {?}
     */
    WpsMarshaller200.prototype.marshalExecBody = /**
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} async
     * @return {?}
     */
    function (processId, inputs, outputs, async) {
        /** @type {?} */
        var inputsMarshalled = this.marshalInputs(inputs);
        /** @type {?} */
        var outputsMarshalled = this.marshalOutputs(outputs);
        /** @type {?} */
        var bodyValue = {
            TYPE_NAME: 'WPS_2_0.ExecuteRequestType',
            service: 'WPS',
            version: '2.0.0',
            identifier: { value: processId },
            input: inputsMarshalled,
            output: outputsMarshalled,
            mode: async ? 'async' : 'sync',
            response: 'document'
        };
        /** @type {?} */
        var body = {
            name: {
                key: '{http://www.opengis.net/wps/2.0}Execute',
                localPart: 'Execute',
                namespaceURI: 'http://www.opengis.net/wps/2.0',
                prefix: 'wps',
                string: '{http://www.opengis.net/wps/2.0}wps:Execute'
            },
            value: bodyValue
        };
        return body;
    };
    /**
     * @private
     * @param {?} inputs
     * @return {?}
     */
    WpsMarshaller200.prototype.marshalInputs = /**
     * @private
     * @param {?} inputs
     * @return {?}
     */
    function (inputs) {
        return inputs.map((/**
         * @param {?} i
         * @return {?}
         */
        function (i) {
            if (i.description.reference) {
                return {
                    id: i.description.id,
                    reference: {
                        href: i.value,
                        mimeType: i.description.format,
                    }
                };
            }
            else {
                return {
                    id: i.description.id,
                    data: {
                        content: [JSON.stringify(i.value)],
                        mimeType: i.description.format
                    }
                };
            }
        }));
    };
    /**
     * @private
     * @param {?} outputs
     * @return {?}
     */
    WpsMarshaller200.prototype.marshalOutputs = /**
     * @private
     * @param {?} outputs
     * @return {?}
     */
    function (outputs) {
        return outputs.map((/**
         * @param {?} o
         * @return {?}
         */
        function (o) {
            return {
                id: o.id,
                mimeType: o.format,
                transmission: o.reference ? 'reference' : 'value' // @TODO: maybe just comment out this line?
            };
        }));
    };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} statusId
     * @return {?}
     */
    WpsMarshaller200.prototype.marshallGetStatusBody = /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} statusId
     * @return {?}
     */
    function (serverUrl, processId, statusId) {
        /** @type {?} */
        var request = {
            name: {
                key: '{http://www.opengis.net/wps/2.0}GetStatus',
                localPart: 'GetStatus',
                namespaceURI: 'http://www.opengis.net/wps/2.0',
                prefix: 'wps',
                string: '{http://www.opengis.net/wps/2.0}wps:GetStatus'
            },
            value: {
                jobID: statusId,
                service: 'WPS',
                version: '2.0.0'
            }
        };
        return request;
    };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobID
     * @return {?}
     */
    WpsMarshaller200.prototype.marshallGetResultBody = /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobID
     * @return {?}
     */
    function (serverUrl, processId, jobID) {
        /** @type {?} */
        var request = {
            name: {
                key: '{http://www.opengis.net/wps/2.0}GetResult',
                localPart: 'GetResult',
                namespaceURI: 'http://www.opengis.net/wps/2.0',
                prefix: 'wps',
                string: '{http://www.opengis.net/wps/2.0}wps:GetResult'
            },
            value: {
                service: 'WPS',
                version: '2.0.0',
                jobID: jobID
            }
        };
        return request;
    };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    WpsMarshaller200.prototype.dismissUrl = /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    function (serverUrl, processId, jobId) {
        return serverUrl;
    };
    /**
     * @param {?} jobId
     * @return {?}
     */
    WpsMarshaller200.prototype.marshalDismissBody = /**
     * @param {?} jobId
     * @return {?}
     */
    function (jobId) {
        /** @type {?} */
        var body = {
            name: {
                key: '{http://www.opengis.net/wps/2.0}Dismiss',
                localPart: 'Dismiss',
                namespaceURI: 'http://www.opengis.net/wps/2.0',
                prefix: 'wps',
                string: '{http://www.opengis.net/wps/2.0}wps:Dismiss'
            },
            value: {
                jobID: jobId,
                service: 'WPS',
                version: '2.0.0'
            }
        };
        return body;
    };
    /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @return {?}
     */
    WpsMarshaller200.prototype.unmarshalDismissResponse = /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @return {?}
     */
    function (jsonResponse, serverUrl, processId) {
        /** @type {?} */
        var state = {
            status: jsonResponse.value.status,
            jobID: jsonResponse.value.jobID
        };
        return state;
    };
    return WpsMarshaller200;
}());
export { WpsMarshaller200 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3BzX21hcnNoYWxsZXJfMi4wLjAuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdWtpcy9zZXJ2aWNlcy1vZ2MvIiwic291cmNlcyI6WyJsaWIvd3BzL3dwczIwMC93cHNfbWFyc2hhbGxlcl8yLjAuMC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxPQUFPLEVBQW9CLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFHckU7SUFFSTtJQUFlLENBQUM7Ozs7O0lBRWhCLDZDQUFrQjs7OztJQUFsQixVQUFtQixPQUFlO1FBQzlCLE9BQVUsT0FBTyx1REFBb0QsQ0FBQztJQUMxRSxDQUFDOzs7Ozs7SUFFRCxxQ0FBVTs7Ozs7SUFBVixVQUFXLE9BQWUsRUFBRSxTQUFpQjtRQUN6QyxPQUFVLE9BQU8sOERBQXlELFNBQVcsQ0FBQztJQUMxRixDQUFDOzs7OztJQUVELGdEQUFxQjs7OztJQUFyQixVQUFzQixZQUFpQzs7WUFDN0MsR0FBRyxHQUFvQixFQUFFO1FBQy9CLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLE9BQU87WUFDaEQsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDTCxFQUFFLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLO2FBQy9CLENBQUMsQ0FBQztRQUNQLENBQUMsRUFBQyxDQUFDO1FBQ0gsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDOzs7Ozs7Ozs7SUFFRCx1REFBNEI7Ozs7Ozs7O0lBQTVCLFVBQTZCLFlBQWlDLEVBQUUsR0FBVyxFQUFFLFNBQWlCLEVBQzFGLE1BQWtCLEVBQUUsa0JBQTBDOzs7WUFDeEQsR0FBRyxHQUFnQixFQUFFO1FBRTNCLElBQUksUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtvQ0FDbkIsTUFBTTs7b0JBQ1AsaUJBQWlCLEdBQUcsa0JBQWtCLENBQUMsSUFBSTs7OztnQkFBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUs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Q2hCLEtBQUssRUFBRSxLQUFLO2FBQ2Y7U0FDSjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7Ozs7Ozs7SUFFRCxxQ0FBVTs7Ozs7O0lBQVYsVUFBVyxTQUFpQixFQUFFLFNBQWlCLEVBQUUsS0FBYTtRQUMxRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDOzs7OztJQUVELDZDQUFrQjs7OztJQUFsQixVQUFtQixLQUFhOztZQUN0QixJQUFJLEdBQW9CO1lBQzFCLElBQUksRUFBRTtnQkFDRixHQUFHLEVBQUUseUNBQXlDO2dCQUM5QyxTQUFTLEVBQUUsU0FBUztnQkFDcEIsWUFBWSxFQUFFLGdDQUFnQztnQkFDOUMsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsTUFBTSxFQUFFLDZDQUE2QzthQUN2RDtZQUNELEtBQUssRUFBRTtnQkFDSCxLQUFLLEVBQUUsS0FBSztnQkFDWixPQUFPLEVBQUUsS0FBSztnQkFDZCxPQUFPLEVBQUUsT0FBTzthQUNuQjtTQUNMO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7Ozs7OztJQUVELG1EQUF3Qjs7Ozs7O0lBQXhCLFVBQXlCLFlBQThCLEVBQUUsU0FBaUIsRUFBRSxTQUFpQjs7WUFDbkYsS0FBSyxHQUFhO1lBQ3BCLE1BQU0sRUFBRSxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU07WUFDakMsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSztTQUNsQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUEvT0QsSUErT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBXcHNNYXJzaGFsbGVyLCBXcHNJbnB1dCwgV3BzT3V0cHV0RGVzY3JpcHRpb24sIFdwc1Jlc3VsdCwgV3BzQ2FwYWJpbGl0eSwgV3BzRGF0YURlc2NyaXB0aW9uLCBXcHNEYXRhLCBXcHNTdGF0ZSB9IGZyb20gJy4uL3dwc19kYXRhdHlwZXMnO1xyXG5pbXBvcnQgeyBXUFNDYXBhYmlsaXRpZXNUeXBlLCBFeGVjdXRlUmVxdWVzdFR5cGUsIERhdGFJbnB1dFR5cGUsIE91dHB1dERlZmluaXRpb25UeXBlLCBJV3BzRXhlY3V0ZVByb2Nlc3NCb2R5LCBJV3BzRXhlY3V0ZVJlc3BvbnNlLCBEYXRhT3V0cHV0VHlwZSwgSUdldFN0YXR1c1JlcXVlc3QsIERhdGEsIElHZXRSZXN1bHRSZXF1ZXN0LCBJRGlzbWlzc1JlcXVlc3QsIElEaXNtaXNzUmVzcG9uc2UgfSBmcm9tICcuL3dwc18yLjAnO1xyXG5pbXBvcnQgeyBpc0RhdGFPdXRwdXRUeXBlLCBpc1N0YXR1c0luZm8sIGlzUmVzdWx0IH0gZnJvbSAnLi9oZWxwZXJzJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgV3BzTWFyc2hhbGxlcjIwMCBpbXBsZW1lbnRzIFdwc01hcnNoYWxsZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBnZXRDYXBhYmlsaXRpZXNVcmwoYmFzZXVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYCR7YmFzZXVybH0/c2VydmljZT1XUFMmcmVxdWVzdD1HZXRDYXBhYmlsaXRpZXMmdmVyc2lvbj0yLjAuMGA7XHJcbiAgICB9XHJcblxyXG4gICAgZXhlY3V0ZVVybChiYXNldXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYCR7YmFzZXVybH0/c2VydmljZT1XUFMmcmVxdWVzdD1FeGVjdXRlJnZlcnNpb249Mi4wLjAmaWRlbnRpZmllcj0ke3Byb2Nlc3NJZH1gO1xyXG4gICAgfVxyXG5cclxuICAgIHVubWFyc2hhbENhcGFiaWxpdGllcyhjYXBhYmlsaXRpZXM6IFdQU0NhcGFiaWxpdGllc1R5cGUpOiBXcHNDYXBhYmlsaXR5W10ge1xyXG4gICAgICAgIGNvbnN0IG91dDogV3BzQ2FwYWJpbGl0eVtdID0gW107XHJcbiAgICAgICAgY2FwYWJpbGl0aWVzLmNvbnRlbnRzLnByb2Nlc3NTdW1tYXJ5LmZvckVhY2goc3VtbWFyeSA9PiB7XHJcbiAgICAgICAgICAgIG91dC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkOiBzdW1tYXJ5LmlkZW50aWZpZXIudmFsdWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICB1bm1hcnNoYWxTeW5jRXhlY3V0ZVJlc3BvbnNlKHJlc3BvbnNlSnNvbjogSVdwc0V4ZWN1dGVSZXNwb25zZSwgdXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLFxyXG4gICAgICAgIGlucHV0czogV3BzSW5wdXRbXSwgb3V0cHV0RGVzY3JpcHRpb25zOiBXcHNPdXRwdXREZXNjcmlwdGlvbltdKTogV3BzUmVzdWx0W10ge1xyXG4gICAgICAgIGNvbnN0IG91dDogV3BzUmVzdWx0W10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGlzUmVzdWx0KHJlc3BvbnNlSnNvbi52YWx1ZSkpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBvdXRwdXQgb2YgcmVzcG9uc2VKc29uLnZhbHVlLm91dHB1dCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0RGVzY3JpcHRpb24gPSBvdXRwdXREZXNjcmlwdGlvbnMuZmluZChvZCA9PiBvZC5pZCA9PT0gb3V0cHV0LmlkKTtcclxuICAgICAgICAgICAgICAgIGlmICghb3V0cHV0RGVzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFuIG91dHB1dC1kZXNjcmlwdGlvbiBmb3IgdGhlIHBhcmFtZXRlciAke291dHB1dC5pZH0uYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNSZWZlcmVuY2UgPSBvdXRwdXREZXNjcmlwdGlvbi5yZWZlcmVuY2U7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhdHlwZSA9IG91dHB1dERlc2NyaXB0aW9uLnR5cGU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXQgPSBvdXRwdXREZXNjcmlwdGlvbi5mb3JtYXQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YTtcclxuICAgICAgICAgICAgICAgIGlmIChvdXRwdXQucmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG91dHB1dC5yZWZlcmVuY2UuaHJlZiB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvdXRwdXQuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLnVubWFyc2hhbE91dHB1dERhdGEob3V0cHV0LmRhdGEsIG91dHB1dERlc2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBPdXRwdXQgaGFzIG5laXRoZXIgcmVmZXJlbmNlIG5vciBkYXRhIGZpZWxkLmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG91dC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogb3V0cHV0LmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IGZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlOiBpc1JlZmVyZW5jZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGF0YXR5cGVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGlzU3RhdHVzSW5mbyhyZXNwb25zZUpzb24udmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlOiBXcHNTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2VKc29uLnZhbHVlLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgIGpvYklEOiByZXNwb25zZUpzb24udmFsdWUuam9iSUQsXHJcbiAgICAgICAgICAgICAgICBwZXJjZW50Q29tcGxldGVkOiByZXNwb25zZUpzb24udmFsdWUucGVyY2VudENvbXBsZXRlZFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgb3V0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogcHJvY2Vzc0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RhdHVzJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBzdGF0ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVubWFyc2hhbE91dHB1dERhdGEoZGF0YTogRGF0YSwgZGVzY3JpcHRpb246IFdwc091dHB1dERlc2NyaXB0aW9uKTogYW55IHtcclxuICAgICAgICBpZiAoZGVzY3JpcHRpb24udHlwZSA9PT0gJ2NvbXBsZXgnKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YS5taW1lVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnYXBwbGljYXRpb24vdm5kLmdlbytqc29uJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FwcGxpY2F0aW9uL2pzb24nOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmNvbnRlbnQubWFwKChjb250OiBhbnkpID0+IEpTT04ucGFyc2UoY29udCkpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnYXBwbGljYXRpb24vV01TJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dC94bWwnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKGRhdGEuY29udGVudFswXSk7IC8vIEBUT0RPOiBiZXR0ZXI6IGhhbmRsZSBhY3R1YWwgeG1sLWRhdGFcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgdW5tYXJzaGFsIGNvbXBsZXggZGF0YSBvZiBmb3JtYXQgJHtkYXRhLm1pbWVUeXBlfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZXNjcmlwdGlvbi50eXBlID09PSAnbGl0ZXJhbCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEuY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IHlldCBpbXBsZW1lbnRlZDogJHtkYXRhfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHVubWFyc2hhbEFzeW5jRXhlY3V0ZVJlc3BvbnNlKHJlc3BvbnNlSnNvbjogYW55LCB1cmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzRGF0YVtdLCBvdXRwdXREZXNjcmlwdGlvbnM6IFdwc0RhdGFEZXNjcmlwdGlvbltdKTogV3BzU3RhdGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVubWFyc2hhbEdldFN0YXRlUmVzcG9uc2UocmVzcG9uc2VKc29uLCB1cmwsIHByb2Nlc3NJZCwgaW5wdXRzLCBvdXRwdXREZXNjcmlwdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVubWFyc2hhbEdldFN0YXRlUmVzcG9uc2UocmVzcG9uc2VKc29uOiBhbnksIHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZyxcclxuICAgICAgICBpbnB1dHM6IFdwc0RhdGFbXSwgb3V0cHV0RGVzY3JpcHRpb25zOiBXcHNEYXRhRGVzY3JpcHRpb25bXSk6IFdwc1N0YXRlIHtcclxuICAgICAgICBpZiAoaXNTdGF0dXNJbmZvKHJlc3BvbnNlSnNvbi52YWx1ZSkpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGU6IFdwc1N0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZUpzb24udmFsdWUuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgam9iSUQ6IHJlc3BvbnNlSnNvbi52YWx1ZS5qb2JJRCxcclxuICAgICAgICAgICAgICAgIHBlcmNlbnRDb21wbGV0ZWQ6IHJlc3BvbnNlSnNvbi52YWx1ZS5wZXJjZW50Q29tcGxldGVkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdCBhIHN0YXR1cy1pbmZvOiAke3Jlc3BvbnNlSnNvbn1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbWFyc2hhbEV4ZWNCb2R5KHByb2Nlc3NJZDogc3RyaW5nLCBpbnB1dHM6IFdwc0lucHV0W10sIG91dHB1dHM6IFdwc091dHB1dERlc2NyaXB0aW9uW10sIGFzeW5jOiBib29sZWFuKSB7XHJcbiAgICAgICAgY29uc3QgaW5wdXRzTWFyc2hhbGxlZCA9IHRoaXMubWFyc2hhbElucHV0cyhpbnB1dHMpO1xyXG4gICAgICAgIGNvbnN0IG91dHB1dHNNYXJzaGFsbGVkID0gdGhpcy5tYXJzaGFsT3V0cHV0cyhvdXRwdXRzKTtcclxuXHJcbiAgICAgICAgY29uc3QgYm9keVZhbHVlOiBFeGVjdXRlUmVxdWVzdFR5cGUgPSB7XHJcbiAgICAgICAgICAgIFRZUEVfTkFNRTogJ1dQU18yXzAuRXhlY3V0ZVJlcXVlc3RUeXBlJyxcclxuICAgICAgICAgICAgc2VydmljZTogJ1dQUycsXHJcbiAgICAgICAgICAgIHZlcnNpb246ICcyLjAuMCcsXHJcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IHsgdmFsdWU6IHByb2Nlc3NJZCB9LFxyXG4gICAgICAgICAgICBpbnB1dDogaW5wdXRzTWFyc2hhbGxlZCxcclxuICAgICAgICAgICAgb3V0cHV0OiBvdXRwdXRzTWFyc2hhbGxlZCxcclxuICAgICAgICAgICAgbW9kZTogYXN5bmMgPyAnYXN5bmMnIDogJ3N5bmMnLFxyXG4gICAgICAgICAgICByZXNwb25zZTogJ2RvY3VtZW50J1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGJvZHk6IElXcHNFeGVjdXRlUHJvY2Vzc0JvZHkgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIGtleTogJ3todHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8yLjB9RXhlY3V0ZScsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBhcnQ6ICdFeGVjdXRlJyxcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZVVSSTogJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzIuMCcsXHJcbiAgICAgICAgICAgICAgICBwcmVmaXg6ICd3cHMnLFxyXG4gICAgICAgICAgICAgICAgc3RyaW5nOiAne2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzIuMH13cHM6RXhlY3V0ZSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdmFsdWU6IGJvZHlWYWx1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBib2R5O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFyc2hhbElucHV0cyhpbnB1dHM6IFdwc0RhdGFbXSk6IERhdGFJbnB1dFR5cGVbXSB7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0cy5tYXAoaSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpLmRlc2NyaXB0aW9uLnJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogaS5kZXNjcmlwdGlvbi5pZCxcclxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZjogaS52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6IGkuZGVzY3JpcHRpb24uZm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpLmRlc2NyaXB0aW9uLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogW0pTT04uc3RyaW5naWZ5KGkudmFsdWUpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6IGkuZGVzY3JpcHRpb24uZm9ybWF0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFyc2hhbE91dHB1dHMob3V0cHV0czogV3BzRGF0YURlc2NyaXB0aW9uW10pOiBPdXRwdXREZWZpbml0aW9uVHlwZVtdIHtcclxuICAgICAgICByZXR1cm4gb3V0cHV0cy5tYXAobyA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBpZDogby5pZCxcclxuICAgICAgICAgICAgICAgIG1pbWVUeXBlOiBvLmZvcm1hdCxcclxuICAgICAgICAgICAgICAgIHRyYW5zbWlzc2lvbjogby5yZWZlcmVuY2UgPyAncmVmZXJlbmNlJyA6ICd2YWx1ZScgIC8vIEBUT0RPOiBtYXliZSBqdXN0IGNvbW1lbnQgb3V0IHRoaXMgbGluZT9cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtYXJzaGFsbEdldFN0YXR1c0JvZHkoc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBzdGF0dXNJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdDogSUdldFN0YXR1c1JlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIGtleTogJ3todHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8yLjB9R2V0U3RhdHVzJyxcclxuICAgICAgICAgICAgICAgIGxvY2FsUGFydDogJ0dldFN0YXR1cycsXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2VVUkk6ICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8yLjAnLFxyXG4gICAgICAgICAgICAgICAgcHJlZml4OiAnd3BzJyxcclxuICAgICAgICAgICAgICAgIHN0cmluZzogJ3todHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8yLjB9d3BzOkdldFN0YXR1cydcclxuICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgICAgICAgIGpvYklEOiBzdGF0dXNJZCxcclxuICAgICAgICAgICAgICAgICBzZXJ2aWNlOiAnV1BTJyxcclxuICAgICAgICAgICAgICAgICB2ZXJzaW9uOiAnMi4wLjAnXHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gcmVxdWVzdDtcclxuICAgIH1cclxuXHJcbiAgICBtYXJzaGFsbEdldFJlc3VsdEJvZHkoc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBqb2JJRDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdDogSUdldFJlc3VsdFJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIGtleTogJ3todHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8yLjB9R2V0UmVzdWx0JyxcclxuICAgICAgICAgICAgICAgIGxvY2FsUGFydDogJ0dldFJlc3VsdCcsXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2VVUkk6ICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8yLjAnLFxyXG4gICAgICAgICAgICAgICAgcHJlZml4OiAnd3BzJyxcclxuICAgICAgICAgICAgICAgIHN0cmluZzogJ3todHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8yLjB9d3BzOkdldFJlc3VsdCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdXUFMnLFxyXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogJzIuMC4wJyxcclxuICAgICAgICAgICAgICAgIGpvYklEOiBqb2JJRFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gcmVxdWVzdDtcclxuICAgIH1cclxuXHJcbiAgICBkaXNtaXNzVXJsKHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgam9iSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZlclVybDtcclxuICAgIH1cclxuXHJcbiAgICBtYXJzaGFsRGlzbWlzc0JvZHkoam9iSWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGJvZHk6IElEaXNtaXNzUmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAga2V5OiAne2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzIuMH1EaXNtaXNzJyxcclxuICAgICAgICAgICAgICAgIGxvY2FsUGFydDogJ0Rpc21pc3MnLFxyXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlVVJJOiAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC93cHMvMi4wJyxcclxuICAgICAgICAgICAgICAgIHByZWZpeDogJ3dwcycsXHJcbiAgICAgICAgICAgICAgICBzdHJpbmc6ICd7aHR0cDovL3d3dy5vcGVuZ2lzLm5ldC93cHMvMi4wfXdwczpEaXNtaXNzJ1xyXG4gICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICAgam9iSUQ6IGpvYklkLFxyXG4gICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdXUFMnLFxyXG4gICAgICAgICAgICAgICAgIHZlcnNpb246ICcyLjAuMCdcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBib2R5O1xyXG4gICAgfVxyXG5cclxuICAgIHVubWFyc2hhbERpc21pc3NSZXNwb25zZShqc29uUmVzcG9uc2U6IElEaXNtaXNzUmVzcG9uc2UsIHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZyk6IFdwc1N0YXRlIHtcclxuICAgICAgICBjb25zdCBzdGF0ZTogV3BzU3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1czoganNvblJlc3BvbnNlLnZhbHVlLnN0YXR1cyxcclxuICAgICAgICAgICAgam9iSUQ6IGpzb25SZXNwb25zZS52YWx1ZS5qb2JJRFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==