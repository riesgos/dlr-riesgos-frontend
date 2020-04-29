import { Component, OnInit, Input, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ukis-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('ukis-title') title: string;
  // public color = 'white';

  constructor(
    public translator: TranslateService
  ) { }

  ngOnInit() {
  }

  // ngAfterContentChecked(): void {
  //   this.color = this.getRandomColor();
  // }

  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
