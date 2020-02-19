/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wps200/wps_marshaller_2.0.0.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { isStatusInfo, isResult } from './helpers';
export class WpsMarshaller200 {
    constructor() { }
    /**
     * @param {?} baseurl
     * @return {?}
     */
    getCapabilitiesUrl(baseurl) {
        return `${baseurl}?service=WPS&request=GetCapabilities&version=2.0.0`;
    }
    /**
     * @param {?} baseurl
     * @param {?} processId
     * @return {?}
     */
    executeUrl(baseurl, processId) {
        return `${baseurl}?service=WPS&request=Execute&version=2.0.0&identifier=${processId}`;
    }
    /**
     * @param {?} capabilities
     * @return {?}
     */
    unmarshalCapabilities(capabilities) {
        /** @type {?} */
        const out = [];
        capabilities.contents.processSummary.forEach((/**
         * @param {?} summary
         * @return {?}
         */
        summary => {
            out.push({
                id: summary.identifier.value
            });
        }));
        return out;
    }
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    unmarshalSyncExecuteResponse(responseJson, url, processId, inputs, outputDescriptions) {
        /** @type {?} */
        const out = [];
        if (isResult(responseJson.value)) {
            for (const output of responseJson.value.output) {
                /** @type {?} */
                const outputDescription = outputDescriptions.find((/**
                 * @param {?} od
                 * @return {?}
                 */
                od => od.id === output.id));
                if (!outputDescription) {
                    throw new Error(`Could not find an output-description for the parameter ${output.id}.`);
                }
                /** @type {?} */
                const isReference = outputDescription.reference;
                /** @type {?} */
                const datatype = outputDescription.type;
                /** @type {?} */
                const format = outputDescription.format;
                /** @type {?} */
                let data;
                if (output.reference) {
                    data = output.reference.href || null;
                }
                else if (output.data) {
                    data = this.unmarshalOutputData(output.data, outputDescription);
                }
                else {
                    throw new Error(`Output has neither reference nor data field.`);
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
            }
        }
        else if (isStatusInfo(responseJson.value)) {
            /** @type {?} */
            const state = {
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
    }
    /**
     * @protected
     * @param {?} data
     * @param {?} description
     * @return {?}
     */
    unmarshalOutputData(data, description) {
        if (description.type === 'complex') {
            switch (data.mimeType) {
                case 'application/vnd.geo+json':
                case 'application/json':
                    return data.content.map((/**
                     * @param {?} cont
                     * @return {?}
                     */
                    (cont) => JSON.parse(cont)));
                case 'application/WMS':
                    return data.content;
                case 'text/xml':
                    return new XMLSerializer().serializeToString(data.content[0]); // @TODO: better: handle actual xml-data
                default:
                    throw new Error(`Cannot unmarshal complex data of format ${data.mimeType}`);
            }
        }
        else if (description.type === 'literal') {
            return data.content;
        }
        throw new Error(`Not yet implemented: ${data}`);
    }
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    unmarshalAsyncExecuteResponse(responseJson, url, processId, inputs, outputDescriptions) {
        return this.unmarshalGetStateResponse(responseJson, url, processId, inputs, outputDescriptions);
    }
    /**
     * @param {?} responseJson
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    unmarshalGetStateResponse(responseJson, serverUrl, processId, inputs, outputDescriptions) {
        if (isStatusInfo(responseJson.value)) {
            /** @type {?} */
            const state = {
                status: responseJson.value.status,
                jobID: responseJson.value.jobID,
                percentCompleted: responseJson.value.percentCompleted
            };
            return state;
        }
        else {
            throw new Error(`Not a status-info: ${responseJson}`);
        }
    }
    /**
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} async
     * @return {?}
     */
    marshalExecBody(processId, inputs, outputs, async) {
        /** @type {?} */
        const inputsMarshalled = this.marshalInputs(inputs);
        /** @type {?} */
        const outputsMarshalled = this.marshalOutputs(outputs);
        /** @type {?} */
        const bodyValue = {
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
        const body = {
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
    }
    /**
     * @private
     * @param {?} inputs
     * @return {?}
     */
    marshalInputs(inputs) {
        return inputs.map((/**
         * @param {?} i
         * @return {?}
         */
        i => {
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
    }
    /**
     * @private
     * @param {?} outputs
     * @return {?}
     */
    marshalOutputs(outputs) {
        return outputs.map((/**
         * @param {?} o
         * @return {?}
         */
        o => {
            return {
                id: o.id,
                mimeType: o.format,
                transmission: o.reference ? 'reference' : 'value' // @TODO: maybe just comment out this line?
            };
        }));
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} statusId
     * @return {?}
     */
    marshallGetStatusBody(serverUrl, processId, statusId) {
        /** @type {?} */
        const request = {
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
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobID
     * @return {?}
     */
    marshallGetResultBody(serverUrl, processId, jobID) {
        /** @type {?} */
        const request = {
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
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    dismissUrl(serverUrl, processId, jobId) {
        return serverUrl;
    }
    /**
     * @param {?} jobId
     * @return {?}
     */
    marshalDismissBody(jobId) {
        /** @type {?} */
        const body = {
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
    }
    /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @return {?}
     */
    unmarshalDismissResponse(jsonResponse, serverUrl, processId) {
        /** @type {?} */
        const state = {
            status: jsonResponse.value.status,
            jobID: jsonResponse.value.jobID
        };
        return state;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3BzX21hcnNoYWxsZXJfMi4wLjAuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdWtpcy9zZXJ2aWNlcy1vZ2MvIiwic291cmNlcyI6WyJsaWIvd3BzL3dwczIwMC93cHNfbWFyc2hhbGxlcl8yLjAuMC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLE9BQU8sRUFBb0IsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUdyRSxNQUFNLE9BQU8sZ0JBQWdCO0lBRXpCLGdCQUFlLENBQUM7Ozs7O0lBRWhCLGtCQUFrQixDQUFDLE9BQWU7UUFDOUIsT0FBTyxHQUFHLE9BQU8sb0RBQW9ELENBQUM7SUFDMUUsQ0FBQzs7Ozs7O0lBRUQsVUFBVSxDQUFDLE9BQWUsRUFBRSxTQUFpQjtRQUN6QyxPQUFPLEdBQUcsT0FBTyx5REFBeUQsU0FBUyxFQUFFLENBQUM7SUFDMUYsQ0FBQzs7Ozs7SUFFRCxxQkFBcUIsQ0FBQyxZQUFpQzs7Y0FDN0MsR0FBRyxHQUFvQixFQUFFO1FBQy9CLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU87Ozs7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNuRCxHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUNMLEVBQUUsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUs7YUFDL0IsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxFQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Ozs7Ozs7OztJQUVELDRCQUE0QixDQUFDLFlBQWlDLEVBQUUsR0FBVyxFQUFFLFNBQWlCLEVBQzFGLE1BQWtCLEVBQUUsa0JBQTBDOztjQUN4RCxHQUFHLEdBQWdCLEVBQUU7UUFFM0IsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzlCLEtBQUssTUFBTSxNQUFNLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7O3NCQUN0QyxpQkFBaUIsR0FBRyxrQkFBa0IsQ0FBQyxJ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QUN0QixJQUFJLEdBQW9CO1lBQzFCLElBQUksRUFBRTtnQkFDRixHQUFHLEVBQUUseUNBQXlDO2dCQUM5QyxTQUFTLEVBQUUsU0FBUztnQkFDcEIsWUFBWSxFQUFFLGdDQUFnQztnQkFDOUMsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsTUFBTSxFQUFFLDZDQUE2QzthQUN2RDtZQUNELEtBQUssRUFBRTtnQkFDSCxLQUFLLEVBQUUsS0FBSztnQkFDWixPQUFPLEVBQUUsS0FBSztnQkFDZCxPQUFPLEVBQUUsT0FBTzthQUNuQjtTQUNMO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7Ozs7OztJQUVELHdCQUF3QixDQUFDLFlBQThCLEVBQUUsU0FBaUIsRUFBRSxTQUFpQjs7Y0FDbkYsS0FBSyxHQUFhO1lBQ3BCLE1BQU0sRUFBRSxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU07WUFDakMsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSztTQUNsQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFdwc01hcnNoYWxsZXIsIFdwc0lucHV0LCBXcHNPdXRwdXREZXNjcmlwdGlvbiwgV3BzUmVzdWx0LCBXcHNDYXBhYmlsaXR5LCBXcHNEYXRhRGVzY3JpcHRpb24sIFdwc0RhdGEsIFdwc1N0YXRlIH0gZnJvbSAnLi4vd3BzX2RhdGF0eXBlcyc7XHJcbmltcG9ydCB7IFdQU0NhcGFiaWxpdGllc1R5cGUsIEV4ZWN1dGVSZXF1ZXN0VHlwZSwgRGF0YUlucHV0VHlwZSwgT3V0cHV0RGVmaW5pdGlvblR5cGUsIElXcHNFeGVjdXRlUHJvY2Vzc0JvZHksIElXcHNFeGVjdXRlUmVzcG9uc2UsIERhdGFPdXRwdXRUeXBlLCBJR2V0U3RhdHVzUmVxdWVzdCwgRGF0YSwgSUdldFJlc3VsdFJlcXVlc3QsIElEaXNtaXNzUmVxdWVzdCwgSURpc21pc3NSZXNwb25zZSB9IGZyb20gJy4vd3BzXzIuMCc7XHJcbmltcG9ydCB7IGlzRGF0YU91dHB1dFR5cGUsIGlzU3RhdHVzSW5mbywgaXNSZXN1bHQgfSBmcm9tICcuL2hlbHBlcnMnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBXcHNNYXJzaGFsbGVyMjAwIGltcGxlbWVudHMgV3BzTWFyc2hhbGxlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIGdldENhcGFiaWxpdGllc1VybChiYXNldXJsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgJHtiYXNldXJsfT9zZXJ2aWNlPVdQUyZyZXF1ZXN0PUdldENhcGFiaWxpdGllcyZ2ZXJzaW9uPTIuMC4wYDtcclxuICAgIH1cclxuXHJcbiAgICBleGVjdXRlVXJsKGJhc2V1cmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgJHtiYXNldXJsfT9zZXJ2aWNlPVdQUyZyZXF1ZXN0PUV4ZWN1dGUmdmVyc2lvbj0yLjAuMCZpZGVudGlmaWVyPSR7cHJvY2Vzc0lkfWA7XHJcbiAgICB9XHJcblxyXG4gICAgdW5tYXJzaGFsQ2FwYWJpbGl0aWVzKGNhcGFiaWxpdGllczogV1BTQ2FwYWJpbGl0aWVzVHlwZSk6IFdwc0NhcGFiaWxpdHlbXSB7XHJcbiAgICAgICAgY29uc3Qgb3V0OiBXcHNDYXBhYmlsaXR5W10gPSBbXTtcclxuICAgICAgICBjYXBhYmlsaXRpZXMuY29udGVudHMucHJvY2Vzc1N1bW1hcnkuZm9yRWFjaChzdW1tYXJ5ID0+IHtcclxuICAgICAgICAgICAgb3V0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6IHN1bW1hcnkuaWRlbnRpZmllci52YWx1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHVubWFyc2hhbFN5bmNFeGVjdXRlUmVzcG9uc2UocmVzcG9uc2VKc29uOiBJV3BzRXhlY3V0ZVJlc3BvbnNlLCB1cmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsXHJcbiAgICAgICAgaW5wdXRzOiBXcHNJbnB1dFtdLCBvdXRwdXREZXNjcmlwdGlvbnM6IFdwc091dHB1dERlc2NyaXB0aW9uW10pOiBXcHNSZXN1bHRbXSB7XHJcbiAgICAgICAgY29uc3Qgb3V0OiBXcHNSZXN1bHRbXSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAoaXNSZXN1bHQocmVzcG9uc2VKc29uLnZhbHVlKSkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG91dHB1dCBvZiByZXNwb25zZUpzb24udmFsdWUub3V0cHV0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXREZXNjcmlwdGlvbiA9IG91dHB1dERlc2NyaXB0aW9ucy5maW5kKG9kID0+IG9kLmlkID09PSBvdXRwdXQuaWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvdXRwdXREZXNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYW4gb3V0cHV0LWRlc2NyaXB0aW9uIGZvciB0aGUgcGFyYW1ldGVyICR7b3V0cHV0LmlkfS5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc1JlZmVyZW5jZSA9IG91dHB1dERlc2NyaXB0aW9uLnJlZmVyZW5jZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGF0eXBlID0gb3V0cHV0RGVzY3JpcHRpb24udHlwZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1hdCA9IG91dHB1dERlc2NyaXB0aW9uLmZvcm1hdDtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhO1xyXG4gICAgICAgICAgICAgICAgaWYgKG91dHB1dC5yZWZlcmVuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gb3V0cHV0LnJlZmVyZW5jZS5ocmVmIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG91dHB1dC5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMudW5tYXJzaGFsT3V0cHV0RGF0YShvdXRwdXQuZGF0YSwgb3V0cHV0RGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE91dHB1dCBoYXMgbmVpdGhlciByZWZlcmVuY2Ugbm9yIGRhdGEgZmllbGQuYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgb3V0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBvdXRwdXQuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogZm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IGlzUmVmZXJlbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhdHlwZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNTdGF0dXNJbmZvKHJlc3BvbnNlSnNvbi52YWx1ZSkpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGU6IFdwc1N0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZUpzb24udmFsdWUuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgam9iSUQ6IHJlc3BvbnNlSnNvbi52YWx1ZS5qb2JJRCxcclxuICAgICAgICAgICAgICAgIHBlcmNlbnRDb21wbGV0ZWQ6IHJlc3BvbnNlSnNvbi52YWx1ZS5wZXJjZW50Q29tcGxldGVkXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBvdXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBwcm9jZXNzSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdGF0dXMnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHN0YXRlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdW5tYXJzaGFsT3V0cHV0RGF0YShkYXRhOiBEYXRhLCBkZXNjcmlwdGlvbjogV3BzT3V0cHV0RGVzY3JpcHRpb24pOiBhbnkge1xyXG4gICAgICAgIGlmIChkZXNjcmlwdGlvbi50eXBlID09PSAnY29tcGxleCcpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChkYXRhLm1pbWVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdhcHBsaWNhdGlvbi92bmQuZ2VvK2pzb24nOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnYXBwbGljYXRpb24vanNvbic6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuY29udGVudC5tYXAoKGNvbnQ6IGFueSkgPT4gSlNPTi5wYXJzZShjb250KSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdhcHBsaWNhdGlvbi9XTVMnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0L3htbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBYTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcoZGF0YS5jb250ZW50WzBdKTsgLy8gQFRPRE86IGJldHRlcjogaGFuZGxlIGFjdHVhbCB4bWwtZGF0YVxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCB1bm1hcnNoYWwgY29tcGxleCBkYXRhIG9mIGZvcm1hdCAke2RhdGEubWltZVR5cGV9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGRlc2NyaXB0aW9uLnR5cGUgPT09ICdsaXRlcmFsJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YS5jb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3QgeWV0IGltcGxlbWVudGVkOiAke2RhdGF9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5tYXJzaGFsQXN5bmNFeGVjdXRlUmVzcG9uc2UocmVzcG9uc2VKc29uOiBhbnksIHVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgaW5wdXRzOiBXcHNEYXRhW10sIG91dHB1dERlc2NyaXB0aW9uczogV3BzRGF0YURlc2NyaXB0aW9uW10pOiBXcHNTdGF0ZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudW5tYXJzaGFsR2V0U3RhdGVSZXNwb25zZShyZXNwb25zZUpzb24sIHVybCwgcHJvY2Vzc0lkLCBpbnB1dHMsIG91dHB1dERlc2NyaXB0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5tYXJzaGFsR2V0U3RhdGVSZXNwb25zZShyZXNwb25zZUpzb246IGFueSwgc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLFxyXG4gICAgICAgIGlucHV0czogV3BzRGF0YVtdLCBvdXRwdXREZXNjcmlwdGlvbnM6IFdwc0RhdGFEZXNjcmlwdGlvbltdKTogV3BzU3RhdGUge1xyXG4gICAgICAgIGlmIChpc1N0YXR1c0luZm8ocmVzcG9uc2VKc29uLnZhbHVlKSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZTogV3BzU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlSnNvbi52YWx1ZS5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICBqb2JJRDogcmVzcG9uc2VKc29uLnZhbHVlLmpvYklELFxyXG4gICAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlZDogcmVzcG9uc2VKc29uLnZhbHVlLnBlcmNlbnRDb21wbGV0ZWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IGEgc3RhdHVzLWluZm86ICR7cmVzcG9uc2VKc29ufWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtYXJzaGFsRXhlY0JvZHkocHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzSW5wdXRbXSwgb3V0cHV0czogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSwgYXN5bmM6IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCBpbnB1dHNNYXJzaGFsbGVkID0gdGhpcy5tYXJzaGFsSW5wdXRzKGlucHV0cyk7XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0c01hcnNoYWxsZWQgPSB0aGlzLm1hcnNoYWxPdXRwdXRzKG91dHB1dHMpO1xyXG5cclxuICAgICAgICBjb25zdCBib2R5VmFsdWU6IEV4ZWN1dGVSZXF1ZXN0VHlwZSA9IHtcclxuICAgICAgICAgICAgVFlQRV9OQU1FOiAnV1BTXzJfMC5FeGVjdXRlUmVxdWVzdFR5cGUnLFxyXG4gICAgICAgICAgICBzZXJ2aWNlOiAnV1BTJyxcclxuICAgICAgICAgICAgdmVyc2lvbjogJzIuMC4wJyxcclxuICAgICAgICAgICAgaWRlbnRpZmllcjogeyB2YWx1ZTogcHJvY2Vzc0lkIH0sXHJcbiAgICAgICAgICAgIGlucHV0OiBpbnB1dHNNYXJzaGFsbGVkLFxyXG4gICAgICAgICAgICBvdXRwdXQ6IG91dHB1dHNNYXJzaGFsbGVkLFxyXG4gICAgICAgICAgICBtb2RlOiBhc3luYyA/ICdhc3luYycgOiAnc3luYycsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiAnZG9jdW1lbnQnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgYm9keTogSVdwc0V4ZWN1dGVQcm9jZXNzQm9keSA9IHtcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAga2V5OiAne2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzIuMH1FeGVjdXRlJyxcclxuICAgICAgICAgICAgICAgIGxvY2FsUGFydDogJ0V4ZWN1dGUnLFxyXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlVVJJOiAnaHR0cDovL3d3dy5vcGVuZ2lzLm5ldC93cHMvMi4wJyxcclxuICAgICAgICAgICAgICAgIHByZWZpeDogJ3dwcycsXHJcbiAgICAgICAgICAgICAgICBzdHJpbmc6ICd7aHR0cDovL3d3dy5vcGVuZ2lzLm5ldC93cHMvMi4wfXdwczpFeGVjdXRlJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB2YWx1ZTogYm9keVZhbHVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXJzaGFsSW5wdXRzKGlucHV0czogV3BzRGF0YVtdKTogRGF0YUlucHV0VHlwZVtdIHtcclxuICAgICAgICByZXR1cm4gaW5wdXRzLm1hcChpID0+IHtcclxuICAgICAgICAgICAgaWYgKGkuZGVzY3JpcHRpb24ucmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpLmRlc2NyaXB0aW9uLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmOiBpLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW1lVHlwZTogaS5kZXNjcmlwdGlvbi5mb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGkuZGVzY3JpcHRpb24uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbSlNPTi5zdHJpbmdpZnkoaS52YWx1ZSldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW1lVHlwZTogaS5kZXNjcmlwdGlvbi5mb3JtYXRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXJzaGFsT3V0cHV0cyhvdXRwdXRzOiBXcHNEYXRhRGVzY3JpcHRpb25bXSk6IE91dHB1dERlZmluaXRpb25UeXBlW10ge1xyXG4gICAgICAgIHJldHVybiBvdXRwdXRzLm1hcChvID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGlkOiBvLmlkLFxyXG4gICAgICAgICAgICAgICAgbWltZVR5cGU6IG8uZm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgdHJhbnNtaXNzaW9uOiBvLnJlZmVyZW5jZSA/ICdyZWZlcmVuY2UnIDogJ3ZhbHVlJyAgLy8gQFRPRE86IG1heWJlIGp1c3QgY29tbWVudCBvdXQgdGhpcyBsaW5lP1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG1hcnNoYWxsR2V0U3RhdHVzQm9keShzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIHN0YXR1c0lkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCByZXF1ZXN0OiBJR2V0U3RhdHVzUmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAga2V5OiAne2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzIuMH1HZXRTdGF0dXMnLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQYXJ0OiAnR2V0U3RhdHVzJyxcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZVVSSTogJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzIuMCcsXHJcbiAgICAgICAgICAgICAgICBwcmVmaXg6ICd3cHMnLFxyXG4gICAgICAgICAgICAgICAgc3RyaW5nOiAne2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzIuMH13cHM6R2V0U3RhdHVzJ1xyXG4gICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICAgam9iSUQ6IHN0YXR1c0lkLFxyXG4gICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdXUFMnLFxyXG4gICAgICAgICAgICAgICAgIHZlcnNpb246ICcyLjAuMCdcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiByZXF1ZXN0O1xyXG4gICAgfVxyXG5cclxuICAgIG1hcnNoYWxsR2V0UmVzdWx0Qm9keShzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGpvYklEOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCByZXF1ZXN0OiBJR2V0UmVzdWx0UmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAga2V5OiAne2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzIuMH1HZXRSZXN1bHQnLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQYXJ0OiAnR2V0UmVzdWx0JyxcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZVVSSTogJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzIuMCcsXHJcbiAgICAgICAgICAgICAgICBwcmVmaXg6ICd3cHMnLFxyXG4gICAgICAgICAgICAgICAgc3RyaW5nOiAne2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzIuMH13cHM6R2V0UmVzdWx0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgICAgICAgc2VydmljZTogJ1dQUycsXHJcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiAnMi4wLjAnLFxyXG4gICAgICAgICAgICAgICAgam9iSUQ6IGpvYklEXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiByZXF1ZXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGRpc21pc3NVcmwoc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBqb2JJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gc2VydmVyVXJsO1xyXG4gICAgfVxyXG5cclxuICAgIG1hcnNoYWxEaXNtaXNzQm9keShqb2JJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgYm9keTogSURpc21pc3NSZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6ICd7aHR0cDovL3d3dy5vcGVuZ2lzLm5ldC93cHMvMi4wfURpc21pc3MnLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQYXJ0OiAnRGlzbWlzcycsXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2VVUkk6ICdodHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8yLjAnLFxyXG4gICAgICAgICAgICAgICAgcHJlZml4OiAnd3BzJyxcclxuICAgICAgICAgICAgICAgIHN0cmluZzogJ3todHRwOi8vd3d3Lm9wZW5naXMubmV0L3dwcy8yLjB9d3BzOkRpc21pc3MnXHJcbiAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgICAgICBqb2JJRDogam9iSWQsXHJcbiAgICAgICAgICAgICAgICAgc2VydmljZTogJ1dQUycsXHJcbiAgICAgICAgICAgICAgICAgdmVyc2lvbjogJzIuMC4wJ1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5tYXJzaGFsRGlzbWlzc1Jlc3BvbnNlKGpzb25SZXNwb25zZTogSURpc21pc3NSZXNwb25zZSwgc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nKTogV3BzU3RhdGUge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlOiBXcHNTdGF0ZSA9IHtcclxuICAgICAgICAgICAgc3RhdHVzOiBqc29uUmVzcG9uc2UudmFsdWUuc3RhdHVzLFxyXG4gICAgICAgICAgICBqb2JJRDoganNvblJlc3BvbnNlLnZhbHVlLmpvYklEXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuIl19