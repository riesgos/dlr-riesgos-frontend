import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { Process } from 'src/app/wps/control/workflowcontrol';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';



@Component({
  selector: 'ukis-configuration-wizard',
  templateUrl: './configuration-wizard.component.html',
  styleUrls: ['./configuration-wizard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationWizardComponent implements OnInit {

  processes: Process[];
  private focussedPageId: BehaviorSubject<string>; // @TODO: store.get(focussedPage)

  constructor(private store: Store<State>) {
    this.processes = processProvider.processes;
  }
  
  ngOnInit() {
  }

  onBlockClicked(event, i) {
    const focussedProcess = this.processes[i];
    // @TODO: store.emmit(new ProcessFocussed(process))
  }

  hasFocus(process: Process): Observable<boolean> {

  }
}
