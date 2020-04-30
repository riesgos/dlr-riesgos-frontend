import { Component, OnInit, Input, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ukis-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('ukis-title') title: string;

  constructor(
    public translator: TranslateService
  ) { }

  ngOnInit() {
  }

}
