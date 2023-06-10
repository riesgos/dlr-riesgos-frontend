import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-translated-image',
  templateUrl: './translated-image.component.html',
  styleUrls: ['./translated-image.component.scss']
})
export class TranslatedImageComponent implements OnInit {
  
  image$!: Observable<string>;
  @Input() languageImageMap: {[lang: string]: string} = {};

  constructor(private translator: TranslationService) { }

  ngOnInit(): void {
    this.image$ = this.translator.getCurrentLang().pipe(
      map(lang => this.languageImageMap[lang])
    );
  }

}
