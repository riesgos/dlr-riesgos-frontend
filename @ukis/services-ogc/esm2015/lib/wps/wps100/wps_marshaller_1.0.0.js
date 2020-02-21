/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wps100/wps_marshaller_1.0.0.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class WpsMarshaller100 {
    constructor() { }
    /**
     * @param {?} baseurl
     * @return {?}
     */
    getCapabilitiesUrl(baseurl) {
        return `${baseurl}?service=WPS&request=GetCapabilities&version=1.0.0`;
    }
    /**
     * @param {?} baseurl
     * @param {?} processId
     * @return {?}
     */
    executeUrl(baseurl, processId) {
        return `${baseurl}?service=WPS&request=Execute&version=1.0.0&identifier=${processId}`;
    }
    /**
     * @param {?} capabilities
     * @return {?}
     */
    unmarshalCapabilities(capabilities) {
        /** @type {?} */
        const out = [];
        capabilities.processOfferings.process.forEach((/**
         * @param {?} process
         * @return {?}
         */
        process => {
            out.push({
                id: process.identifier.value
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
            for (const output of responseJson.value.processOutputs.output) {
                /** @type {?} */
                const isReference = output.reference ? true : false;
                /** @type {?} */
                let datatype;
                /** @type {?} */
                let data;
                /** @type {?} */
                let format;
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
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    unmarshalOutputData(data) {
        if (data.complexData) {
            switch (data.complexData.mimeType) {
                case 'application/vnd.geo+json':
                case 'application/json':
                    return data.complexData.content.map((/**
                     * @param {?} cont
                     * @return {?}
                     */
                    cont => JSON.parse(cont)));
                case 'application/WMS':
                    return data.complexData.content;
                case 'text/xml':
                    return new XMLSerializer().serializeToString(data.complexData.content[0]); // @TODO: better: handle actual xml-data
                default:
                    throw new Error(`Cannot unmarshal data of format ${data.complexData.mimeType}`);
            }
        }
        else if (data.literalData) {
            switch (data.literalData.dataType) {
                case 'string':
                default:
                    return data.literalData.value;
            }
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
        /** @type {?} */
        const response = responseJson.value;
        /** @type {?} */
        const status = response.status.processSucceeded ? 'Succeeded' :
            response.status.processAccepted ? 'Accepted' :
                response.status.processStarted ? 'Running' :
                    response.status.processFailed ? 'Failed' :
                        'Failed';
        /** @type {?} */
        const state = {
            status: status,
            statusLocation: response.statusLocation,
        };
        if (response.processOutputs && response.processOutputs.output) {
            state.results = this.unmarshalSyncExecuteResponse(responseJson, serverUrl, processId, inputs, outputDescriptions);
        }
        return state;
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
        const wps1Inputs = this.marshalInputs(inputs);
        /** @type {?} */
        const wps1ResponseForm = this.marshalResponseForm(outputs, async);
        /** @type {?} */
        const bodyValue = {
            dataInputs: wps1Inputs,
            identifier: processId,
            responseForm: wps1ResponseForm,
            service: 'WPS',
            version: '1.0.0'
        };
        /** @type {?} */
        const body = {
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
    }
    /**
     * @protected
     * @param {?} outputs
     * @param {?=} async
     * @return {?}
     */
    marshalResponseForm(outputs, async = false) {
        /** @type {?} */
        const outputDefinitions = [];
        for (const output of outputs) {
            /** @type {?} */
            let defType;
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
                    throw new Error(`This Wps-outputtype has not been implemented yet! ${output} `);
            }
            outputDefinitions.push(defType);
        }
        /** @type {?} */
        const responseDocument = {
            output: outputDefinitions,
            status: async ? true : false,
            storeExecuteResponse: async ? true : false
        };
        /** @type {?} */
        const form = {
            responseDocument
        };
        return form;
    }
    /**
     * @protected
     * @param {?} inputArr
     * @return {?}
     */
    marshalInputs(inputArr) {
        /** @type {?} */
        const theInputs = [];
        for (const inp of inputArr) {
            if (inp.value === null || inp.value === undefined) {
                throw new Error(`Value for input ${inp.description.id} is not set`);
            }
            /** @type {?} */
            const marshalledInput = this.marshalInput(inp);
            theInputs.push(marshalledInput);
        }
        /** @type {?} */
        const inputs = {
            input: theInputs
        };
        return inputs;
    }
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    marshalInput(input) {
        /** @type {?} */
        const id = input.description.id;
        /** @type {?} */
        const title = input.description.id;
        /** @type {?} */
        const abstract = '';
        /** @type {?} */
        const inputType = {
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
    }
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    marshalDataInput(input) {
        /** @type {?} */
        let data;
        switch (input.description.type) {
            case 'literal':
                data = {
                    literalData: { value: String(input.value) }
                };
                break;
            case 'bbox':
                /** @type {?} */
                const values = input.value;
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
                throw Error(`This input is of type ${input.description.type}. We can only marshal input of type literal, bbox or complex.`);
        }
        return data;
    }
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    marshalReferenceInput(input) {
        /** @type {?} */
        const ref = {
            href: input.value,
            method: 'GET',
            mimeType: input.description.format
        };
        return ref;
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} statusId
     * @return {?}
     */
    marshallGetStatusBody(serverUrl, processId, statusId) {
        // WPS-1.0 does not send a body with a GetStatus request.
        return {};
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobID
     * @return {?}
     */
    marshallGetResultBody(serverUrl, processId, jobID) {
        // WPS-1.0 does not send a body with a GetStatus request.
        return {};
    }
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    dismissUrl(serverUrl, processId, jobId) {
        /** this does only work in geoserver:
        return `${serverUrl}?service=WPS&version=1.0.0&request=Dismiss&executionId=${jobId}`; */
        throw new Error('Wps 1.0 does not support Dismiss-operations.');
    }
    /**
     * @param {?} processId
     * @return {?}
     */
    marshalDismissBody(processId) {
        throw new Error('Wps 1.0 does not support Dismiss-operations.');
    }
    /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @return {?}
     */
    unmarshalDismissResponse(jsonResponse, serverUrl, processId) {
        throw new Error('Wps 1.0 does not support Dismiss-operations.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3BzX21hcnNoYWxsZXJfMS4wLjAuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdWtpcy9zZXJ2aWNlcy1vZ2MvIiwic291cmNlcyI6WyJsaWIvd3BzL3dwczEwMC93cHNfbWFyc2hhbGxlcl8xLjAuMC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQVNBLE1BQU0sT0FBTyxnQkFBZ0I7SUFFekIsZ0JBQWdCLENBQUM7Ozs7O0lBRWpCLGtCQUFrQixDQUFDLE9BQWU7UUFDOUIsT0FBTyxHQUFHLE9BQU8sb0RBQW9ELENBQUM7SUFDMUUsQ0FBQzs7Ozs7O0lBRUQsVUFBVSxDQUFDLE9BQWUsRUFBRSxTQUFpQjtRQUN6QyxPQUFPLEdBQUcsT0FBTyx5REFBeUQsU0FBUyxFQUFFLENBQUM7SUFDMUYsQ0FBQzs7Ozs7SUFFRCxxQkFBcUIsQ0FBQyxZQUFpQzs7Y0FDN0MsR0FBRyxHQUFvQixFQUFFO1FBQy9CLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTzs7OztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3BELEdBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQ0wsRUFBRSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSzthQUMvQixDQUFDLENBQUM7UUFDUCxDQUFDLEVBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7Ozs7O0lBRUQsNEJBQTRCLENBQUMsWUFBaUMsRUFBRSxHQUFXLEVBQUUsU0FBaUIsRUFDMUYsTUFBa0IsRUFBRSxrQkFBMEM7O2NBRXhELEdBQUcsR0FBZ0IsRUFBRTtRQUUzQixJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFFLFdBQVc7WUFDdEQsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDTCxXQUFXLEVBQUU7b0JBQ1QsRUFBRSxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLO29CQUMvQyxTQUFTLEVBQUUsSUFB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LENBQUM7Ozs7OztJQUVTLHFCQUFxQixDQUFDLEtBQWU7O2NBQ3JDLEdBQUcsR0FBdUI7WUFDNUIsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLO1lBQ2pCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTTtTQUNyQztRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7OztJQUVELHFCQUFxQixDQUFDLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxRQUFnQjtRQUN4RSx5REFBeUQ7UUFDekQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDOzs7Ozs7O0lBRUQscUJBQXFCLENBQUMsU0FBaUIsRUFBRSxTQUFpQixFQUFFLEtBQWE7UUFDckUseURBQXlEO1FBQ3pELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7Ozs7OztJQUVELFVBQVUsQ0FBQyxTQUFpQixFQUFFLFNBQWlCLEVBQUUsS0FBYTtRQUMxRDtnR0FDd0Y7UUFDeEYsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7Ozs7O0lBRUQsa0JBQWtCLENBQUMsU0FBaUI7UUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7Ozs7Ozs7SUFFRCx3QkFBd0IsQ0FBQyxZQUFpQixFQUFFLFNBQWlCLEVBQUUsU0FBaUI7UUFDNUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFdwc01hcnNoYWxsZXIsIFdwc0lucHV0LCBXcHNPdXRwdXREZXNjcmlwdGlvbiwgV3BzUmVzdWx0LCBXcHNDYXBhYmlsaXR5LCBXcHNCYm94VmFsdWUsIFdwc0RhdGEsIFdwc0RhdGFEZXNjcmlwdGlvbiwgV3BzU3RhdGUsIFdwc0RhdGFGb3JtYXQgfSBmcm9tICcuLi93cHNfZGF0YXR5cGVzJztcclxuaW1wb3J0IHtcclxuICAgIFdQU0NhcGFiaWxpdGllc1R5cGUsIElXcHNFeGVjdXRlUHJvY2Vzc0JvZHksIEV4ZWN1dGUsIERhdGFJbnB1dHNUeXBlLFxyXG4gICAgSW5wdXRUeXBlLCBSZXNwb25zZUZvcm1UeXBlLCBEYXRhVHlwZSwgSVdwc0V4ZWN1dGVSZXNwb25zZSwgRG9jdW1lbnRPdXRwdXREZWZpbml0aW9uVHlwZSxcclxuICAgIFJlc3BvbnNlRG9jdW1lbnRUeXBlLCBJbnB1dFJlZmVyZW5jZVR5cGUsIExpdGVyYWxEYXRhVHlwZSwgRXhlY3V0ZVJlc3BvbnNlXHJcbn0gZnJvbSAnLi93cHNfMS4wLjAnO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgV3BzTWFyc2hhbGxlcjEwMCBpbXBsZW1lbnRzIFdwc01hcnNoYWxsZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgZ2V0Q2FwYWJpbGl0aWVzVXJsKGJhc2V1cmw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGAke2Jhc2V1cmx9P3NlcnZpY2U9V1BTJnJlcXVlc3Q9R2V0Q2FwYWJpbGl0aWVzJnZlcnNpb249MS4wLjBgO1xyXG4gICAgfVxyXG5cclxuICAgIGV4ZWN1dGVVcmwoYmFzZXVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGAke2Jhc2V1cmx9P3NlcnZpY2U9V1BTJnJlcXVlc3Q9RXhlY3V0ZSZ2ZXJzaW9uPTEuMC4wJmlkZW50aWZpZXI9JHtwcm9jZXNzSWR9YDtcclxuICAgIH1cclxuXHJcbiAgICB1bm1hcnNoYWxDYXBhYmlsaXRpZXMoY2FwYWJpbGl0aWVzOiBXUFNDYXBhYmlsaXRpZXNUeXBlKTogV3BzQ2FwYWJpbGl0eVtdIHtcclxuICAgICAgICBjb25zdCBvdXQ6IFdwc0NhcGFiaWxpdHlbXSA9IFtdO1xyXG4gICAgICAgIGNhcGFiaWxpdGllcy5wcm9jZXNzT2ZmZXJpbmdzLnByb2Nlc3MuZm9yRWFjaChwcm9jZXNzID0+IHtcclxuICAgICAgICAgICAgb3V0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6IHByb2Nlc3MuaWRlbnRpZmllci52YWx1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHVubWFyc2hhbFN5bmNFeGVjdXRlUmVzcG9uc2UocmVzcG9uc2VKc29uOiBJV3BzRXhlY3V0ZVJlc3BvbnNlLCB1cmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsXHJcbiAgICAgICAgaW5wdXRzOiBXcHNJbnB1dFtdLCBvdXRwdXREZXNjcmlwdGlvbnM6IFdwc091dHB1dERlc2NyaXB0aW9uW10pOiBXcHNSZXN1bHRbXSB7XHJcblxyXG4gICAgICAgIGNvbnN0IG91dDogV3BzUmVzdWx0W10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3BvbnNlSnNvbi52YWx1ZS5zdGF0dXMucHJvY2Vzc0ZhaWxlZCkgeyAvLyBGYWlsdXJlP1xyXG4gICAgICAgICAgICBvdXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiByZXNwb25zZUpzb24udmFsdWUucHJvY2Vzcy5pZGVudGlmaWVyLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlc3BvbnNlSnNvbi52YWx1ZS5zdGF0dXNMb2NhdGlvblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlSnNvbi52YWx1ZS5wcm9jZXNzT3V0cHV0cykgeyAvLyBzeW5jaHJvbm91cyByZXF1ZXN0P1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG91dHB1dCBvZiByZXNwb25zZUpzb24udmFsdWUucHJvY2Vzc091dHB1dHMub3V0cHV0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc1JlZmVyZW5jZSA9IG91dHB1dC5yZWZlcmVuY2UgPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGF0eXBlOiAnbGl0ZXJhbCcgfCAnY29tcGxleCcgfCAnYmJveCcgfCAnc3RhdHVzJyB8ICdlcnJvcic7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YTtcclxuICAgICAgICAgICAgICAgIGxldCBmb3JtYXQ6IFdwc0RhdGFGb3JtYXQgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAob3V0cHV0LnJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlID0gJ2NvbXBsZXgnO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBvdXRwdXQucmVmZXJlbmNlLmhyZWYgfHwgbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBvdXRwdXQucmVmZXJlbmNlLm1pbWVUeXBlIGFzIFdwc0RhdGFGb3JtYXQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQuZGF0YSAmJiBvdXRwdXQuZGF0YS5saXRlcmFsRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhdHlwZSA9ICdsaXRlcmFsJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gb3V0cHV0LmRhdGEubGl0ZXJhbERhdGEuZGF0YVR5cGUgYXMgV3BzRGF0YUZvcm1hdDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG91dHB1dC5kYXRhICYmIG91dHB1dC5kYXRhLmNvbXBsZXhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlID0gJ2NvbXBsZXgnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBvdXRwdXQuZGF0YS5jb21wbGV4RGF0YS5taW1lVHlwZSBhcyBXcHNEYXRhRm9ybWF0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlID0gJ2Jib3gnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy51bm1hcnNoYWxPdXRwdXREYXRhKG91dHB1dC5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBvdXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IG91dHB1dC5pZGVudGlmaWVyLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IGZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlOiBpc1JlZmVyZW5jZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGF0YXR5cGVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlSnNvbi52YWx1ZS5zdGF0dXNMb2NhdGlvbikgeyAvLyBhc3luY2hyb25vdXMgcmVxdWVzdD9cclxuICAgICAgICAgICAgb3V0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogcmVzcG9uc2VKc29uLnZhbHVlLnByb2Nlc3MuaWRlbnRpZmllci52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0YXR1cydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy51bm1hcnNoYWxHZXRTdGF0ZVJlc3BvbnNlKHJlc3BvbnNlSnNvbiwgdXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0RGVzY3JpcHRpb25zKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVubWFyc2hhbE91dHB1dERhdGEoZGF0YTogRGF0YVR5cGUpOiBhbnkge1xyXG4gICAgICAgIGlmIChkYXRhLmNvbXBsZXhEYXRhKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YS5jb21wbGV4RGF0YS5taW1lVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnYXBwbGljYXRpb24vdm5kLmdlbytqc29uJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FwcGxpY2F0aW9uL2pzb24nOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmNvbXBsZXhEYXRhLmNvbnRlbnQubWFwKGNvbnQgPT4gSlNPTi5wYXJzZShjb250KSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdhcHBsaWNhdGlvbi9XTVMnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmNvbXBsZXhEYXRhLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0L3htbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBYTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcoZGF0YS5jb21wbGV4RGF0YS5jb250ZW50WzBdKTsgLy8gQFRPRE86IGJldHRlcjogaGFuZGxlIGFjdHVhbCB4bWwtZGF0YVxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCB1bm1hcnNoYWwgZGF0YSBvZiBmb3JtYXQgJHtkYXRhLmNvbXBsZXhEYXRhLm1pbWVUeXBlfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxpdGVyYWxEYXRhKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YS5saXRlcmFsRGF0YS5kYXRhVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEubGl0ZXJhbERhdGEudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IHlldCBpbXBsZW1lbnRlZDogJHtkYXRhfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHVubWFyc2hhbEFzeW5jRXhlY3V0ZVJlc3BvbnNlKHJlc3BvbnNlSnNvbjogYW55LCB1cmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzSW5wdXRbXSwgb3V0cHV0RGVzY3JpcHRpb25zOiBXcHNEYXRhRGVzY3JpcHRpb25bXSk6IFdwc1N0YXRlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51bm1hcnNoYWxHZXRTdGF0ZVJlc3BvbnNlKHJlc3BvbnNlSnNvbiwgdXJsLCBwcm9jZXNzSWQsIGlucHV0cywgb3V0cHV0RGVzY3JpcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICB1bm1hcnNoYWxHZXRTdGF0ZVJlc3BvbnNlKHJlc3BvbnNlSnNvbjogYW55LCBzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsXHJcbiAgICAgICAgaW5wdXRzOiBXcHNEYXRhW10sIG91dHB1dERlc2NyaXB0aW9uczogV3BzRGF0YURlc2NyaXB0aW9uW10pOiBXcHNTdGF0ZSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlOiBFeGVjdXRlUmVzcG9uc2UgPSByZXNwb25zZUpzb24udmFsdWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzLnByb2Nlc3NTdWNjZWVkZWQgPyAnU3VjY2VlZGVkJyA6XHJcbiAgICAgICAgcmVzcG9uc2Uuc3RhdHVzLnByb2Nlc3NBY2NlcHRlZCA/ICdBY2NlcHRlZCcgOlxyXG4gICAgICAgIHJlc3BvbnNlLnN0YXR1cy5wcm9jZXNzU3RhcnRlZCA/ICdSdW5uaW5nJyA6XHJcbiAgICAgICAgcmVzcG9uc2Uuc3RhdHVzLnByb2Nlc3NGYWlsZWQgPyAnRmFpbGVkJyA6XHJcbiAgICAgICAgJ0ZhaWxlZCc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc3RhdGU6IFdwc1N0YXRlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyxcclxuICAgICAgICAgICAgc3RhdHVzTG9jYXRpb246IHJlc3BvbnNlLnN0YXR1c0xvY2F0aW9uLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZS5wcm9jZXNzT3V0cHV0cyAmJiByZXNwb25zZS5wcm9jZXNzT3V0cHV0cy5vdXRwdXQpIHtcclxuICAgICAgICAgICAgc3RhdGUucmVzdWx0cyA9IHRoaXMudW5tYXJzaGFsU3luY0V4ZWN1dGVSZXNwb25zZShyZXNwb25zZUpzb24sIHNlcnZlclVybCwgcHJvY2Vzc0lkLCBpbnB1dHMsIG91dHB1dERlc2NyaXB0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgbWFyc2hhbEV4ZWNCb2R5KHByb2Nlc3NJZDogc3RyaW5nLCBpbnB1dHM6IFdwc0lucHV0W10sIG91dHB1dHM6IFdwc091dHB1dERlc2NyaXB0aW9uW10sIGFzeW5jOiBib29sZWFuKTogSVdwc0V4ZWN1dGVQcm9jZXNzQm9keSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHdwczFJbnB1dHMgPSB0aGlzLm1hcnNoYWxJbnB1dHMoaW5wdXRzKTtcclxuICAgICAgICBjb25zdCB3cHMxUmVzcG9uc2VGb3JtID0gdGhpcy5tYXJzaGFsUmVzcG9uc2VGb3JtKG91dHB1dHMsIGFzeW5jKTtcclxuXHJcbiAgICAgICAgY29uc3QgYm9keVZhbHVlOiBFeGVjdXRlID0ge1xyXG4gICAgICAgICAgICBkYXRhSW5wdXRzOiB3cHMxSW5wdXRzLFxyXG4gICAgICAgICAgICBpZGVudGlmaWVyOiBwcm9jZXNzSWQsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlRm9ybTogd3BzMVJlc3BvbnNlRm9ybSxcclxuICAgICAgICAgICAgc2VydmljZTogJ1dQUycsXHJcbiAgICAgICAgICAgIHZlcnNpb246ICcxLjAuMCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBib2R5OiBJV3BzRXhlY3V0ZVByb2Nlc3NCb2R5ID0ge1xyXG4gICAgICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6ICd7aHR0cDovL3d3dy5vcGVuZ2lzLm5ldC93cHMvMS4wLjB9RXhlY3V0ZScsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBhcnQ6ICdFeGVjdXRlJyxcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZVVSSTogJ2h0dHA6Ly93d3cub3Blbmdpcy5uZXQvd3BzLzEuMC4wJyxcclxuICAgICAgICAgICAgICAgIHByZWZpeDogJ3dwcycsXHJcbiAgICAgICAgICAgICAgICBzdHJpbmc6ICd7aHR0cDovL3d3dy5vcGVuZ2lzLm5ldC93cHMvMS4wLjB9d3BzOkV4ZWN1dGUnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHZhbHVlOiBib2R5VmFsdWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gYm9keTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByb3RlY3RlZCBtYXJzaGFsUmVzcG9uc2VGb3JtKG91dHB1dHM6IFdwc091dHB1dERlc2NyaXB0aW9uW10sIGFzeW5jID0gZmFsc2UpOiBSZXNwb25zZUZvcm1UeXBlIHtcclxuXHJcbiAgICAgICAgY29uc3Qgb3V0cHV0RGVmaW5pdGlvbnM6IERvY3VtZW50T3V0cHV0RGVmaW5pdGlvblR5cGVbXSA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3Qgb3V0cHV0IG9mIG91dHB1dHMpIHtcclxuICAgICAgICAgICAgbGV0IGRlZlR5cGU6IERvY3VtZW50T3V0cHV0RGVmaW5pdGlvblR5cGU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3V0cHV0LnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2xpdGVyYWwnOlxyXG4gICAgICAgICAgICAgICAgICAgIGRlZlR5cGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6IHsgdmFsdWU6IG91dHB1dC5pZCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc1JlZmVyZW5jZTogb3V0cHV0LnJlZmVyZW5jZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6IG91dHB1dC5mb3JtYXRcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY29tcGxleCc6XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmVHlwZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogeyB2YWx1ZTogb3V0cHV0LmlkIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzUmVmZXJlbmNlOiBvdXRwdXQucmVmZXJlbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW1lVHlwZTogb3V0cHV0LmZvcm1hdFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhpcyBXcHMtb3V0cHV0dHlwZSBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQgeWV0ISAke291dHB1dH0gYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0cHV0RGVmaW5pdGlvbnMucHVzaChkZWZUeXBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRG9jdW1lbnQ6IFJlc3BvbnNlRG9jdW1lbnRUeXBlID0ge1xyXG4gICAgICAgICAgICBvdXRwdXQ6IG91dHB1dERlZmluaXRpb25zLFxyXG4gICAgICAgICAgICBzdGF0dXM6IGFzeW5jID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdG9yZUV4ZWN1dGVSZXNwb25zZTogYXN5bmMgPyB0cnVlIDogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBmb3JtOiBSZXNwb25zZUZvcm1UeXBlID0ge1xyXG4gICAgICAgICAgICByZXNwb25zZURvY3VtZW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZm9ybTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJvdGVjdGVkIG1hcnNoYWxJbnB1dHMoaW5wdXRBcnI6IFdwc0lucHV0W10pOiBEYXRhSW5wdXRzVHlwZSB7XHJcbiAgICAgICAgY29uc3QgdGhlSW5wdXRzOiBJbnB1dFR5cGVbXSA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgaW5wIG9mIGlucHV0QXJyKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnAudmFsdWUgPT09IG51bGwgfHwgaW5wLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVmFsdWUgZm9yIGlucHV0ICR7aW5wLmRlc2NyaXB0aW9uLmlkfSBpcyBub3Qgc2V0YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbWFyc2hhbGxlZElucHV0ID0gdGhpcy5tYXJzaGFsSW5wdXQoaW5wKTtcclxuICAgICAgICAgICAgdGhlSW5wdXRzLnB1c2gobWFyc2hhbGxlZElucHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaW5wdXRzOiBEYXRhSW5wdXRzVHlwZSA9IHtcclxuICAgICAgICAgICAgaW5wdXQ6IHRoZUlucHV0c1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGlucHV0cztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbWFyc2hhbElucHV0KGlucHV0OiBXcHNJbnB1dCk6IElucHV0VHlwZSB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBpbnB1dC5kZXNjcmlwdGlvbi5pZDtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IGlucHV0LmRlc2NyaXB0aW9uLmlkO1xyXG4gICAgICAgIGNvbnN0IGFic3RyYWN0ID0gJyc7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0VHlwZTogSW5wdXRUeXBlID0ge1xyXG4gICAgICAgICAgICBpZGVudGlmaWVyOiB7IHZhbHVlOiBpZCB9LFxyXG4gICAgICAgICAgICB0aXRsZTogeyB2YWx1ZTogdGl0bGUgfSxcclxuICAgICAgICAgICAgX2Fic3RyYWN0OiB7IHZhbHVlOiBhYnN0cmFjdCB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGlucHV0LmRlc2NyaXB0aW9uLnJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgICBpbnB1dFR5cGUucmVmZXJlbmNlID0gdGhpcy5tYXJzaGFsUmVmZXJlbmNlSW5wdXQoaW5wdXQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlucHV0VHlwZS5kYXRhID0gdGhpcy5tYXJzaGFsRGF0YUlucHV0KGlucHV0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnB1dFR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG1hcnNoYWxEYXRhSW5wdXQoaW5wdXQ6IFdwc0lucHV0KTogRGF0YVR5cGUge1xyXG4gICAgICAgIGxldCBkYXRhOiBEYXRhVHlwZTtcclxuICAgICAgICBzd2l0Y2ggKGlucHV0LmRlc2NyaXB0aW9uLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnbGl0ZXJhbCc6XHJcbiAgICAgICAgICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpdGVyYWxEYXRhOiB7IHZhbHVlOiBTdHJpbmcoaW5wdXQudmFsdWUpIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnYmJveCc6XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXM6IFdwc0Jib3hWYWx1ZSA9IGlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBib3VuZGluZ0JveERhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG93ZXJDb3JuZXI6IFt2YWx1ZXMubGxsYXQsIHZhbHVlcy5sbGxvbl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwcGVyQ29ybmVyOiBbdmFsdWVzLnVybGF0LCB2YWx1ZXMudXJsb25dXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdjb21wbGV4JzpcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoaW5wdXQuZGVzY3JpcHRpb24uZm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGV4dC94bWwnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxleERhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbaW5wdXQudmFsdWVdLCAgLy8gQFRPRE86IHdlIGFzc3VtZSBoZXJlIHRoYXQgdGV4dC94bWwtZGF0YSBpcyBhbHJlYWR5IHN0cmluZ2lmaWVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6IGlucHV0LmRlc2NyaXB0aW9uLmZvcm1hdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxleERhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbSlNPTi5zdHJpbmdpZnkoaW5wdXQudmFsdWUpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW1lVHlwZTogaW5wdXQuZGVzY3JpcHRpb24uZm9ybWF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKGBUaGlzIGlucHV0IGlzIG9mIHR5cGUgJHtpbnB1dC5kZXNjcmlwdGlvbi50eXBlfS4gV2UgY2FuIG9ubHkgbWFyc2hhbCBpbnB1dCBvZiB0eXBlIGxpdGVyYWwsIGJib3ggb3IgY29tcGxleC5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG1hcnNoYWxSZWZlcmVuY2VJbnB1dChpbnB1dDogV3BzSW5wdXQpOiBJbnB1dFJlZmVyZW5jZVR5cGUge1xyXG4gICAgICAgIGNvbnN0IHJlZjogSW5wdXRSZWZlcmVuY2VUeXBlID0ge1xyXG4gICAgICAgICAgICBocmVmOiBpbnB1dC52YWx1ZSxcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgbWltZVR5cGU6IGlucHV0LmRlc2NyaXB0aW9uLmZvcm1hdFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHJlZjtcclxuICAgIH1cclxuXHJcbiAgICBtYXJzaGFsbEdldFN0YXR1c0JvZHkoc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBzdGF0dXNJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgLy8gV1BTLTEuMCBkb2VzIG5vdCBzZW5kIGEgYm9keSB3aXRoIGEgR2V0U3RhdHVzIHJlcXVlc3QuXHJcbiAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG5cclxuICAgIG1hcnNoYWxsR2V0UmVzdWx0Qm9keShzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGpvYklEOiBzdHJpbmcpIHtcclxuICAgICAgICAvLyBXUFMtMS4wIGRvZXMgbm90IHNlbmQgYSBib2R5IHdpdGggYSBHZXRTdGF0dXMgcmVxdWVzdC5cclxuICAgICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcblxyXG4gICAgZGlzbWlzc1VybChzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGpvYklkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIC8qKiB0aGlzIGRvZXMgb25seSB3b3JrIGluIGdlb3NlcnZlcjpcclxuICAgICAgICByZXR1cm4gYCR7c2VydmVyVXJsfT9zZXJ2aWNlPVdQUyZ2ZXJzaW9uPTEuMC4wJnJlcXVlc3Q9RGlzbWlzcyZleGVjdXRpb25JZD0ke2pvYklkfWA7ICovXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXcHMgMS4wIGRvZXMgbm90IHN1cHBvcnQgRGlzbWlzcy1vcGVyYXRpb25zLicpO1xyXG4gICAgfVxyXG5cclxuICAgIG1hcnNoYWxEaXNtaXNzQm9keShwcm9jZXNzSWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignV3BzIDEuMCBkb2VzIG5vdCBzdXBwb3J0IERpc21pc3Mtb3BlcmF0aW9ucy4nKTtcclxuICAgIH1cclxuXHJcbiAgICB1bm1hcnNoYWxEaXNtaXNzUmVzcG9uc2UoanNvblJlc3BvbnNlOiBhbnksIHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZyk6IFdwc1N0YXRlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dwcyAxLjAgZG9lcyBub3Qgc3VwcG9ydCBEaXNtaXNzLW9wZXJhdGlvbnMuJyk7XHJcbiAgICB9XHJcbn1cclxuIl19