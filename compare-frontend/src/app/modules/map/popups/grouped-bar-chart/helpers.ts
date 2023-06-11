import { interpolateSinebow } from 'd3-scale-chromatic';
import { ColoringFunction, GroupingFunction, SubGroupData } from './groupedChart';

function inArray(val: any, arr: any[]) {
    for (const a of arr) {
        if (a === val) {
            return true;
        }
    }
    return false;
}

export function unique(data: any[]) {
    const uniques = [];
    for (const entry of data) {
        if (!inArray(entry, uniques)) {
            uniques.push(entry);
        }
    }
    return uniques;
}

export function createGrouping(subSection: number) {

    const grouping: GroupingFunction = (subGroups: SubGroupData[]): SubGroupData[] => {
        const newKeys = unique(subGroups.map(sg => sg.key).map(key => key.split('-')[subSection]).filter(k => k !== undefined));
        const newSubGroups: SubGroupData[] = newKeys.map(k => ({ key: k, val: 0 }));
        for (const oldSubGroup of subGroups) {
            const key = oldSubGroup.key.split('-')[subSection];
            if (key) {
                const newSubGroup = newSubGroups.find(sg => sg.key === key);
                if (newSubGroup) newSubGroup.val += oldSubGroup.val;
            }
        }
        return newSubGroups;
    }

    return grouping;
}


export function simpleGrouping(subGroups: SubGroupData[]): SubGroupData[] {
    return subGroups;
}



export const randomColoring: ColoringFunction = (key: string) => `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

export const defaultColoring: ColoringFunction = (key: string) => {
  let numberString = ''
  for (const letter of key) {
    if (letter !== '-' && letter !== '_') {
      let stringCode = letter.toLowerCase().charCodeAt(0) + '';
      if (stringCode.length === 2) stringCode = '0' + stringCode;
      numberString += stringCode;
    }
  }
  const val = +numberString / 1000000;
  return interpolateSinebow(val);
};