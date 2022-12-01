import { Pipe, PipeTransform } from '@angular/core';
import { SimplifiedTranslationService } from './simplified-translation.service';


@Pipe({
  name: 'sTranslate'
})
export class SimpleTranslatePipe implements PipeTransform {

  constructor(private sts: SimplifiedTranslationService) {}

  transform(value: string, ...args: any[]): string {
    return this.sts.syncTranslate(value);
  }

}
