import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../services/translation.service';


@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private ts: TranslationService) {}

  transform(value: string, ...args: any[]): string {
    return this.ts.syncTranslate(value);
  }

}
