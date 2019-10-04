import { Observable, timer, of, forkJoin, empty } from 'rxjs';
import { switchMap, tap, filter, take, debounceTime, min, map, expand } from 'rxjs/operators';
import { HttpRequest } from '@angular/common/http';
import { Predicate } from '@angular/core';


export const repeat = (request: Observable<any>, interval: number): Observable<any> => {
    return timer(0, interval).pipe(
        switchMap(() => request)
    );
};

export const doUntil = (action: Observable<any>, predicate: (result: any) => boolean, tapFunc?: (result: any) => void): Observable<any> => {
    return action.pipe(
        tap(tapFunc),
        filter(result => {
            return predicate(result);
        }),
        take(1)
    );
};

export const repeatUntil = (
    request: Observable<any>, interval: number, predicate: (result: any) => boolean, tapFunc?: (result: any) => void): Observable<any> => {
    return doUntil(
        repeat(request, interval),
        predicate,
        tapFunc
    );
};


export const doAfter = (observable: Observable<any>, callback: (result: any) => Observable<any>): Observable<any> => {
    return observable.pipe(
        switchMap(callback)
    )
}



//   const firstRequest = this.http.get('https://swapi.co/api/people/1');

//   const timeRequest = this.http.get('http://worldclockapi.com/api/json/est/now');

//   doAfter(
//     firstRequest, 
//     (result) => doUntil(
//       poll(timeRequest, 1000),
//       (response) => { return response['currentFileTime'] % 6 == 0 },
//       (response) => console.log('got intermediate', response)
//     )
//   ).subscribe(response => {
//     console.log('got final result', response);
//   })




export function doAndWait<T>(task: Observable<T>, minWaitTime: number = 1000): Observable<T> {
    const timer$ = timer(minWaitTime);
    return forkJoin({
        task: task,
        timer: timer$
    }).pipe(
        map(result => {
            return result.task;
        })
    );
}

export function pollUntil<T>(task$: Observable<T>, predicate: Predicate<T>): Observable<T> {
    const taskWithRetry$ = task$.pipe(
        switchMap((result: T) => {
            if (predicate(result)) {
                console.log('obtained expected answer. returning result...');
                return of(result);
            } else {
                console.log('false answer. trying again ...');
                return taskWithRetry$;
            }
        })
    );
    return taskWithRetry$;
}



// export function pollEveryUntil<T>(
//     task$: Observable<T>, predicate: Predicate<T>, doWhile?: (t: T | null) => any, minWaitTime: number = 1000): Observable<T> {

//     doWhile(null);

//     const taskWithMinWaitTime$ = task$.pipe(
//         debounceTime(minWaitTime),
//         tap(result => {
//             console.log('doing the doWhile ...');
//             doWhile(result);
//         })
//     );

//     return pollUntil(taskWithMinWaitTime$, predicate);
// }

export function pollEveryUntil<T>(
    task$: Observable<T>, predicate: Predicate<T>, doWhile?: (t: T | null) => any, minWaitTime: number = 1000): Observable<T> {

    doWhile(null);

    const tappedTask$ = task$.pipe(
        tap(r => doWhile(r))
    );

    const requestTakesAtLeast$ = forkJoin({req: tappedTask$, timer: timer(minWaitTime)}).pipe(
        map(r => r.req)
    );

    const polledRequest$ = requestTakesAtLeast$.pipe(
        switchMap(response => {
            if (predicate(response)) {
                console.log(`obtained correct answer ${response}`);
                return of(response);
            } else {
                console.log(`obtained false answer ${response}. trying again...`);
                return polledRequest$;
            }
        })
    );

    return polledRequest$;
}
