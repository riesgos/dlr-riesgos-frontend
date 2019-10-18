import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripnumbers'
})
export class StripnumbersPipe implements PipeTransform {

  transform(inputString: string): string {
    const parts = inputString.split(/(_|\s|\d|\.)/);
    const goodParts = parts.filter(p => isNaN(+p) && p !== ' ' && p !== '_' && p !== '.');
    return goodParts.join(' ');
  }

}
