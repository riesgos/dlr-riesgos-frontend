

export function damageRage(damageStates: number[]) {
    const maxDamage = damageStates.length;
    const nrBuildingsTotal = damageStates.reduce((carry, current) => carry + current, 0);
    let weightedSum = 0;
    for (let d = 0; d < maxDamage; d++) {
        weightedSum += d * damageStates[d] / nrBuildingsTotal;
    }
    return (1 / maxDamage) * weightedSum;
}


export function redGreenRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
    const degree = (currentVal - startVal) / (endVal - startVal);
    const degreeTop = Math.max(Math.min(degree, 1), 0);
    const r = degreeTop * 255;
    const g = (1 - degreeTop) * 255;
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

export function linInterpolateHue(startVal: number, startHue: number, endVal: number, endHue: number, currentVal: number): number {
    const degree = (currentVal - startVal) / (endVal - startVal);
    const degreeTop = Math.max(Math.min(degree, 1), 0);
    const hue = degreeTop * (endHue - startHue) + startHue;
    return hue;
}

export function linInterpolate(startVal: number, endVal: number, currentVal: number): number {
    const degree = (currentVal - startVal) / (endVal - startVal);
    const degreeTop = Math.max(Math.min(degree, 1), 0);
    const intp = degreeTop * (endVal - startVal) + startVal;
    return intp;
}

export function HSVtoRGB(hsv: {h: number, s: number, v: number}): {r: number, g: number, b: number} {
    const s = hsv.s;
    const v = hsv.v;
    const h = hsv.h;

    let r;
    let g;
    let b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
