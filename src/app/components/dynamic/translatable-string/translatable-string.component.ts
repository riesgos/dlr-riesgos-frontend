import { Component, OnInit, Input } from '@angular/core';
import { SimplifiedTranslationService } from 'src/app/services/simplifiedTranslation/simplified-translation.service';

@Component({
  selector: 'app-translatable-string',
  templateUrl: './translatable-string.component.html',
  styleUrls: ['./translatable-string.component.scss']
})
export class TranslatableStringComponent implements OnInit {

  @Input() text: string;

  constructor(private translator: SimplifiedTranslationService) {}

  ngOnInit(): void {
    this.text = this.translator.syncTranslate(this.text);
    this.translator.getCurrentLang().subscribe(lang => {
      this.text = this.translator.syncTranslate(this.text);
    });
  }

}
