/**
 * @fileoverview added by tsickle
 * Generated from: lib/wps/utils/polling.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { timer, of, forkJoin } from 'rxjs';
import { tap, map, mergeMap, retryWhen, delay } from 'rxjs/operators';
/**
 * @template T
 * @param {?} task$
 * @param {?} predicate
 * @param {?=} doWhile
 * @param {?=} minWaitTime
 * @return {?}
 */
export function pollUntil(task$, predicate, doWhile, minWaitTime) {
    if (minWaitTime === void 0) { minWaitTime = 1000; }
    if (doWhile) {
        doWhile(null);
    }
    /** @type {?} */
    var tappedTask$ = task$.pipe(tap((/**
     * @param {?} r
     * @return {?}
     */
    function (r) {
        if (doWhile) {
            doWhile(r);
        }
    })));
    /** @type {?} */
    var requestTakesAtLeast$ = forkJoin(tappedTask$, timer(minWaitTime)).pipe(map((/**
     * @param {?} r
     * @return {?}
     */
    function (r) { return r[0]; })));
    /** @type {?} */
    var polledRequest$ = requestTakesAtLeast$.pipe(mergeMap((/**
     * @param {?} response
     * @return {?}
     */
    function (response) {
        if (predicate(response)) {
            // console.log(`obtained correct answer ${response}`);
            return of(response);
        }
        else {
            // console.log(`obtained false answer ${response}. trying again...`);
            return polledRequest$;
        }
    })));
    return polledRequest$;
}
/**
 * @param {?} delayMs
 * @param {?=} maxRetries
 * @return {?}
 */
