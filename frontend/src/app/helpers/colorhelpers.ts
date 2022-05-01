import { hslToRgb } from '@cds/core/internal';
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

export function greenVioletRangeStepwise(startVal: number, endVal: number, currentVal: number): [number, number, number] {
  const degree = (currentVal - startVal) / (endVal - startVal);
  const rgb = scaleInterpolation(violetGreenScale2, 1.0 - degree, false);
  return rgb;
}

export function greenRedRangeStepwise(startVal: number, endVal: number, currentVal: number): [number, number, number] {
  const degree = (currentVal - startVal) / (endVal - startVal);
  const rgb = scaleInterpolation(redGreenScale2, 1.0 - degree, false);
  return rgb;
}

export function greenRedRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
    // let hue = linInterpolateXY(startVal, -30, endVal, 110, currentVal);
    // if (hue < 0) {hue = 360 + hue; }
    // const rgb = HSVtoRGB({h: hue / 360, s: 1, v: 1});
    // return [rgb.r, rgb.g, rgb.b];
    const degree = (currentVal - startVal) / (endVal - startVal);
    const rgb = scaleInterpolation(redGreenScale2, 1.0 - degree);
    return rgb;
}

export function redGreenRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
    // let hue = linInterpolateXY(startVal, 110, endVal, -30, currentVal);
    // if (hue < 0) {hue = 360 + hue; }
    // const rgb = HSVtoRGB({h: hue / 360, s: 1, v: 1});
    // return [rgb.r, rgb.g, rgb.b];
    const degree = (currentVal - startVal) / (endVal - startVal);
    const rgb = scaleInterpolation(redGreenScale2, degree);
    return rgb;
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

export const redGreenScale: Scale = {
  0.1: [215, 25, 28],
  0.3: [253, 174, 97],
  0.5: [255, 255, 191],
  0.7: [166, 217, 106],
  0.9: [26, 150, 65],
};

export const redGreenScale2: Scale = {
  0.1: [213, 62, 79],
  0.3: [252, 141, 89],
  0.5: [254, 224, 139],
  0.7: [230, 245, 152],
  0.9: [153, 213, 148],
};

