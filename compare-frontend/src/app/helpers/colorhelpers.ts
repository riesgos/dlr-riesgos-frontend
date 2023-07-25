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


export function fraction(val: number, start: number, end: number, minDistance = 0.0000001): number {
  if (Math.abs(end - start) < minDistance) {
    console.warn(`Trying to calculate a fraction with start- and end-point very close to each other: ${end} - ${start} = ${end - start}`);
    return 0.0; // by l'Hospital
  }
  return (val - start) / (end - start);
}

export function greenYellowRedRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
  const halfwayPoint = startVal + ((endVal - startVal) / 2);
  if (currentVal < halfwayPoint) {
    const degree = fraction(currentVal, startVal, halfwayPoint);
    return [degree * 255, 255, 0];
  } else {
    const degree = fraction(currentVal, halfwayPoint, endVal);
    return [255, (1 - degree) * 255, 0];
  }
}

export function greenVioletRangeStepwise(startVal: number, endVal: number, currentVal: number): [number, number, number] {
  const degree = fraction(currentVal, startVal, endVal);
  const rgb = scaleInterpolation(violetGreenScale2, 1.0 - degree, false);
  return rgb;
}

export function greenRedRangeStepwise(startVal: number, endVal: number, currentVal: number): [number, number, number] {
  const degree = fraction(currentVal, startVal, endVal);
  const rgb = scaleInterpolation(redGreenScale2, 1.0 - degree, false);
  return rgb;
}

export function greenRedRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
    const degree = fraction(currentVal, startVal, endVal);
    const rgb = scaleInterpolation(redGreenScale2, 1.0 - degree);
    return rgb;
}

export function redGreenRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
    const degree = fraction(currentVal, startVal, endVal);
    const rgb = scaleInterpolation(redGreenScale2, degree);
    return rgb;
}

export function yellowBlueRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
  const degree = fraction(currentVal, startVal, endVal);
  const rgb = scaleInterpolation(yellowBlueScale, degree);
  return rgb;
}

export function yellowPurpleRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
  const degree = fraction(currentVal, startVal, endVal);
  const rgb = scaleInterpolation(yellowPurpleScale, degree);
  return rgb;
}

export function yellowRedRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
  const degree = fraction(currentVal, startVal, endVal);
  const rgb = scaleInterpolation(yellowRedScale, degree);
  return rgb;
}

export function exposureDamageRange(startVal: number, endVal: number, currentVal: number): [number, number, number] {
  const degree = fraction(currentVal, startVal, endVal);
  const rgb = scaleInterpolation(exposureDamageScale, degree);
  return rgb;
}

export interface Scale {
  [key: string]: [number, number, number];
}

export const exposureDamageScale: Scale = {
  0.0: [125, 125, 125],
  0.24: [236, 234, 197],
  0.49: [218, 179, 155],
  0.74: [195, 139, 136],
  0.99: [163, 125, 137]
};

export const yellowRedScale: Scale = {
  0.0: [254,240,217],
  0.25: [253,204,138],
  0.5: [252,141,89],
  0.75: [227,74,51],
  1.0: [179,0,0]
};


export const yellowPurpleScale: Scale = {
  0.1: [254,235,226],
  0.3: [251,180,185],
  0.5: [247,104,161],
  0.7: [197,27,138],
  0.9: [122,1,119]
};


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
  const keys = Object.keys(scale).map(k => +k).sort();  // js-objects dont keep the ordering of numeric keys as they were entered. instead it goes: integers, strings, decimals, each group sorted by first appearance, not value.
  const colors = keys.map(k => scale[k]);
  const nrKeys =  keys.length;
  if (value < keys[0]) {
    return colors[0];
  }
  for (let i = 0; i < nrKeys; i++) { 
    const startKey = keys[i];
    const endKey = keys[i+1];
    if (startKey <= value && value < endKey) {
      if (!smooth) {
        return colors[i];
      }
      const degree = fraction(value, startKey, endKey);
      const startColorRGB = colors[i];
      const endColorRGB = colors[i+1];
      const startColorHSL = d3color.hsl(d3color.rgb(... startColorRGB));
      const endColorHSL = d3color.hsl(d3color.rgb(... endColorRGB));
      const h = linInterpolate(startColorHSL.h, endColorHSL.h, degree);
      const s = linInterpolate(startColorHSL.s, endColorHSL.s, degree);
      const l = linInterpolate(startColorHSL.l, endColorHSL.l, degree);
      const rgb = d3color.rgb(d3color.hsl(h, s, l));
      return [Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)];
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

  const counts: { [key: number]: number } = {};
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

  return out;
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
    const degree = fraction(currentX, startX, endX);
    const degreeClamped = Math.max(Math.min(degree, 1), 0);
    const y = degreeClamped * (endY - startY) + startY;
    return y;
}

export function linInterpolate(startVal: number, endVal: number, degree: number): number {
    const degreeClamped = Math.max(Math.min(degree, 1), 0);
    const interpolated = degreeClamped * (endVal - startVal) + startVal;
    return interpolated;
}



