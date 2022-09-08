/**
 * sleep() is used in animation code and also in some unit tests where async behavior needs to
 * be tested.
 *
 * Use sleep() inside an async function to delay execution for a short period of time.
 *
 * ```
 * async function ohai() {
 *    await sleep(55); // delays execution by at least 55 ms
 *    return 'ohai';
 * }
 * ```
 *
 * NOTE: the time sent to sleep is the MINIMUM time duration to execution. It is not and will not
 * be the exact time to execution.
 *
 */
export declare function sleep(millisecondsToWait?: number): Promise<unknown>;
