import { ReturnStatement } from '@angular/compiler';

export function deepValMap(obj: object, mapFn: (key: string, val: any) => any, callStacksize = 0): void {
    if (callStacksize > 10) {
        return;
    }
    for (const key in obj) {
        if (obj[key]) {
            obj[key] = mapFn(key, obj[key]);
            if (typeof obj[key] === 'object') {
                deepValMap(obj[key], mapFn, callStacksize + 1);
            }
        }
    }
}

export function deepCopy<T>(obj: T, callStacksize = 0): T {
    if (callStacksize > 10) {
        return;
    }
    const newObj: T = { ... obj };
    for (const key in obj) {
        if (obj[key]) {
            if (typeof obj[key] === 'object') {
                newObj[key] = deepCopy(obj[key], callStacksize + 1);
            }
        }
    }
    return newObj;
}
