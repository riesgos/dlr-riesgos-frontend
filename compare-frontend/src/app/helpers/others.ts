import { Observable } from 'rxjs';


export function unique(arr: any[]): any[] {
    const u: any[] = [];
    for (const el of arr) {
        if (!u.includes(el)) {
            u.push(el);
        }
    }
    return u;
}


export function deepValMap(obj: any, mapFn: (key: string, val: any) => any, callStacksize = 0): void {
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

export function deepCopy<T>(obj: T, callStacksize = 0): T | undefined {
    if (callStacksize > 10) {
        return;
    }
    const newObj: T = { ... obj };
    for (const key in obj) {
        if (obj[key]) {
            if (typeof obj[key] === 'object') {
                const val = deepCopy(obj[key], callStacksize + 1);
                if (val !== undefined) {
                    newObj[key] = val;
                }
            }
        }
    }
    return newObj;
}

export type TableType = 'small' | 'medium';

export function createKeyValueTableHtml(data: {[key: string]: any}, type: TableType = 'small'): string {
    const rows: {key: string, val: string}[] = [];
    for (const key in data) {
        rows.push({key: key, val: data[key]});
    };

    const htmlRows = rows.map(row => {
        return `<tr><td>${row.key}</td><td class="dataColumn">${row.val}</td></tr>`;
    });

    return `
        <table class="table table-${type}">
            <tbody>${htmlRows.join(' ')}</tbody>
        </table>
    `;
}

export function createHeaderTableHtml(headerRow: string[], rows: string[][], type: TableType = 'small'): string {
    const headersFormatted = headerRow.map(he => `<th>${he}</th>`);
    const rowsFormatted = rows.map(row => {
        const colsFormatted = row.map(re => `<td>${re}</td>`);
        return `<tr>${colsFormatted.join('')}</tr>`;
    });
    return `
        <table class='table table-${type}'>
            <tr>${headersFormatted.join('')}</tr>
            ${rowsFormatted.join('')}
        </table>
    `;
}


export function filledMatrix(nrRows: number, nrCols: number, filler: any): any[][] {
    return Array.from(Array(nrRows), _ => Array(nrCols).fill(filler));
}

export function zeros(nrRows: number, nrCols: number): number[][] {
    return Array.from(Array(nrRows), _ => Array(nrCols).fill(0));
}

export function getMax(arr: any[]) {
    let mx = arr[0];
    for (const x in arr) {
        if (x > mx) {
            mx = x;
        }
    }
    return mx;
}

export function sum(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0);
}

export function getMaxFromDict(dict: {[key: string]: any}) {
    let maxKey = null;
    let maxVal = -99999999;
    for (const key in dict) {
        if (dict[key] >= maxVal) {
            maxVal = dict[key];
            maxKey = key;
        }
    }
    return { maxKey, maxVal };
}


export function createTableHtml(rows: string[][], type: TableType = 'small'): string {
    const rowsFormatted = rows.map(row => {
        const colsFormatted = row.map(re => `<td>${re}</td>`);
        return `<tr>${colsFormatted.join('')}</tr>`;
    });
    return `
        <table class='table table-${type}'>
            ${rowsFormatted.join('')}
        </table>
    `;
}



export function downloadJson(data: object, fileName: string) {
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'text/json;charset=utf-8;' });
    return downloadBlob(blob, fileName);
}

export function downloadBlob(blob: Blob, fileName: string) {

    //window.open(url) doesn't work here. Instead, we create a temporary link item and simulate a click on it. 
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

export function downloadURI(uri: string, name: string) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

export function parseFile(file: File): Observable<string> {

    return new Observable((subscriber) => {

        if (!(file instanceof Blob)) {
            subscriber.error(new Error('`blob` must be an instance of File or Blob.'));
            return;
        }

        const reader: FileReader = new FileReader();

        reader.onerror = err => subscriber.error(err);
        reader.onabort = err => subscriber.error(err);
        reader.onload = () => subscriber.next(reader.result as string);
        reader.onloadend = () => subscriber.complete();

        return reader.readAsText(file);
    });
}

