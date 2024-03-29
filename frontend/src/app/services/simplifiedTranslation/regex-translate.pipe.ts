import { Pipe, PipeTransform } from '@angular/core';


interface dictEntry {
  regex: RegExp;
  transform: (matches: RegExpMatchArray) => string;
}


@Pipe({
  name: 'regexTranslate'
})
export class RegexTranslatePipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {
    return regexTransform(value);
  }

}


export function regexTransform(text: string): string {
  for (const entry of dictionary) {
    const matches = text.match(entry.regex);
    if (matches) {
      return entry.transform(matches);
    }
  }
  return text;
}

const dictionary: dictEntry[] = [{
  regex: /^quakeml:quakeledger\/([\d]*)$/,
  transform: (matches: RegExpMatchArray) => {
    const id = matches[1];
    return 'EQ ' + id;
  }
}, {
  regex: /^quakeml:quakeledger\/peru_([\d]*)$/,
  transform: (matches: RegExpMatchArray) => {
    const id = matches[1];
    return 'EQ ' + id;
  }
}, {
  regex: /^N52:primary([\d_]*)/,
  transform: (matches: RegExpMatchArray) => {
    const id = matches[1];
    return id ? 'GMF-' + id : 'GMF';
  }
}, {
  regex: /^riesgos:primary([\d_]*)_(pga|sa03|sa10)/,
  transform: (matches: RegExpMatchArray) => {
    const id = matches[1];
    const type = matches[2];
    return type ? type : 'GMF';
  }
}, {
  regex: /^[\d_]*_(arrivalTimes|epiCenter|mwhLand_global|mwhLand_local|mwh)$/,
  transform: (matches: RegExpMatchArray) => {
    return matches[1];
  }
}, {
  regex: /^(wd_max|v_atwdmax|duration)_vei\d/,
  transform: (matches: RegExpMatchArray) => {
    return matches[1];
  }
}, {
  regex: /^Lahar_[NS]_VEI\d\dmio_(maxheight|deposition|maxerosion|maxpressure|maxvelocity)/,
  transform: (matches: RegExpMatchArray) => {
    return 'Lahar_' + matches[1];
  }
}];