import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements OnInit {

  @Input() text: string;
  @Input() threshold: number;
  shortText: string;
  fullText: string;
  isExpanded = false;
  exceedsThreshold = false;

  constructor(
    private translator: TranslateService
  ) { }

  ngOnInit() {
    if (!this.text) {
      this.text = '';
    }

    this.setText(this.text);

    this.translator.onLangChange.subscribe(() => {
      this.setText(this.text);
    });
  }

  private setText(text: string): void {
    if (text) {
      const translatedText = this.translator.instant(text);

      this.fullText = translatedText;

      const words = translatedText.split(' ');
      this.exceedsThreshold = (words.length > this.threshold);
      if (!this.exceedsThreshold) {
        this.isExpanded = true;
      }
      const wordsShort = words.slice(0, Math.min(this.threshold, words.length));
      this.shortText = wordsShort.join(' ');
    } else {
      this.fullText = '';
      this.shortText = '';
      this.exceedsThreshold = false;
      this.isExpanded = true;
    }
  }

}