export const violetGreenScale2: Scale = {
  0.2: [184, 53, 131],
  0.35: [213, 62, 79],
  0.5: [252, 141, 89],
  0.7: [254, 224, 139],
  0.8: [230, 245, 152],
  0.9: [153, 213, 148],
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




const rainbowColors = ["#6e40aa","#7140ab","#743fac","#773fad","#7a3fae","#7d3faf","#803eb0","#833eb0","#873eb1","#8a3eb2","#8d3eb2","#903db2","#943db3","#973db3","#9a3db3","#9d3db3","#a13db3","#a43db3","#a73cb3","#aa3cb2","#ae3cb2","#b13cb2","#b43cb1","#b73cb0","#ba3cb0","#be3caf","#c13dae","#c43dad","#c73dac","#ca3dab","#cd3daa","#d03ea9","#d33ea7","#d53ea6","#d83fa4","#db3fa3","#de3fa1","#e040a0","#e3409e","#e5419c","#e8429a","#ea4298","#ed4396","#ef4494","#f14592","#f34590","#f5468e","#f7478c","#f9488a","#fb4987","#fd4a85","#fe4b83","#ff4d80","#ff4e7e","#ff4f7b","#ff5079","#ff5276","#ff5374","#ff5572","#ff566f","#ff586d","#ff596a","#ff5b68","#ff5d65","#ff5e63","#ff6060","#ff625e","#ff645b","#ff6659","#ff6857","#ff6a54","#ff6c52","#ff6e50","#ff704e","#ff724c","#ff744a","#ff7648","#ff7946","#ff7b44","#ff7d42","#ff8040","#ff823e","#ff843d","#ff873b","#ff893a","#ff8c38","#ff8e37","#fe9136","#fd9334","#fb9633","#f99832","#f89b32","#f69d31","#f4a030","#f2a32f","#f0a52f","#eea82f","#ecaa2e","#eaad2e","#e8b02e","#e6b22e","#e4b52e","#e2b72f","#e0ba2f","#debc30","#dbbf30","#d9c131","#d7c432","#d5c633","#d3c934","#d1cb35","#cece36","#ccd038","#cad239","#c8d53b","#c6d73c","#c4d93e","#c2db40","#c0dd42","#bee044","#bce247","#bae449","#b8e64b","#b6e84e","#b5ea51","#b3eb53","#b1ed56","#b0ef59","#adf05a","#aaf159","#a6f159","#a2f258","#9ef258","#9af357","#96f357","#93f457","#8ff457","#8bf457","#87f557","#83f557","#80f558","#7cf658","#78f659","#74f65a","#71f65b","#6df65c","#6af75d","#66f75e","#63f75f","#5ff761","#5cf662","#59f664","#55f665","#52f667","#4ff669","#4cf56a","#49f56c","#46f46e","#43f470","#41f373","#3ef375","#3bf277","#39f279","#37f17c","#34f07e","#32ef80","#30ee83","#2eed85","#2cec88","#2aeb8a","#28ea8d","#27e98f","#25e892","#24e795","#22e597","#21e49a","#20e29d","#1fe19f","#1edfa2","#1ddea4","#1cdca7","#1bdbaa","#1bd9ac","#1ad7af","#1ad5b1","#1ad4b4","#19d2b6","#19d0b8","#19cebb","#19ccbd","#19cabf","#1ac8c1","#1ac6c4","#1ac4c6","#1bc2c8","#1bbfca","#1cbdcc","#1dbbcd","#1db9cf","#1eb6d1","#1fb4d2","#20b2d4","#21afd5","#22add7","#23abd8","#25a8d9","#26a6db","#27a4dc","#29a1dd","#2a9fdd","#2b9cde","#2d9adf","#2e98e0","#3095e0","#3293e1","#3390e1","#358ee1","#378ce1","#3889e1","#3a87e1","#3c84e1","#3d82e1","#3f80e1","#417de0","#437be0","#4479df","#4676df","#4874de","#4a72dd","#4b70dc","#4d6ddb","#4f6bda","#5169d9","#5267d7","#5465d6","#5663d5","#5761d3","#595fd1","#5a5dd0","#5c5bce","#5d59cc","#5f57ca","#6055c8","#6153c6","#6351c4","#6450c2","#654ec0","#664cbe","#674abb","#6849b9","#6a47b7","#6a46b4","#6b44b2","#6c43af","#6d41ad","#6e40aa"];
// rainbowColors.sort((a, b) => Math.random() < 0.5 ? 1 : -1);
const rainbowColorsMixed = [ "#9af357", "#ff645b", "#4d6ddb", "#8a3eb2", "#3ef375", "#2cec88", "#fb4987", "#7140ab", "#9a3db3", "#417de0", "#21e49a", "#59f664", "#9d3db3", "#27a4dc", "#1fb4d2", "#1edfa2", "#74f65a", "#b8e64b", "#1bc2c8", "#a2f258", "#d1cb35", "#378ce1", "#d7c432", "#aa3cb2", "#19cabf", "#6e40aa", "#ff625e", "#25e892", "#be3caf", "#19d0b8", "#ff7d42", "#3f80e1", "#5267d7", "#1bd9ac", "#8bf457", "#ff6c52", "#20b2d4", "#1cdca7", "#3889e1", "#8ff457", "#2aeb8a", "#a73cb3", "#f0a52f", "#3293e1", "#6351c4", "#3095e0", "#6d41ad", "#803eb0", "#6b44b2", "#437be0", "#664cbe", "#5169d9", "#23abd8", "#ff704e", "#833eb0", "#7a3fae", "#674abb", "#2eed85", "#b6e84e", "#6c43af", "#973db3", "#8d3eb2", "#52f667", "#d53ea6", "#743fac", "#c13dae", "#873eb1", "#ff5572", "#ff8c38", "#e5419c", "#bee044", "#87f557", "#5ff761", "#2e98e0", "#96f357", "#f14592", "#903db2", "#4b70dc", "#943db3", "#f89b32", "#ff6060", "#ff596a", "#d03ea9", "#4479df", "#3bf277", "#a6f159", "#f69d31", "#eea82f", "#ff843d", "#e8429a", "#1bdbaa", "#f4a030", "#5761d3", "#a43db3", "#d33ea7", "#ff6a54", "#ff8040", "#24e795", "#6af75d", "#6055c8", "#ff7946", "#30ee83", "#1ad5b1", "#fe9136", "#e0ba2f", "#e040a0", "#63f75f", "#2a9fdd", "#e4b52e", "#39f279", "#1ac4c6", "#f34590", "#1dbbcd", "#b43cb1", "#1ddea4", "#ff7648", "#66f75e", "#ff5079", "#19cebb", "#5a5dd0", "#19ccbd", "#ff6659", "#21afd5", "#7d3faf", "#f7478c", "#1fe19f", "#37f17c", "#ff6857", "#6a46b4", "#6153c6", "#5d59cc", "#c0dd42", "#c73dac", "#1ac8c1", "#27e98f", "#1ad4b4", "#a13db3", "#26a6db", "#4ff669", "#4874de", "#b13cb2", "#773fad", "#bce247", "#cd3daa", "#4676df", "#2d9adf", "#4cf56a", "#55f665", "#f99832", "#34f07e", "#ff586d", "#ff823e", "#ef4494", "#ff566f", "#db3fa3", "#ff6e50", "#46f46e", "#ff7b44", "#5f57ca", "#6e40aa", "#4a72dd", "#25a8d9", "#4f6bda", "#ff724c", "#5663d5", "#ecaa2e", "#20e29d", "#5c5bce", "#5465d6", "#3a87e1", "#1ad7af", "#cece36", "#1bbfca", "#19d2b6", "#1ac6c4", "#6849b9", "#ff744a", "#1cbdcc", "#3d82e1", "#32ef80", "#f9488a", "#e6b22e", "#f5468e", "#1eb6d1", "#ae3cb2", "#eaad2e", "#80f558", "#28ea8d", "#78f659", "#5cf662", "#1db9cf", "#ff8e37", "#ff5e63", "#6a47b7", "#fe4b83", "#ff4f7b", "#fd9334", "#aaf159", "#3390e1", "#ff4e7e", "#ff5276", "#2b9cde", "#358ee1", "#43f470", "#3c84e1", "#c2db40", "#ca3dab", "#93f457", "#b0ef59", "#c8d53b", "#c43dad", "#654ec0", "#29a1dd", "#b5ea51", "#83f557", "#b3eb53", "#e3409e", "#c4d93e", "#22add7", "#6450c2", "#41f373", "#ccd038", "#ff5b68", "#9ef258", "#7cf658", "#49f56c", "#adf05a", "#ff893a", "#71f65b", "#6df65c", "#22e597", "#d3c934", "#595fd1", "#f2a32f", "#ff873b", "#cad239", "#fd4a85", "#ba3cb0", "#debc30", "#b73cb0", "#bae449", "#e8b02e", "#d83fa4", "#de3fa1", "#ff5d65", "#dbbf30", "#b1ed56", "#d9c131", "#e2b72f", "#ea4298", "#ff5374", "#ff4d80", "#ed4396", "#d5c633", "#c6d73c", "#fb9633" ];

function md5(inputString) {
    var hc="0123456789abcdef";
    function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
    function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
    function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x) {
        var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
        for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
        blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
    }
    var i,x=sb(inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
    for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
        a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
        b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
        c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
        d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
        a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
        b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
        c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
        d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
        a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
        b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
        c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
        d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
        a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
        b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
        c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
        d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
        a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
        b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
        c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
        d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
        a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
        b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
    }
    return rh(a)+rh(b)+rh(c)+rh(d);
}


function stringToInt(str: string): number {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function normalizeHash(h) {
    const m = 2147483647;
    return (h +  m) / (2 * m);
}

function nameToFloat(name) {
    const m = md5(name);
    const i = stringToInt(m);
    return normalizeHash(i);
}

export function getBuildingClassColorOld(name: string): string {
    const h = nameToFloat(name);
    const colorIndex = Math.floor(h * rainbowColorsMixed.length) % rainbowColorsMixed.length;
    const color = rainbowColorsMixed[colorIndex];
    return color;
}

const phi = 0.618;
const colorMapping = {};
export function getBuildingClassColor(name: string): string {
  if (name in colorMapping) {
    return colorMapping[name];
  }
  const n = Object.keys(colorMapping).length;
  const direction = (360 * phi * n) % 360;
  const colorHSL = d3color.hsl(direction, 0.7, 0.7);
  const colorRGB = colorHSL.rgb();
  const colorString = colorRGB.toString();
  colorMapping[name] = colorString;
  return colorString;
}