
export async function sleep(timeMs: number): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), timeMs);
    })
}


export async function doUntil<T>(
        task$: () => Promise<T>, 
        predicate: (r: T) => boolean, 
        retryInterval: number = 1000): Promise<T> {

    const startTime = new Date();
    const result = await task$();
    const endTime = new Date();

    if (predicate(result)) return result;

    const timePassed = (endTime.getTime() - startTime.getTime()) / 1000;
    const timeRemaining = Math.max(retryInterval - timePassed, 0);
    await sleep(timeRemaining);
    return doUntil(task$, predicate);
}


export function toPromise<T>(data: T): Promise<T> {
    return new Promise(resolve => {
        resolve(data);
    });
}