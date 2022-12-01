import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SimplifiedTranslationService } from 'src/app/services/simplifiedTranslation/simplified-translation.service';

@Component({
  selector: 'app-translatable-string',
  templateUrl: './translatable-string.component.html',
  styleUrls: ['./translatable-string.component.scss']
})
export class TranslatableStringComponent implements OnInit {

  @Input() text: string;
  text$: Observable<string>;

  constructor(private translator: SimplifiedTranslationService) {}

  ngOnInit(): void {
    this.text$ = this.translator.getCurrentLang().pipe(map((l) => {
      return this.translator.syncTranslate(this.text);
    }));
  }

}
