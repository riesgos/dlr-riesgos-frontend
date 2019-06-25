import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { Process } from 'src/app/wps/control/workflowcontrol';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getProcesses } from 'src/app/wps/control/wps.selectors';



@Component({
  selector: 'ukis-configuration-wizard',
  templateUrl: './configuration-wizard.component.html',
  styleUrls: ['./configuration-wizard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationWizardComponent implements OnInit {

  processes$: Observable<Process[]>;
  private focussedPageId: Observable<string>; // @TODO: store.get(focussedPage)

  constructor(private store: Store<State>) {
    this.processes$ = this.store.pipe(
      select(getProcesses)
    );
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