export function delayedRetry(delayMs, maxRetries) {
    if (maxRetries === void 0) { maxRetries = 3; }
    /** @type {?} */
    var attempts = 1;
    return (/**
     * @param {?} src$
     * @return {?}
     */
    function (src$) {
        return src$.pipe(
        // If an error occurs ...
        retryWhen((/**
         * @param {?} error$
         * @return {?}
         */
        function (error$) {
            return error$.pipe(delay(delayMs), // <- in any case, first wait a little while ...
            mergeMap((/**
             * @param {?} error
             * @return {?}
             */
            function (error) {
                if (error.status && error.status === 400) {
                    // In case of a server error, repeating won't help.
                    throw error;
                }
                else if (attempts <= maxRetries) {
                    console.log('http-error. Retrying ...');
                    attempts += 1;
                    return of(error); // <- an observable causes request to be retried
                }
                else {
                    console.log("Persistent http-errors after " + attempts + " attempts. Giving up.");
                    throw error; // an error causes request to be given up on.
                }
            })));
        })));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sbGluZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B1a2lzL3NlcnZpY2VzLW9nYy8iLCJzb3VyY2VzIjpbImxpYi93cHMvdXRpbHMvcG9sbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBYyxLQUFLLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2RCxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7QUFLdEUsTUFBTSxVQUFVLFNBQVMsQ0FDckIsS0FBb0IsRUFBRSxTQUFvQyxFQUFFLE9BQThCLEVBQUUsV0FBMEI7SUFBMUIsNEJBQUEsRUFBQSxrQkFBMEI7SUFFdEgsSUFBSSxPQUFPLEVBQUU7UUFDVCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakI7O1FBRUssV0FBVyxHQUFrQixLQUFLLENBQUMsSUFBSSxDQUN6QyxHQUFHOzs7O0lBQUMsVUFBQyxDQUFNO1FBQ1AsSUFBSSxPQUFPLEVBQUU7WUFDVCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDZDtJQUNMLENBQUMsRUFBQyxDQUNMOztRQUVLLG9CQUFvQixHQUFrQixRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDdEYsR0FBRzs7OztJQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFKLENBQUksRUFBQyxDQUNqQjs7UUFFSyxjQUFjLEdBQWtCLG9CQUFvQixDQUFDLElBQUksQ0FDM0QsUUFBUTs7OztJQUFDLFVBQUMsUUFBYTtRQUNuQixJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNyQixzREFBc0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNILHFFQUFxRTtZQUNyRSxPQUFPLGNBQWMsQ0FBQztTQUN6QjtJQUNMLENBQUMsRUFBQyxDQUNMO0lBRUQsT0FBTyxjQUFjLENBQUM7QUFDMUIsQ0FBQzs7Ozs7O0FBR0QsTUFBTSxVQUFVLFlBQVksQ0FBQyxPQUFlLEVBQUUsVUFBYztJQUFkLDJCQUFBLEVBQUEsY0FBYzs7UUFDcEQsUUFBUSxHQUFHLENBQUM7SUFFaEI7Ozs7SUFBTyxVQUFDLElBQXFCO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLElBQUk7UUFDWix5QkFBeUI7UUFDekIsU0FBUzs7OztRQUFDLFVBQUMsTUFBdUI7WUFDOUIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUNkLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxnREFBZ0Q7WUFDaEUsUUFBUTs7OztZQUFDLFVBQUMsS0FBVTtnQkFDaEIsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO29CQUN0QyxtREFBbUQ7b0JBQ25ELE1BQU0sS0FBSyxDQUFDO2lCQUNmO3FCQUFNLElBQUksUUFBUSxJQUFJLFVBQVUsRUFBRTtvQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO29CQUN4QyxRQUFRLElBQUksQ0FBQyxDQUFDO29CQUNkLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsZ0RBQWdEO2lCQUNyRTtxQkFBTTtvQkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFnQyxRQUFRLDBCQUF1QixDQUFDLENBQUM7b0JBQzdFLE1BQU0sS0FBSyxDQUFDLENBQUMsNkNBQTZDO2lCQUM3RDtZQUNMLENBQUMsRUFBQyxDQUNMLENBQUM7UUFDTixDQUFDLEVBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQyxFQUFDO0FBRU4sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUsIHRpbWVyLCBvZiwgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFwLCBtYXAsIG1lcmdlTWFwLCByZXRyeVdoZW4sIGRlbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBvbGxVbnRpbDxUPihcclxuICAgIHRhc2skOiBPYnNlcnZhYmxlPFQ+LCBwcmVkaWNhdGU6IChyZXN1bHRzOiBhbnkpID0+IGJvb2xlYW4sIGRvV2hpbGU/OiAodDogVCB8IG51bGwpID0+IGFueSwgbWluV2FpdFRpbWU6IG51bWJlciA9IDEwMDApOiBPYnNlcnZhYmxlPFQ+IHtcclxuXHJcbiAgICBpZiAoZG9XaGlsZSkge1xyXG4gICAgICAgIGRvV2hpbGUobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGFwcGVkVGFzayQ6IE9ic2VydmFibGU8VD4gPSB0YXNrJC5waXBlKFxyXG4gICAgICAgIHRhcCgocjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkb1doaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBkb1doaWxlKHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcmVxdWVzdFRha2VzQXRMZWFzdCQ6IE9ic2VydmFibGU8VD4gPSBmb3JrSm9pbih0YXBwZWRUYXNrJCwgdGltZXIobWluV2FpdFRpbWUpKS5waXBlKFxyXG4gICAgICAgIG1hcChyID0+IHJbMF0pXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHBvbGxlZFJlcXVlc3QkOiBPYnNlcnZhYmxlPFQ+ID0gcmVxdWVzdFRha2VzQXRMZWFzdCQucGlwZShcclxuICAgICAgICBtZXJnZU1hcCgocmVzcG9uc2U6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKHJlc3BvbnNlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYG9idGFpbmVkIGNvcnJlY3QgYW5zd2VyICR7cmVzcG9uc2V9YCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2YocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYG9idGFpbmVkIGZhbHNlIGFuc3dlciAke3Jlc3BvbnNlfS4gdHJ5aW5nIGFnYWluLi4uYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9sbGVkUmVxdWVzdCQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gcG9sbGVkUmVxdWVzdCQ7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsYXllZFJldHJ5KGRlbGF5TXM6IG51bWJlciwgbWF4UmV0cmllcyA9IDMpIHtcclxuICAgIGxldCBhdHRlbXB0cyA9IDE7XHJcblxyXG4gICAgcmV0dXJuIChzcmMkOiBPYnNlcnZhYmxlPGFueT4pID0+IHtcclxuICAgICAgICByZXR1cm4gc3JjJC5waXBlKFxyXG4gICAgICAgICAgICAvLyBJZiBhbiBlcnJvciBvY2N1cnMgLi4uXHJcbiAgICAgICAgICAgIHJldHJ5V2hlbigoZXJyb3IkOiBPYnNlcnZhYmxlPGFueT4pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlcnJvciQucGlwZShcclxuICAgICAgICAgICAgICAgICAgICBkZWxheShkZWxheU1zKSwgLy8gPC0gaW4gYW55IGNhc2UsIGZpcnN0IHdhaXQgYSBsaXR0bGUgd2hpbGUgLi4uXHJcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VNYXAoKGVycm9yOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyAmJiBlcnJvci5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW4gY2FzZSBvZiBhIHNlcnZlciBlcnJvciwgcmVwZWF0aW5nIHdvbid0IGhlbHAuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhdHRlbXB0cyA8PSBtYXhSZXRyaWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaHR0cC1lcnJvci4gUmV0cnlpbmcgLi4uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRlbXB0cyArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKGVycm9yKTsgLy8gPC0gYW4gb2JzZXJ2YWJsZSBjYXVzZXMgcmVxdWVzdCB0byBiZSByZXRyaWVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUGVyc2lzdGVudCBodHRwLWVycm9ycyBhZnRlciAke2F0dGVtcHRzfSBhdHRlbXB0cy4gR2l2aW5nIHVwLmApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7IC8vIGFuIGVycm9yIGNhdXNlcyByZXF1ZXN0IHRvIGJlIGdpdmVuIHVwIG9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH07XHJcblxyXG59XHJcbiJdfQ==