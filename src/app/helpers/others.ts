import { ReturnStatement } from '@angular/compiler';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';


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
        <table class="table table-small">
            <tbody>${htmlRows.join(' ')}</tbody>
        </table>
    `;
}

export function createHeaderTableHtml(headerRow: string[], rows: string[][]): string {
    const headersFormatted = headerRow.map(he => `<th>${he}</th>`);
    const rowsFormatted = rows.map(row => {
        const colsFormatted = row.map(re => `<td>${re}</td>`);
        return `<tr>${colsFormatted.join('')}</tr>`;
    });
    return `
        <table class='table table-small'>
            <tr>${headersFormatted.join('')}</tr>
            ${rowsFormatted.join('')}
        </table>
    `;
}

export function createTableHtml(rows: string[][]): string {
    const rowsFormatted = rows.map(row => {
        const colsFormatted = row.map(re => `<td>${re}</td>`);
        return `<tr>${colsFormatted.join('')}</tr>`;
    });
    return `
        <table class='table table-small'>
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

export function createOlFeature(geojson: object): Feature[] {
    const geoJsonReader = new GeoJSON({
        defaultDataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326'
      });
      return geoJsonReader.readFeature(geojson);
}
