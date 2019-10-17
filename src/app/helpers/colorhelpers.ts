

export function redGreenRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
    const degree = (currentVal - startVal) / (endVal - startVal);
    const degreeTop = Math.max(degree, 1);
    const r = degree * 255;
    const g = (1 - degree) * 255;
    const b = 125;
    return [r, g, b];
}



export function ninetyPercentLowerThan(data: number[]): number {
    const total = data.reduce((carry, current) => carry + current, 0);
    let cuml = 0;
    for (let i = 0; i < data.length; i++) {
        cuml += data[i];
        const percentage = cuml / total;
        if (percentage >= 0.9) {
            return i;
        }
    }
    return data.length;
}

export function toDecimalPlaces(value: number, decimalPlaces: number): string {
    switch (typeof value) {
        case 'number':
            return value.toFixed(decimalPlaces);
        case 'string':
            return parseFloat(value).toFixed(decimalPlaces);
    }
}
