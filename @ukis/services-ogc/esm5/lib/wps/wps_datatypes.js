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
export var isBbox = (/**
 * @param {?} obj
 * @return {?}
 */
function (obj) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3BzX2RhdGF0eXBlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B1a2lzL3NlcnZpY2VzLW9nYy8iLCJzb3VyY2VzIjpbImxpYi93cHMvd3BzX2RhdGF0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVNBLHdDQU9DOzs7SUFORyxnQ0FBYzs7SUFDZCxrQ0FBMEQ7O0lBQzFELHVDQUFtQjs7SUFDbkIsb0NBQXVCOztJQUN2Qix5Q0FBcUI7O0lBQ3JCLDBDQUFtQjs7Ozs7QUFNdkIsNkJBR0M7OztJQUZHLDhCQUFnQzs7SUFDaEMsd0JBQVc7Ozs7O0FBS2Ysd0NBT0M7OztJQU5HLGdDQUFjOztJQUNkLGtDQUFhOztJQUNiLHVDQUFtQjs7SUFDbkIsb0NBQXVCOztJQUN2Qix5Q0FBcUI7O0lBQ3JCLDBDQUFtQjs7Ozs7QUFHdkIsa0NBTUM7OztJQUxHLDJCQUFZOztJQUNaLDZCQUFjOztJQUNkLDZCQUFjOztJQUNkLDZCQUFjOztJQUNkLDZCQUFjOzs7QUFHbEIsTUFBTSxLQUFPLE1BQU07Ozs7QUFBRyxVQUFDLEdBQVc7SUFDOUIsT0FBTyxDQUNILEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQzlCLENBQUM7QUFDTixDQUFDLENBQUE7Ozs7QUFHRCw4QkFTQzs7O0lBUkcsMEJBQXNFOztJQUN0RSxvQ0FBMEI7Ozs7O0lBRTFCLHlCQUFlOzs7OztJQUVmLGtDQUF3Qjs7Ozs7SUFFeEIsMkJBQW9COzs7Ozs7QUFHeEIsTUFBTSxVQUFVLFVBQVUsQ0FBQyxHQUFXO0lBQ2xDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQ3hILENBQUM7Ozs7QUFHRCxpQ0FHQzs7O0lBRkcsa0NBQWdDOztJQUNoQyw0QkFBb0I7Ozs7O0FBR3hCLG1DQUVDOzs7SUFERywyQkFBVzs7Ozs7QUFJZixtQ0FnQkM7Ozs7Ozs7SUFkRyxtRUFBbUQ7Ozs7Ozs7SUFDbkQsZ0ZBQXdFOzs7OztJQUN4RSxvRUFBNEM7Ozs7Ozs7O0lBRTVDLDJGQUE2Rzs7Ozs7OztJQUM3Ryw4RkFBbUY7Ozs7Ozs7SUFDbkYsMkZBQWdGOzs7OztJQUNoRixrRUFBdUM7Ozs7O0lBRXZDLGdGQUE4RDs7Ozs7Ozs7O0lBQzlELCtIQUE2Sjs7Ozs7Ozs7O0lBQzdKLGdJQUEySjs7Ozs7Ozs7O0lBQzNKLGtJQUE2Sjs7Ozs7OztJQUM3SixxR0FBNEYiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdHlwZSBXcHNWZXJpb24gPSAnMS4wLjAnIHwgJzIuMC4wJztcclxuZXhwb3J0IHR5cGUgV3BzRGF0YUZvcm1hdCA9ICdhcHBsaWNhdGlvbi92bmQuZ2VvK2pzb24nIHwgJ2FwcGxpY2F0aW9uL2pzb24nIHwgJ2FwcGxpY2F0aW9uL1dNUycgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL3htbCcgfCAndGV4dC94bWwnIHwgJ2FwcGxpY2F0aW9uL3RleHQnIHwgJ2ltYWdlL2dlb3RpZmYnIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0L3BsYWluJztcclxuXHJcblxyXG5leHBvcnQgdHlwZSBQcm9jZXNzSWQgPSBzdHJpbmc7XHJcbmV4cG9ydCB0eXBlIFByb2R1Y3RJZCA9IHN0cmluZztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV3BzRGF0YURlc2NyaXB0aW9uIHtcclxuICAgIGlkOiBQcm9kdWN0SWQ7XHJcbiAgICB0eXBlOiAnbGl0ZXJhbCcgfCAnY29tcGxleCcgfCAnYmJveCcgfCAnc3RhdHVzJyB8ICdlcnJvcic7XHJcbiAgICByZWZlcmVuY2U6IGJvb2xlYW47XHJcbiAgICBmb3JtYXQ/OiBXcHNEYXRhRm9ybWF0O1xyXG4gICAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcbiAgICBkZWZhdWx0VmFsdWU/OiBhbnk7XHJcbn1cclxuZXhwb3J0IHR5cGUgV3BzSW5wdXREZXNjcmlwdGlvbiA9IFdwc0RhdGFEZXNjcmlwdGlvbjtcclxuZXhwb3J0IHR5cGUgV3BzT3V0cHV0RGVzY3JpcHRpb24gPSBXcHNEYXRhRGVzY3JpcHRpb247XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXcHNEYXRhIHtcclxuICAgIGRlc2NyaXB0aW9uOiBXcHNEYXRhRGVzY3JpcHRpb247XHJcbiAgICB2YWx1ZTogYW55O1xyXG59XHJcbmV4cG9ydCB0eXBlIFdwc0lucHV0ID0gV3BzRGF0YTtcclxuZXhwb3J0IHR5cGUgV3BzUmVzdWx0ID0gV3BzRGF0YTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV3BzQmJveERlc2NyaXB0aW9uIHtcclxuICAgIGlkOiBQcm9kdWN0SWQ7XHJcbiAgICB0eXBlOiAnYmJveCc7XHJcbiAgICByZWZlcmVuY2U6IGJvb2xlYW47XHJcbiAgICBmb3JtYXQ/OiBXcHNEYXRhRm9ybWF0O1xyXG4gICAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcbiAgICBkZWZhdWx0VmFsdWU/OiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV3BzQmJveFZhbHVlIHtcclxuICAgIGNyczogc3RyaW5nO1xyXG4gICAgbGxsb246IG51bWJlcjtcclxuICAgIGxsbGF0OiBudW1iZXI7XHJcbiAgICB1cmxvbjogbnVtYmVyO1xyXG4gICAgdXJsYXQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGlzQmJveCA9IChvYmo6IG9iamVjdCk6IG9iaiBpcyBXcHNCYm94VmFsdWUgPT4ge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICBvYmouaGFzT3duUHJvcGVydHkoJ2NycycpICYmXHJcbiAgICAgICAgb2JqLmhhc093blByb3BlcnR5KCdsbGxvbicpICYmXHJcbiAgICAgICAgb2JqLmhhc093blByb3BlcnR5KCdsbGxhdCcpICYmXHJcbiAgICAgICAgb2JqLmhhc093blByb3BlcnR5KCd1cmxvbicpICYmXHJcbiAgICAgICAgb2JqLmhhc093blByb3BlcnR5KCd1cmxhdCcpXHJcbiAgICApO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV3BzU3RhdGUge1xyXG4gICAgc3RhdHVzOiAnU3VjY2VlZGVkJyB8ICdGYWlsZWQnIHwgJ0FjY2VwdGVkJyB8ICdSdW5uaW5nJyB8ICdEaXNtaXNzZWQnO1xyXG4gICAgcGVyY2VudENvbXBsZXRlZD86IG51bWJlcjtcclxuICAgIC8qKiBXUFMgMi4wIG9ubHkgKi9cclxuICAgIGpvYklEPzogc3RyaW5nO1xyXG4gICAgLyoqIFdQUyAxLjAgb25seSAqL1xyXG4gICAgc3RhdHVzTG9jYXRpb24/OiBzdHJpbmc7XHJcbiAgICAvKiogV1BTIDEuMCBvbmx5OiBhIHN1Y2Nlc3Mtc3RhdGUgYWxyZWFkeSBjb250YWlucyB0aGUgcmVzdWx0cyAqL1xyXG4gICAgcmVzdWx0cz86IFdwc0RhdGFbXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzV3BzU3RhdGUob2JqOiBvYmplY3QpOiBvYmogaXMgV3BzU3RhdGUge1xyXG4gICAgcmV0dXJuIG9iaiAmJiBvYmouaGFzT3duUHJvcGVydHkoJ3N0YXR1cycpICYmIChvYmouaGFzT3duUHJvcGVydHkoJ2pvYklEJykgfHwgb2JqLmhhc093blByb3BlcnR5KCdzdGF0dXNMb2NhdGlvbicpKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV3BzQmJveERhdGEge1xyXG4gICAgZGVzY3JpcHRpb246IFdwc0Jib3hEZXNjcmlwdGlvbjtcclxuICAgIHZhbHVlOiBXcHNCYm94VmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV3BzQ2FwYWJpbGl0eSB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXcHNNYXJzaGFsbGVyIHtcclxuXHJcbiAgICBleGVjdXRlVXJsKHVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZyk6IHN0cmluZztcclxuICAgIGRpc21pc3NVcmwoc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBqb2JJZDogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgZ2V0Q2FwYWJpbGl0aWVzVXJsKGJhc2V1cmw6IHN0cmluZyk6IHN0cmluZztcclxuXHJcbiAgICBtYXJzaGFsRXhlY0JvZHkocHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzSW5wdXRbXSwgb3V0cHV0czogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSwgYXN5bmM6IGJvb2xlYW4pOiBhbnk7XHJcbiAgICBtYXJzaGFsbEdldFN0YXR1c0JvZHkoc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBzdGF0dXNJZDogc3RyaW5nKTogYW55O1xyXG4gICAgbWFyc2hhbGxHZXRSZXN1bHRCb2R5KHNlcnZlclVybDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgam9iSUQ6IHN0cmluZyk6IGFueTtcclxuICAgIG1hcnNoYWxEaXNtaXNzQm9keShqb2JJZDogc3RyaW5nKTogYW55O1xyXG5cclxuICAgIHVubWFyc2hhbENhcGFiaWxpdGllcyhjYXBhYmlsaXRpZXNKc29uOiBhbnkpOiBXcHNDYXBhYmlsaXR5W107XHJcbiAgICB1bm1hcnNoYWxTeW5jRXhlY3V0ZVJlc3BvbnNlKHJlc3BvbnNlSnNvbjogYW55LCB1cmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGlucHV0czogV3BzSW5wdXRbXSwgb3V0cHV0RGVzY3JpcHRpb25zOiBXcHNPdXRwdXREZXNjcmlwdGlvbltdKTogV3BzUmVzdWx0W107XHJcbiAgICB1bm1hcnNoYWxBc3luY0V4ZWN1dGVSZXNwb25zZShyZXNwb25zZUpzb246IGFueSwgdXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBpbnB1dHM6IFdwc0lucHV0W10sIG91dHB1dERlc2NyaXB0aW9uczogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSk6IFdwc1N0YXRlO1xyXG4gICAgdW5tYXJzaGFsR2V0U3RhdGVSZXNwb25zZShqc29uUmVzcG9uc2U6IGFueSwgc2VydmVyVXJsOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nLCBpbnB1dHM6IFdwc0lucHV0W10sIG91dHB1dERlc2NyaXB0aW9uczogV3BzT3V0cHV0RGVzY3JpcHRpb25bXSk6IFdwc1N0YXRlO1xyXG4gICAgdW5tYXJzaGFsRGlzbWlzc1Jlc3BvbnNlKGpzb25SZXNwb25zZTogYW55LCBzZXJ2ZXJVcmw6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcpOiBXcHNTdGF0ZTtcclxufVxyXG4iXX0=