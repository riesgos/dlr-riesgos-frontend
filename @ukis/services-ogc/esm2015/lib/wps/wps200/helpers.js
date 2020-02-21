/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/wps200/helpers.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
export const isStatusInfo = (/**
 * @param {?} obj
 * @return {?}
 */
(obj) => {
    return obj.hasOwnProperty('jobID')
        && obj.hasOwnProperty('status');
});
/** @type {?} */
export const isDataOutputType = (/**
 * @param {?} obj
 * @return {?}
 */
(obj) => {
    return obj.hasOwnProperty('id') &&
        (obj.hasOwnProperty('data') || obj.hasOwnProperty('reference') || obj.hasOwnProperty('output'));
});
/** @type {?} */
export const isResult = (/**
 * @param {?} obj
 * @return {?}
 */
(obj) => {
    return (obj.hasOwnProperty('output') && typeof obj['output'] === 'object');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B1a2lzL3NlcnZpY2VzLW9nYy8iLCJzb3VyY2VzIjpbImxpYi93cHMvd3BzMjAwL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0EsTUFBTSxPQUFPLFlBQVk7Ozs7QUFBRyxDQUFDLEdBQVcsRUFBcUIsRUFBRTtJQUMzRCxPQUFPLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO1dBQzVCLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFBOztBQUVELE1BQU0sT0FBTyxnQkFBZ0I7Ozs7QUFBRyxDQUFDLEdBQVcsRUFBeUIsRUFBRTtJQUNuRSxPQUFPLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO1FBQzNCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN4RyxDQUFDLENBQUE7O0FBRUQsTUFBTSxPQUFPLFFBQVE7Ozs7QUFBRyxDQUFDLEdBQVcsRUFBaUIsRUFBRTtJQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQztBQUMvRSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGF0dXNJbmZvLCBEYXRhT3V0cHV0VHlwZSwgUmVzdWx0IH0gZnJvbSAnLi93cHNfMi4wJztcclxuXHJcblxyXG5leHBvcnQgY29uc3QgaXNTdGF0dXNJbmZvID0gKG9iajogb2JqZWN0KTogb2JqIGlzIFN0YXR1c0luZm8gPT4ge1xyXG4gICAgcmV0dXJuIG9iai5oYXNPd25Qcm9wZXJ0eSgnam9iSUQnKVxyXG4gICAgICAgJiYgb2JqLmhhc093blByb3BlcnR5KCdzdGF0dXMnKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc0RhdGFPdXRwdXRUeXBlID0gKG9iajogb2JqZWN0KTogb2JqIGlzIERhdGFPdXRwdXRUeXBlID0+IHtcclxuICAgIHJldHVybiBvYmouaGFzT3duUHJvcGVydHkoJ2lkJykgJiZcclxuICAgICAgICAob2JqLmhhc093blByb3BlcnR5KCdkYXRhJykgfHwgb2JqLmhhc093blByb3BlcnR5KCdyZWZlcmVuY2UnKSB8fCBvYmouaGFzT3duUHJvcGVydHkoJ291dHB1dCcpKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpc1Jlc3VsdCA9IChvYmo6IG9iamVjdCk6IG9iaiBpcyBSZXN1bHQgPT4ge1xyXG4gICAgcmV0dXJuIChvYmouaGFzT3duUHJvcGVydHkoJ291dHB1dCcpICYmIHR5cGVvZiBvYmpbJ291dHB1dCddID09PSAnb2JqZWN0Jyk7XHJcbn07XHJcbiJdfQ==