import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ukis-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {


  constructor(
    public translator: TranslateService
  ) {
    this.translator.setDefaultLang('EN');
    this.translator.getTranslation('ES');
    this.translator.use('ES');
  }

  ngOnInit() {
  }

  setLanguage(lang: string): void {
    this.translator.use(lang);
  }

}
