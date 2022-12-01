import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SimplifiedTranslationService } from 'src/app/services/simplifiedTranslation/simplified-translation.service';

@Component({
  selector: 'app-translated-image',
  templateUrl: './translated-image.component.html',
  styleUrls: ['./translated-image.component.scss']
})
export class TranslatedImageComponent implements OnInit {
  
  image$: Observable<string>;
  @Input() languageImageMap: {[lang: string]: string} = {};

  constructor(private translator: SimplifiedTranslationService) { }

  ngOnInit(): void {
    this.image$ = this.translator.currentLang.pipe(
      map(currentLang => this.languageImageMap[currentLang])
    )
  }

}
