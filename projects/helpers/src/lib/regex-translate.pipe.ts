import { Pipe, PipeTransform } from '@angular/core';


interface dictEntry {
  regex: RegExp;
  transform: (matches: RegExpMatchArray) => string;
}


@Pipe({
  name: 'regexTranslate'
})
export class RegexTranslatePipe implements PipeTransform {

  private dictionary: dictEntry[] = [{
    regex: /^quakeml:quakeledger\/([\d]*)$/,
    transform: (matches: RegExpMatchArray) => {
      const id = matches[1];
      return 'EQ ' + id;
    }
  }, {
    regex: /^N52:primary[\d_]*/,
    transform: (matches: RegExpMatchArray) => {
      return 'shakemap';
    }
  }];

  transform(value: string, ...args: any[]): string {
    for (const entry of this.dictionary) {
      const matches = value.match(entry.regex);
      if (matches) {
        return entry.transform(matches);
      }
    }
    return value;
  }

}
