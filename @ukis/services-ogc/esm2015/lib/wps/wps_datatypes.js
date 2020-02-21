/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wps_datatypes.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function WpsDataDescription() { }
if (false) {
    /** @type {?} */
    WpsDataDescription.prototype.id;
    /** @type {?} */
    WpsDataDescription.prototype.type;
    /** @type {?} */
    WpsDataDescription.prototype.reference;
    /** @type {?|undefined} */
    WpsDataDescription.prototype.format;
    /** @type {?|undefined} */
    WpsDataDescription.prototype.description;
    /** @type {?|undefined} */
    WpsDataDescription.prototype.defaultValue;
}
/**
 * @record
 */
export function WpsData() { }
if (false) {
    /** @type {?} */
    WpsData.prototype.description;
    /** @type {?} */
    WpsData.prototype.value;
}
/**
 * @record
 */
export function WpsBboxDescription() { }
if (false) {
    /** @type {?} */
    WpsBboxDescription.prototype.id;
    /** @type {?} */
    WpsBboxDescription.prototype.type;
    /** @type {?} */
    WpsBboxDescription.prototype.reference;
    /** @type {?|undefined} */
    WpsBboxDescription.prototype.format;
    /** @type {?|undefined} */
    WpsBboxDescription.prototype.description;
    /** @type {?|undefined} */
    WpsBboxDescription.prototype.defaultValue;
}
/**
 * @record
 */
export function WpsBboxValue() { }
if (false) {
    /** @type {?} */
    WpsBboxValue.prototype.crs;
    /** @type {?} */
    WpsBboxValue.prototype.lllon;
    /** @type {?} */
    WpsBboxValue.prototype.lllat;
    /** @type {?} */
    WpsBboxValue.prototype.urlon;
    /** @type {?} */
    WpsBboxValue.prototype.urlat;
}
/** @type {?} */
export const isBbox = (/**
 * @param {?} obj
 * @return {?}
 */
(obj) => {
    return (obj.hasOwnProperty('crs') &&
        obj.hasOwnProperty('lllon') &&
        obj.hasOwnProperty('lllat') &&
        obj.hasOwnProperty('urlon') &&
        obj.hasOwnProperty('urlat'));
});
/**
 * @record
 */
export function WpsState() { }
if (false) {
    /** @type {?} */
    WpsState.prototype.status;
    /** @type {?|undefined} */
    WpsState.prototype.percentCompleted;
    /**
     * WPS 2.0 only
     * @type {?|undefined}
     */
    WpsState.prototype.jobID;
    /**
     * WPS 1.0 only
     * @type {?|undefined}
     */
    WpsState.prototype.statusLocation;
    /**
     * WPS 1.0 only: a success-state already contains the results
     * @type {?|undefined}
     */
    WpsState.prototype.results;
}
/**
 * @param {?} obj
 * @return {?}
 */
export function isWpsState(obj) {
    return obj && obj.hasOwnProperty('status') && (obj.hasOwnProperty('jobID') || obj.hasOwnProperty('statusLocation'));
}
/**
 * @record
 */
export function WpsBboxData() { }
if (false) {
    /** @type {?} */
    WpsBboxData.prototype.description;
    /** @type {?} */
    WpsBboxData.prototype.value;
}
/**
 * @record
 */
export function WpsCapability() { }
if (false) {
    /** @type {?} */
    WpsCapability.prototype.id;
}
/**
 * @record
 */
