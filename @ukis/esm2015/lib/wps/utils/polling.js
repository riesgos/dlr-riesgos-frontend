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
export function pollUntil(task$, predicate, doWhile, minWaitTime = 1000) {
    if (doWhile) {
        doWhile(null);
    }
    /** @type {?} */
    const tappedTask$ = task$.pipe(tap((/**
     * @param {?} r
     * @return {?}
     */
    (r) => {
        if (doWhile) {
            doWhile(r);
        }
    })));
    /** @type {?} */
    const requestTakesAtLeast$ = forkJoin(tappedTask$, timer(minWaitTime)).pipe(map((/**
     * @param {?} r
     * @return {?}
     */
    r => r[0])));
    /** @type {?} */
    const polledRequest$ = requestTakesAtLeast$.pipe(mergeMap((/**
     * @param {?} response
     * @return {?}
     */
    (response) => {
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
export function delayedRetry(delayMs, maxRetries = 3) {
    /** @type {?} */
    let attempts = 1;
    return (/**
     * @param {?} src$
     * @return {?}
     */
    (src$) => {
        return src$.pipe(
        // If an error occurs ...
        retryWhen((/**
         * @param {?} error$
         * @return {?}
         */
        (error$) => {
            return error$.pipe(delay(delayMs), // <- in any case, first wait a little while ...
            mergeMap((/**
             * @param {?} error
             * @return {?}
             */
            (error) => {
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
                    console.log(`Persistent http-errors after ${attempts} attempts. Giving up.`);
                    throw error; // an error causes request to be given up on.
                }
            })));
        })));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sbGluZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B1a2lzL3NlcnZpY2VzLW9nYy8iLCJzb3VyY2VzIjpbImxpYi93cHMvdXRpbHMvcG9sbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBYyxLQUFLLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2RCxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7QUFLdEUsTUFBTSxVQUFVLFNBQVMsQ0FDckIsS0FBb0IsRUFBRSxTQUFvQyxFQUFFLE9BQThCLEVBQUUsY0FBc0IsSUFBSTtJQUV0SCxJQUFJLE9BQU8sRUFBRTtRQUNULE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNqQjs7VUFFSyxXQUFXLEdBQWtCLEtBQUssQ0FBQyxJQUFJLENBQ3pDLEdBQUc7Ozs7SUFBQyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ1gsSUFBSSxPQUFPLEVBQUU7WUFDVCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDZDtJQUNMLENBQUMsRUFBQyxDQUNMOztVQUVLLG9CQUFvQixHQUFrQixRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDdEYsR0FBRzs7OztJQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQ2pCOztVQUVLLGNBQWMsR0FBa0Isb0JBQW9CLENBQUMsSUFBSSxDQUMzRCxRQUFROzs7O0lBQUMsQ0FBQyxRQUFhLEVBQUUsRUFBRTtRQUN2QixJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNyQixzREFBc0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNILHFFQUFxRTtZQUNyRSxPQUFPLGNBQWMsQ0FBQztTQUN6QjtJQUNMLENBQUMsRUFBQyxDQUNMO0lBRUQsT0FBTyxjQUFjLENBQUM7QUFDMUIsQ0FBQzs7Ozs7O0FBR0QsTUFBTSxVQUFVLFlBQVksQ0FBQyxPQUFlLEVBQUUsVUFBVSxHQUFHLENBQUM7O1FBQ3BELFFBQVEsR0FBRyxDQUFDO0lBRWhCOzs7O0lBQU8sQ0FBQyxJQUFxQixFQUFFLEVBQUU7UUFDN0IsT0FBTyxJQUFJLENBQUMsSUFBSTtRQUNaLHlCQUF5QjtRQUN6QixTQUFTOzs7O1FBQUMsQ0FBQyxNQUF1QixFQUFFLEVBQUU7WUFDbEMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUNkLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxnREFBZ0Q7WUFDaEUsUUFBUTs7OztZQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7Z0JBQ3BCLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDdEMsbURBQW1EO29CQUNuRCxNQUFNLEtBQUssQ0FBQztpQkFDZjtxQkFBTSxJQUFJLFFBQVEsSUFBSSxVQUFVLEVBQUU7b0JBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztvQkFDeEMsUUFBUSxJQUFJLENBQUMsQ0FBQztvQkFDZCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGdEQUFnRDtpQkFDckU7cUJBQU07b0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsUUFBUSx1QkFBdUIsQ0FBQyxDQUFDO29CQUM3RSxNQUFNLEtBQUssQ0FBQyxDQUFDLDZDQUE2QztpQkFDN0Q7WUFDTCxDQUFDLEVBQUMsQ0FDTCxDQUFDO1FBQ04sQ0FBQyxFQUFDLENBQ0wsQ0FBQztJQUNOLENBQUMsRUFBQztBQUVOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlLCB0aW1lciwgb2YsIGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IHRhcCwgbWFwLCBtZXJnZU1hcCwgcmV0cnlXaGVuLCBkZWxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwb2xsVW50aWw8VD4oXHJcbiAgICB0YXNrJDogT2JzZXJ2YWJsZTxUPiwgcHJlZGljYXRlOiAocmVzdWx0czogYW55KSA9PiBib29sZWFuLCBkb1doaWxlPzogKHQ6IFQgfCBudWxsKSA9PiBhbnksIG1pbldhaXRUaW1lOiBudW1iZXIgPSAxMDAwKTogT2JzZXJ2YWJsZTxUPiB7XHJcblxyXG4gICAgaWYgKGRvV2hpbGUpIHtcclxuICAgICAgICBkb1doaWxlKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRhcHBlZFRhc2skOiBPYnNlcnZhYmxlPFQ+ID0gdGFzayQucGlwZShcclxuICAgICAgICB0YXAoKHI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZG9XaGlsZSkge1xyXG4gICAgICAgICAgICAgICAgZG9XaGlsZShyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHJlcXVlc3RUYWtlc0F0TGVhc3QkOiBPYnNlcnZhYmxlPFQ+ID0gZm9ya0pvaW4odGFwcGVkVGFzayQsIHRpbWVyKG1pbldhaXRUaW1lKSkucGlwZShcclxuICAgICAgICBtYXAociA9PiByWzBdKVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBwb2xsZWRSZXF1ZXN0JDogT2JzZXJ2YWJsZTxUPiA9IHJlcXVlc3RUYWtlc0F0TGVhc3QkLnBpcGUoXHJcbiAgICAgICAgbWVyZ2VNYXAoKHJlc3BvbnNlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShyZXNwb25zZSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBvYnRhaW5lZCBjb3JyZWN0IGFuc3dlciAke3Jlc3BvbnNlfWApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBvYnRhaW5lZCBmYWxzZSBhbnN3ZXIgJHtyZXNwb25zZX0uIHRyeWluZyBhZ2Fpbi4uLmApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvbGxlZFJlcXVlc3QkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHBvbGxlZFJlcXVlc3QkO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5ZWRSZXRyeShkZWxheU1zOiBudW1iZXIsIG1heFJldHJpZXMgPSAzKSB7XHJcbiAgICBsZXQgYXR0ZW1wdHMgPSAxO1xyXG5cclxuICAgIHJldHVybiAoc3JjJDogT2JzZXJ2YWJsZTxhbnk+KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNyYyQucGlwZShcclxuICAgICAgICAgICAgLy8gSWYgYW4gZXJyb3Igb2NjdXJzIC4uLlxyXG4gICAgICAgICAgICByZXRyeVdoZW4oKGVycm9yJDogT2JzZXJ2YWJsZTxhbnk+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3IkLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXkoZGVsYXlNcyksIC8vIDwtIGluIGFueSBjYXNlLCBmaXJzdCB3YWl0IGEgbGl0dGxlIHdoaWxlIC4uLlxyXG4gICAgICAgICAgICAgICAgICAgIG1lcmdlTWFwKChlcnJvcjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgJiYgZXJyb3Iuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluIGNhc2Ugb2YgYSBzZXJ2ZXIgZXJyb3IsIHJlcGVhdGluZyB3b24ndCBoZWxwLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXR0ZW1wdHMgPD0gbWF4UmV0cmllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2h0dHAtZXJyb3IuIFJldHJ5aW5nIC4uLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ZW1wdHMgKz0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvZihlcnJvcik7IC8vIDwtIGFuIG9ic2VydmFibGUgY2F1c2VzIHJlcXVlc3QgdG8gYmUgcmV0cmllZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFBlcnNpc3RlbnQgaHR0cC1lcnJvcnMgYWZ0ZXIgJHthdHRlbXB0c30gYXR0ZW1wdHMuIEdpdmluZyB1cC5gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yOyAvLyBhbiBlcnJvciBjYXVzZXMgcmVxdWVzdCB0byBiZSBnaXZlbiB1cCBvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9O1xyXG5cclxufVxyXG4iXX0=