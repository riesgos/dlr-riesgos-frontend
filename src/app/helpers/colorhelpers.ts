import * as d3color from 'd3-color';

/**
 * sum_i (D_i * nr_buildings_i / nr_buildings_total)
 * @param damageStates: nr. buildings per damage state
 */
export function weightedDamage(damageStates: number[]) {
    const maxDamage = damageStates.length;
    const nrBuildingsTotal = damageStates.reduce((carry, current) => carry + current, 0);
    let weightedSum = 0;
    for (let d = 0; d < maxDamage; d++) {
        weightedSum += d * damageStates[d] / nrBuildingsTotal;
    }
    return weightedSum;
}


export function greenYellowRedRange(startVal: number, endVal: number, currentVal): [number, number, number] {
  const halfwayPoint = startVal + ((endVal - startVal) / 2);
  if (currentVal < halfwayPoint) {
    const degree = (currentVal - startVal) / (halfwayPoint - startVal);
    return [degree * 255, 255, 0];
  } else {
    const degree = (currentVal - halfwayPoint) / (endVal - halfwayPoint);
    return [255, (1 - degree) * 255, 0];
  }
}


export function greenRedRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
    const hue = linInterpolateXY(startVal, 0, endVal, 110, currentVal);
    const rgb = HSVtoRGB({h: hue / 360, s: 1, v: 1});
    return [rgb.r, rgb.g, rgb.b];
}

export function redGreenRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
    const hue = linInterpolateXY(startVal, 110, endVal, 0, currentVal);
    const rgb = HSVtoRGB({h: hue / 360, s: 1, v: 1});
    return [rgb.r, rgb.g, rgb.b];
}

export function yellowBlueRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
  const degree = (currentVal - startVal) / (endVal - startVal);
  const rgb = scaleInterpolation(yellowBlueScale, degree);
  return rgb;
}

export interface Scale {
  [key: string]: [number, number, number];
}

export const yellowBlueScale: Scale = {
  0.25: [237, 248, 177],
  0.50: [127, 205, 187],
  0.75: [44, 127, 184]
};

export function scaleInterpolation(scale: Scale, value: number, smooth = true): [number, number, number] {
  const keys = Object.keys(scale);
  const colors = Object.values(scale);
  const nrKeys =  keys.length;
  if (value < +keys[0]) {
    return colors[0];
  }
  for (let i = 1; i < nrKeys; i++) {
    const startKey = +keys[i - 1];
    const endKey = +keys[i];
    if (startKey <= value && value < endKey) {
      if (!smooth) {
        return colors[i];
      }
      const degree = (value - startKey) / (endKey - startKey);
      const startColorRGB = colors[i - 1];
      const endColorRGB = colors[i];
      const startColorHSL = d3color.hsl(d3color.rgb(... startColorRGB));
      const endColorHSL = d3color.hsl(d3color.rgb(... endColorRGB));
      const h = linInterpolate(startColorHSL.h, endColorHSL.h, degree);
      const s = linInterpolate(startColorHSL.s, endColorHSL.s, degree);
      const l = linInterpolate(startColorHSL.l, endColorHSL.l, degree);
      const rgb = d3color.rgb(d3color.hsl(h, s, l));
      return [rgb.r, rgb.g, rgb.b];
    }
  }
  return colors[nrKeys - 1];
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

export function percentileValue(data: number[], percentile: number): number {
  const sorted = data.sort();
  let out = sorted[0];

  const counts = {};
  for (const val of sorted) {
    if (counts[val]) {
      counts[val] += 1;
    } else {
      counts[val] = 1;
    }
  }

  const l = sorted.length;
  let cuml = 0;
  for (const val in counts) {
    if (counts[val] !== undefined) {
      const count = counts[val];
      cuml += count;
      const perc = cuml / l;

      if (percentile <= perc) {
        return out;
      }
      out = +val;
    }
  }
}


export function toDecimalPlaces(value: number, decimalPlaces: number): string {
    switch (typeof value) {
        case 'number':
            return value.toFixed(decimalPlaces);
        case 'string':
            return parseFloat(value).toFixed(decimalPlaces);
    }
}

export function linInterpolateXY(startX: number, startY: number, endX: number, endY: number, currentX: number): number {
    const degree = (currentX - startX) / (endX - startX);
    const degreeTop = Math.max(Math.min(degree, 1), 0);
    const y = degreeTop * (endY - startY) + startY;
    return y;
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
        g: Math.round(r * 255),
        r: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}





/**
 * Color manipulation functions below are adapted from
 * https://github.com/d3/d3-color.
 */
var Xn = 0.950470;
var Yn = 1;
var Zn = 1.088830;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;
var twoPi = 2 * Math.PI;


/**
 * Convert an RGB pixel into an HCL pixel.
 * @param {Array<number>} pixel A pixel in RGB space.
 * @return {Array<number>} A pixel in HCL space.
 */
function rgb2hcl(pixel: [number, number, number]): [number, number, number] {
  var red = rgb2xyz(pixel[0]);
  var green = rgb2xyz(pixel[1]);
  var blue = rgb2xyz(pixel[2]);

  var x = xyz2lab(
    (0.4124564 * red + 0.3575761 * green + 0.1804375 * blue) / Xn);
  var y = xyz2lab(
    (0.2126729 * red + 0.7151522 * green + 0.0721750 * blue) / Yn);
  var z = xyz2lab(
    (0.0193339 * red + 0.1191920 * green + 0.9503041 * blue) / Zn);

  var l = 116 * y - 16;
  var a = 500 * (x - y);
  var b = 200 * (y - z);

  var c = Math.sqrt(a * a + b * b);
  var h = Math.atan2(b, a);
  if (h < 0) {
    h += twoPi;
  }

  pixel[0] = h;
  pixel[1] = c;
  pixel[2] = l;

  return pixel;
}


/**
 * Convert an HCL pixel into an RGB pixel.
 * @param {Array<number>} pixel A pixel in HCL space.
 * @return {Array<number>} A pixel in RGB space.
 */
function hcl2rgb(pixel: [number, number, number]): [number, number, number] {
  var h = pixel[0];
  var c = pixel[1];
  var l = pixel[2];

  var a = Math.cos(h) * c;
  var b = Math.sin(h) * c;

  var y = (l + 16) / 116;
  var x = isNaN(a) ? y : y + a / 500;
  var z = isNaN(b) ? y : y - b / 200;

  y = Yn * lab2xyz(y);
  x = Xn * lab2xyz(x);
  z = Zn * lab2xyz(z);

  pixel[0] = xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
  pixel[1] = xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
  pixel[2] = xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

  return pixel;
}

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function rgb2xyz(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function xyz2rgb(x) {
  return 255 * (x <= 0.0031308 ?
    12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}