export function WpsMarshaller() { }
if (false) {
    /**
     * @param {?} url
     * @param {?} processId
     * @return {?}
     */
    WpsMarshaller.prototype.executeUrl = function (url, processId) { };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobId
     * @return {?}
     */
    WpsMarshaller.prototype.dismissUrl = function (serverUrl, processId, jobId) { };
    /**
     * @param {?} baseurl
     * @return {?}
     */
    WpsMarshaller.prototype.getCapabilitiesUrl = function (baseurl) { };
    /**
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} async
     * @return {?}
     */
    WpsMarshaller.prototype.marshalExecBody = function (processId, inputs, outputs, async) { };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} statusId
     * @return {?}
     */
    WpsMarshaller.prototype.marshallGetStatusBody = function (serverUrl, processId, statusId) { };
    /**
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} jobID
     * @return {?}
     */
    WpsMarshaller.prototype.marshallGetResultBody = function (serverUrl, processId, jobID) { };
    /**
     * @param {?} jobId
     * @return {?}
     */
    WpsMarshaller.prototype.marshalDismissBody = function (jobId) { };
    /**
     * @param {?} capabilitiesJson
     * @return {?}
     */
    WpsMarshaller.prototype.unmarshalCapabilities = function (capabilitiesJson) { };
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsMarshaller.prototype.unmarshalSyncExecuteResponse = function (responseJson, url, processId, inputs, outputDescriptions) { };
    /**
     * @param {?} responseJson
     * @param {?} url
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsMarshaller.prototype.unmarshalAsyncExecuteResponse = function (responseJson, url, processId, inputs, outputDescriptions) { };
    /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @param {?} inputs
     * @param {?} outputDescriptions
     * @return {?}
     */
    WpsMarshaller.prototype.unmarshalGetStateResponse = function (jsonResponse, serverUrl, processId, inputs, outputDescriptions) { };
    /**
     * @param {?} jsonResponse
     * @param {?} serverUrl
     * @param {?} processId
     * @return {?}
     */
    WpsMarshaller.prototype.unmarshalDismissResponse = function (jsonResponse, serverUrl, processId) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3BzX2RhdGF0eXBlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B1a2lzL3NlcnZpY2VzLW9nYy8iLCJzb3VyY2VzIjpbImxpYi93cHMvd3BzX2RhdGF0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVNBLHdDQU9DOzs7SUFORyxnQ0FBYzs7SUFDZCxrQ0FBMEQ7O0lBQzFELHVDQUFtQjs7SUFDbkIsb0NBQXVCOztJQUN2Qix5Q0FBcUI7O0lBQ3JCLDBDQUFtQjs7Ozs7QUFNdkIsNkJBR0M7OztJQUZHLDhCQUFnQzs7SUFDaEMsd0JBQVc7Ozs7O0FBS2Ysd0NBT0M7OztJQU5HLGdDQUFjOztJQUNkLGtDQUFhOztJQUNiLHVDQUFtQjs7SUFDbkIsb0NBQXVCOztJQUN2Qix5Q0FBcUI7O0lBQ3JCLDBDQUFtQjs7Ozs7QUFHdkIsa0NBTUM7OztJQUxHLDJCQUFZOztJQUNaLDZCQUFjOztJQUNkLDZCQUFjOztJQUNkLDZCQUFjOztJQUNkLDZCQUFjOzs7QUFHbEIsTUFBTSxPQUFPLE1BQU07Ozs7QUFBRyxDQUFDLEdBQVcsRUFBdUIsRUFBRTtJQUN2RCxPQUFPLENBQ0gsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7UUFDekIsR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7UUFDM0IsR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7UUFDM0IsR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7UUFDM0IsR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FDOUIsQ0FBQztBQUNOLENBQUMsQ0FBQTs7OztBQUdELDhCQVNDOzs7SUFSRywwQkFBc0U7O0lBQ3RFLG9DQUEwQjs7Ozs7SUFFMUIseUJBQWU7Ozs7O0lBRWYsa0NBQXdCOzs7OztJQUV4QiwyQkFBb0I7Ozs7OztBQUd4QixNQUFNLFVBQVUsVUFBVSxDQUFDLEdBQVc7SUFDbEMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7QUFDeEgsQ0FBQzs7OztBQUdELGlDQUdDOzs7SUFGRyxrQ0FBZ0M7O0lBQ2hDLDRCQUFvQjs7Ozs7QUFHeEIsbUNBRUM7OztJQURHLDJCQUFXOzs7OztBQUlmLG1DQWdCQzs7Ozs7OztJQWRHLG1FQUFtRDs7Ozs7OztJQUNuRCxnRkFBd0U7Ozs7O0lBQ3hFLG9FQUE0Qzs7Ozs7Ozs7SUFFNUMsMkZBQTZHOzs7Ozs7O0lBQzdHLDhGQUFtRjs7Ozs7OztJQUNuRiwyRkFBZ0Y7Ozs7O0lBQ2hGLGtFQUF1Qzs7Ozs7SUFFdkMsZ0ZBQThEOzs7Ozs7Ozs7SUFDOUQsK0hBQTZKOzs7Ozs7Ozs7SUFDN0osZ0lBQTJKOzs7Ozs7Ozs7SUFDM0osa0lBQTZKOzs7Ozs7O0lBQzdKLHFHQUE0RiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB0eXBlIFdwc1ZlcmlvbiA9ICcxLjAuMCcgfCAnMi4wLjAnO1xyXG5leHBvcnQgdHlwZSBXcHNEYXRhRm9ybWF0ID0gJ2FwcGxpY2F0aW9uL3ZuZC5nZW8ranNvbicgfCAnYXBwbGljYXRpb24vanNvbicgfCAnYXBwbGljYXRpb24vV01TJyB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXBwbGljYXRpb24veG1sJyB8ICd0ZXh0L3htbCcgfCAnYXBwbGljYXRpb24vdGV4dCcgfCAnaW1hZ2UvZ2VvdGlmZicgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQvcGxhaW4nO1xyXG5cclxuXHJcbmV4cG9ydCB0eXBlIFByb2Nlc3NJZCA9IHN0cmluZztcclxuZXhwb3J0IHR5cGUgUHJvZHVjdElkID0gc3RyaW5nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXcHNEYXRhRGVzY3JpcHRpb24ge1xyXG4gICAgaWQ6IFByb2R1Y3RJZDtcclxuICAgIHR5cGU6ICdsaXRlcmFsJyB8ICdjb21wbGV4JyB8ICdiYm94JyB8ICdzdGF0dXMnIHwgJ2Vycm9yJztcclxuICAgIHJlZmVyZW5jZTogYm9vbGVhbjtcclxuICAgIGZvcm1hdD86IFdwc0RhdGFGb3JtYXQ7XHJcbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZztcclxuICAgIGRlZmF1bHRWYWx1ZT86IGFueTtcclxufVxyXG5leHBvcnQgdHlwZSBXcHNJbnB1dERlc2NyaXB0aW9uID0gV3BzRGF0YURlc2NyaXB0aW9uO1xyXG5leHBvcnQgdHlwZSBXcHNPdXRwdXREZXNjcmlwdGlvbiA9IFdwc0RhdGFEZXNjcmlwdGlvbjtcclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdwc0RhdGEge1xyXG4gICAgZGVzY3JpcHRpb246IFdwc0RhdGFEZXNjcmlwdGlvbjtcclxuICAgIHZhbHVlOiBhbnk7XHJcbn1cclxuZXhwb3J0IHR5cGUgV3BzSW5wdXQgPSBXcHNEYXRhO1xyXG5leHBvcnQgdHlwZSBXcHNSZXN1bHQgPSBXcHNEYXRhO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXcHNCYm94RGVzY3JpcHRpb24ge1xyXG4gICAgaWQ6IFByb2R1Y3RJZDtcclxuICAgIHR5cGU6ICdiYm94JztcclxuICAgIHJlZmVyZW5jZTogYm9vbGVhbjtcclxuICAgIGZvcm1hdD86IFdwc0RhdGFGb3JtYXQ7XHJcbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZztcclxuICAgIGRlZmF1bHRWYWx1ZT86IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXcHNCYm94VmFsdWUge1xyXG4gICAgY3JzOiBzdHJpbmc7XHJcbiAgICBsbGxvbjogbnVtYmVyO1xyXG4gICAgbGxsYXQ6IG51bWJlcjtcclxuICAgIHVybG9uOiBudW1iZXI7XHJcbiAgICB1cmxhdDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaXNCYm94ID0gKG9iajogb2JqZWN0KTogb2JqIGlzIFdwc0Jib3hWYWx1ZSA9PiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eSgnY3JzJykgJiZcclxuICAgICAgICBvYmouaGFzT3duUHJvcGVydHkoJ2xsbG9uJykgJiZcclxuICAgICAgICBvYmouaGFzT3duUHJvcGVydHkoJ2xsbGF0JykgJiZcclxuICAgICAgICBvYmouaGFzT3duUHJvcGVydHkoJ3VybG9uJykgJiZcclxuICAgICAgICBvYmouaGFzT3duUHJvcGVydHkoJ3VybGF0JylcclxuICAgICk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXcHNTdGF0ZSB7XHJcbiAgICBzdGF0dXM6ICdTdWNjZWVkZWQnIHwgJ0ZhaWxlZCcgfCAnQWNjZXB0ZWQnIHwgJ1J1bm5pbmcnIHwgJ0Rpc21pc3NlZCc7XHJcbiAgICBwZXJjZW50Q29tcGxldGVkPzogbnVtYmVyO1xyXG4gICAgLyoqIFdQUyAyLjAgb25seSAqL1xyXG4gICAgam9iSUQ/OiBzdHJpbmc7XHJcbiAgICAvKiogV1BTIDEuMCBvbmx5ICovXHJcbiAgICBzdGF0dXNMb2NhdGlvbj86IHN0cmluZztcclxuICAgIC8qKiBXUFMgMS4wIG9ubHk6IGEgc3VjY2Vzcy1zdGF0ZSBhbHJlYWR5IGNvbnRhaW5zIHRoZSByZXN1bHRzICovXHJcbiAgICByZXN1bHRzPzogV3BzRGF0YVtdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNXcHNTdGF0ZShvYmo6IG9iamVjdCk6IG9iaiBpcyBXcHNTdGF0ZSB7XHJcbiAgICByZXR1cm4gb2JqICYmIG9iai5oYXNPd25Qcm9wZXJ0eSgnc3RhdHVzJykgJiYgKG9iai5oYXNPd25Qcm9wZXJ0eSgnam9iSUQnKSB8fCBvYmouaGFzT3duUHJvcGVydHkoJ3N0YXR1c0xvY2F0aW9uJykpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXcHNCYm94RGF0YSB7XHJcbiAgICBkZXNjcmlwdGlvbjogV3BzQmJveERlc2NyaXB0aW9uO1xyXG4gICAgdmFsdWU6IFdwc0Jib3hWYWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXcHNDYXBhYmlsaXR5IHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdwc01hcnNoYWxsZXIge1xyXG5cclxuICAgIGV4ZWN1dGVVcmwodXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgZGlzbWlzc1VybChzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGpvYklkOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICBnZXRDYXBhYmlsaXRpZXNVcmwoYmFzZXVybDogc3RyaW5nKTogc3RyaW5nO1xyXG5cclxuICAgIG1hcnNoYWxFeGVjQm9keShwcm9jZXNzSWQ6IHN0cmluZywgaW5wdXRzOiBXcHNJbnB1dFtdLCBvdXRwdXRzOiBXcHNPdXRwdXREZXNjcmlwdGlvbltdLCBhc3luYzogYm9vbGVhbik6IGFueTtcclxuICAgIG1hcnNoYWxsR2V0U3RhdHVzQm9keShzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIHN0YXR1c0lkOiBzdHJpbmcpOiBhbnk7XHJcbiAgICBtYXJzaGFsbEdldFJlc3VsdEJvZHkoc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBqb2JJRDogc3RyaW5nKTogYW55O1xyXG4gICAgbWFyc2hhbERpc21pc3NCb2R5KGpvYklkOiBzdHJpbmcpOiBhbnk7XHJcblxyXG4gICAgdW5tYXJzaGFsQ2FwYWJpbGl0aWVzKGNhcGFiaWxpdGllc0pzb246IGFueSk6IFdwc0NhcGFiaWxpdHlbXTtcclxuICAgIHVubWFyc2hhbFN5bmNFeGVjdXRlUmVzcG9uc2UocmVzcG9uc2VKc29uOiBhbnksIHVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgaW5wdXRzOiBXcHNJbnB1dFtdLCBvdXRwdXREZXNjcmlwdGlvbnM6IFdwc091dHB1dERlc2NyaXB0aW9uW10pOiBXcHNSZXN1bHRbXTtcclxuICAgIHVubWFyc2hhbEFzeW5jRXhlY3V0ZVJlc3BvbnNlKHJlc3BvbnNlSnNvbjogYW55LCB1cmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzSW5wdXRbXSwgb3V0cHV0RGVzY3JpcHRpb25zOiBXcHNPdXRwdXREZXNjcmlwdGlvbltdKTogV3BzU3RhdGU7XHJcbiAgICB1bm1hcnNoYWxHZXRTdGF0ZVJlc3BvbnNlKGpzb25SZXNwb25zZTogYW55LCBzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzSW5wdXRbXSwgb3V0cHV0RGVzY3JpcHRpb25zOiBXcHNPdXRwdXREZXNjcmlwdGlvbltdKTogV3BzU3RhdGU7XHJcbiAgICB1bm1hcnNoYWxEaXNtaXNzUmVzcG9uc2UoanNvblJlc3BvbnNlOiBhbnksIHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZyk6IFdwc1N0YXRlO1xyXG59XHJcbiJdfQ==