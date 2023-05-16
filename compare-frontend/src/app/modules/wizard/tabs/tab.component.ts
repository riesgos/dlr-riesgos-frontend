/**
 * A single tab page. It renders the passed template
 * via the @Input properties by using the ngTemplateOutlet
 * and ngTemplateOutletContext directives.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  styleUrls: ['./tab.component.css'],
  templateUrl: './tab.component.html'
})
export class TabComponent {
  @Input('tabTitle') title: string = '';
  @Input() active = false;
}
