import { Observable } from 'rxjs';
export declare function pollUntil<T>(task$: Observable<T>, predicate: (results: any) => boolean, doWhile?: (t: T | null) => any, minWaitTime?: number): Observable<T>;
export declare function delayedRetry(delayMs: number, maxRetries?: number): (src$: Observable<any>) => Observable<any>;
