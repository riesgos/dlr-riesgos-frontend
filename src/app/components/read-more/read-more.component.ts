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
  isExpanded = false;
  isExpandable = false;

  constructor() { }

  ngOnInit() {
    if (!this.text) {
      this.text = '';
    }
    const words = this.text.split(' ');
    this.isExpandable = (words.length > this.threshold);
    if (!this.isExpandable) {
      this.isExpanded = true;
    }
    const wordsShort = words.slice(0, Math.min(this.threshold, words.length));
    this.shortText = wordsShort.join(' ');
  }

}
