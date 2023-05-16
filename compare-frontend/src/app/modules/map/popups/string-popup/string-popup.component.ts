import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-string-popup',
  templateUrl: './string-popup.component.html',
  styleUrls: ['./string-popup.component.css']
})
export class StringPopupComponent {

  @Input() title?: string;
  @Input() subTitle?: string;
  @Input() body?: string;

}
