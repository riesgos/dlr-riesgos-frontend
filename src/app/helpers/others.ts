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

export function createKeyValueTableHtml(header: string, data: object): string {
    const rows: {key: string, val: string}[] = [];
    for (const key in data) {
        rows.push({key: key, val: data[key]});
    };

    const htmlRows = rows.map(row => {
        return `<tr><td>${row.key}</td><td>${row.val}</td></tr>`;
    });

    let headerFormatted = '';
    if (header !== '') {
        headerFormatted = `<h4>${header}</h4>`;
    }

    return `
        ${headerFormatted}
        <table class="table">
            <tbody>${htmlRows.join(' ')}</tbody>
        </table>
    `;
}
