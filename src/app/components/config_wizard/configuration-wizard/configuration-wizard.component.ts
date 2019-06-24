import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { WpsProcess } from 'src/app/wps/control/wpsProcess';
import { processes } from 'src/app/wps/processes';



@Component({
  selector: 'ukis-configuration-wizard',
  templateUrl: './configuration-wizard.component.html',
  styleUrls: ['./configuration-wizard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationWizardComponent implements OnInit {

  processes: WpsProcess[];
  private focussedPageId: BehaviorSubject<string>; // @TODO: store.get(focussedPage)

  constructor() {
    this.processes = processes;
  }
  
  ngOnInit() {
  }

  onBlockClicked(event, i) {
    const focussedProcess = this.processes[i];
    // @TODO: store.emmit(new ProcessFocussed(process))
  }

  hasFocus(process: WpsProcess): Observable<boolean> {

  }
}