export function HSVtoRGB(hsv: {h: number, s: number, v: number}): {r: number, g: number, b: number} {
    const s = hsv.s;
    const v = hsv.v;
    const h = hsv.h;

    let r = 0;
    let g = 0;
    let b = 0;
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




const rainbowColors = ["#6e40aa","#7140ab","#743fac","#773fad","#7a3fae","#7d3faf","#803eb0","#833eb0","#873eb1","#8a3eb2","#8d3eb2","#903db2","#943db3","#973db3","#9a3db3","#9d3db3","#a13db3","#a43db3","#a73cb3","#aa3cb2","#ae3cb2","#b13cb2","#b43cb1","#b73cb0","#ba3cb0","#be3caf","#c13dae","#c43dad","#c73dac","#ca3dab","#cd3daa","#d03ea9","#d33ea7","#d53ea6","#d83fa4","#db3fa3","#de3fa1","#e040a0","#e3409e","#e5419c","#e8429a","#ea4298","#ed4396","#ef4494","#f14592","#f34590","#f5468e","#f7478c","#f9488a","#fb4987","#fd4a85","#fe4b83","#ff4d80","#ff4e7e","#ff4f7b","#ff5079","#ff5276","#ff5374","#ff5572","#ff566f","#ff586d","#ff596a","#ff5b68","#ff5d65","#ff5e63","#ff6060","#ff625e","#ff645b","#ff6659","#ff6857","#ff6a54","#ff6c52","#ff6e50","#ff704e","#ff724c","#ff744a","#ff7648","#ff7946","#ff7b44","#ff7d42","#ff8040","#ff823e","#ff843d","#ff873b","#ff893a","#ff8c38","#ff8e37","#fe9136","#fd9334","#fb9633","#f99832","#f89b32","#f69d31","#f4a030","#f2a32f","#f0a52f","#eea82f","#ecaa2e","#eaad2e","#e8b02e","#e6b22e","#e4b52e","#e2b72f","#e0ba2f","#debc30","#dbbf30","#d9c131","#d7c432","#d5c633","#d3c934","#d1cb35","#cece36","#ccd038","#cad239","#c8d53b","#c6d73c","#c4d93e","#c2db40","#c0dd42","#bee044","#bce247","#bae449","#b8e64b","#b6e84e","#b5ea51","#b3eb53","#b1ed56","#b0ef59","#adf05a","#aaf159","#a6f159","#a2f258","#9ef258","#9af357","#96f357","#93f457","#8ff457","#8bf457","#87f557","#83f557","#80f558","#7cf658","#78f659","#74f65a","#71f65b","#6df65c","#6af75d","#66f75e","#63f75f","#5ff761","#5cf662","#59f664","#55f665","#52f667","#4ff669","#4cf56a","#49f56c","#46f46e","#43f470","#41f373","#3ef375","#3bf277","#39f279","#37f17c","#34f07e","#32ef80","#30ee83","#2eed85","#2cec88","#2aeb8a","#28ea8d","#27e98f","#25e892","#24e795","#22e597","#21e49a","#20e29d","#1fe19f","#1edfa2","#1ddea4","#1cdca7","#1bdbaa","#1bd9ac","#1ad7af","#1ad5b1","#1ad4b4","#19d2b6","#19d0b8","#19cebb","#19ccbd","#19cabf","#1ac8c1","#1ac6c4","#1ac4c6","#1bc2c8","#1bbfca","#1cbdcc","#1dbbcd","#1db9cf","#1eb6d1","#1fb4d2","#20b2d4","#21afd5","#22add7","#23abd8","#25a8d9","#26a6db","#27a4dc","#29a1dd","#2a9fdd","#2b9cde","#2d9adf","#2e98e0","#3095e0","#3293e1","#3390e1","#358ee1","#378ce1","#3889e1","#3a87e1","#3c84e1","#3d82e1","#3f80e1","#417de0","#437be0","#4479df","#4676df","#4874de","#4a72dd","#4b70dc","#4d6ddb","#4f6bda","#5169d9","#5267d7","#5465d6","#5663d5","#5761d3","#595fd1","#5a5dd0","#5c5bce","#5d59cc","#5f57ca","#6055c8","#6153c6","#6351c4","#6450c2","#654ec0","#664cbe","#674abb","#6849b9","#6a47b7","#6a46b4","#6b44b2","#6c43af","#6d41ad","#6e40aa"];
// rainbowColors.sort((a, b) => Math.random() < 0.5 ? 1 : -1);
const rainbowColorsMixed = [ "#9af357", "#ff645b", "#4d6ddb", "#8a3eb2", "#3ef375", "#2cec88", "#fb4987", "#7140ab", "#9a3db3", "#417de0", "#21e49a", "#59f664", "#9d3db3", "#27a4dc", "#1fb4d2", "#1edfa2", "#74f65a", "#b8e64b", "#1bc2c8", "#a2f258", "#d1cb35", "#378ce1", "#d7c432", "#aa3cb2", "#19cabf", "#6e40aa", "#ff625e", "#25e892", "#be3caf", "#19d0b8", "#ff7d42", "#3f80e1", "#5267d7", "#1bd9ac", "#8bf457", "#ff6c52", "#20b2d4", "#1cdca7", "#3889e1", "#8ff457", "#2aeb8a", "#a73cb3", "#f0a52f", "#3293e1", "#6351c4", "#3095e0", "#6d41ad", "#803eb0", "#6b44b2", "#437be0", "#664cbe", "#5169d9", "#23abd8", "#ff704e", "#833eb0", "#7a3fae", "#674abb", "#2eed85", "#b6e84e", "#6c43af", "#973db3", "#8d3eb2", "#52f667", "#d53ea6", "#743fac", "#c13dae", "#873eb1", "#ff5572", "#ff8c38", "#e5419c", "#bee044", "#87f557", "#5ff761", "#2e98e0", "#96f357", "#f14592", "#903db2", "#4b70dc", "#943db3", "#f89b32", "#ff6060", "#ff596a", "#d03ea9", "#4479df", "#3bf277", "#a6f159", "#f69d31", "#eea82f", "#ff843d", "#e8429a", "#1bdbaa", "#f4a030", "#5761d3", "#a43db3", "#d33ea7", "#ff6a54", "#ff8040", "#24e795", "#6af75d", "#6055c8", "#ff7946", "#30ee83", "#1ad5b1", "#fe9136", "#e0ba2f", "#e040a0", "#63f75f", "#2a9fdd", "#e4b52e", "#39f279", "#1ac4c6", "#f34590", "#1dbbcd", "#b43cb1", "#1ddea4", "#ff7648", "#66f75e", "#ff5079", "#19cebb", "#5a5dd0", "#19ccbd", "#ff6659", "#21afd5", "#7d3faf", "#f7478c", "#1fe19f", "#37f17c", "#ff6857", "#6a46b4", "#6153c6", "#5d59cc", "#c0dd42", "#c73dac", "#1ac8c1", "#27e98f", "#1ad4b4", "#a13db3", "#26a6db", "#4ff669", "#4874de", "#b13cb2", "#773fad", "#bce247", "#cd3daa", "#4676df", "#2d9adf", "#4cf56a", "#55f665", "#f99832", "#34f07e", "#ff586d", "#ff823e", "#ef4494", "#ff566f", "#db3fa3", "#ff6e50", "#46f46e", "#ff7b44", "#5f57ca", "#6e40aa", "#4a72dd", "#25a8d9", "#4f6bda", "#ff724c", "#5663d5", "#ecaa2e", "#20e29d", "#5c5bce", "#5465d6", "#3a87e1", "#1ad7af", "#cece36", "#1bbfca", "#19d2b6", "#1ac6c4", "#6849b9", "#ff744a", "#1cbdcc", "#3d82e1", "#32ef80", "#f9488a", "#e6b22e", "#f5468e", "#1eb6d1", "#ae3cb2", "#eaad2e", "#80f558", "#28ea8d", "#78f659", "#5cf662", "#1db9cf", "#ff8e37", "#ff5e63", "#6a47b7", "#fe4b83", "#ff4f7b", "#fd9334", "#aaf159", "#3390e1", "#ff4e7e", "#ff5276", "#2b9cde", "#358ee1", "#43f470", "#3c84e1", "#c2db40", "#ca3dab", "#93f457", "#b0ef59", "#c8d53b", "#c43dad", "#654ec0", "#29a1dd", "#b5ea51", "#83f557", "#b3eb53", "#e3409e", "#c4d93e", "#22add7", "#6450c2", "#41f373", "#ccd038", "#ff5b68", "#9ef258", "#7cf658", "#49f56c", "#adf05a", "#ff893a", "#71f65b", "#6df65c", "#22e597", "#d3c934", "#595fd1", "#f2a32f", "#ff873b", "#cad239", "#fd4a85", "#ba3cb0", "#debc30", "#b73cb0", "#bae449", "#e8b02e", "#d83fa4", "#de3fa1", "#ff5d65", "#dbbf30", "#b1ed56", "#d9c131", "#e2b72f", "#ea4298", "#ff5374", "#ff4d80", "#ed4396", "#d5c633", "#c6d73c", "#fb9633" ];

const phi = 0.618;
const colorMapping: {[key: string]: string} = {};
export function getBuildingClassColor(name: string): string {
  if (name in colorMapping) {
    return colorMapping[name];
  }
  const n = Object.keys(colorMapping).length;
  const direction = (360 * phi * n) % 360;
  const colorHSL = d3color.hsl(direction, 0.3, 0.6);
  const colorRGB = colorHSL.rgb();
  const colorString = colorRGB.toString();
  colorMapping[name] = colorString;
  return colorString;
}