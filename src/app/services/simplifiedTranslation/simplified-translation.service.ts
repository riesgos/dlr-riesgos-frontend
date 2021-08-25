import { Injectable } from '@angular/core';
import { TranslateService, TranslateParser, LangChangeEvent } from '@ngx-translate/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UtilStoreService } from '@dlr-eoc/services-util-store';


export type RiesgosLang = 'EN' | 'ES';


@Injectable({
  providedIn: 'root'
})
export class SimplifiedTranslationService {

  private currentLang: BehaviorSubject<RiesgosLang> = new BehaviorSubject('ES');
  private dictEn: any;
  private dictEs: any;

  constructor(
    private translator: TranslateService,
    private translateParser: TranslateParser,
    private localStorage: UtilStoreService
  ) {
    this.translator.getTranslation('EN').subscribe(d => this.dictEn = d);
    this.translator.getTranslation('ES').subscribe(d => this.dictEs = d);
    this.translator.setDefaultLang('EN');

    const currentLang = this.localStorage.local('LANG');
    if (currentLang) {
      this.translator.use(currentLang);
    } else {
      this.setCurrentLang('ES');
    }
    this.translator.onLangChange.subscribe((lce: LangChangeEvent) => {
      this.currentLang.next(lce.lang as RiesgosLang);
    });
  }

  public getCurrentLang(): Observable<RiesgosLang> {
    return this.currentLang;
  }

  public getCurrentLangSync(): RiesgosLang {
    return this.currentLang.value;
  }

  public getLangs(): RiesgosLang[] {
    return ['ES', 'EN'];
  }

  public setCurrentLang(lang: RiesgosLang): void {
    this.localStorage.local('LANG', lang);
    this.translator.use(lang);
  }

  public syncTranslate(text: string): string {
    const dict = this.getDict();
    let translation = text;
    if (text.includes('{{') && text.includes('}}')) {
      translation = this.translateParser.interpolate(text, dict);
    } else {
      translation = this.translator.instant(text, dict);
    }
    return translation;
  }

  private getDict(): Object {
    switch (this.currentLang.value) {
      case 'EN':
        return this.dictEn;
      case 'ES':
        return this.dictEs;
      default:
        const defaultLang = this.translator.getDefaultLang();
        if (defaultLang === 'EN') {
          return this.dictEn;
        } else {
          return this.dictEs;
        }
    }
  }
}
