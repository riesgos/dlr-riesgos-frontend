import { Component, OnInit } from '@angular/core';
import { SimplifiedTranslationService, RiesgosLang } from 'src/app/services/simplifiedTranslation/simplified-translation.service';

@Component({
  selector: 'ukis-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {


  constructor(
    public translator: SimplifiedTranslationService
  ) {}

  ngOnInit() {
  }

  setLanguage(lang: RiesgosLang): void {
    this.translator.setCurrentLang(lang);
  }

}
