import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input('ukis-title') title: string;
  @Input('ukis-version') version: string;

  constructor(
    public translator: TranslateService
  ) { }

  ngOnInit() {}

}
