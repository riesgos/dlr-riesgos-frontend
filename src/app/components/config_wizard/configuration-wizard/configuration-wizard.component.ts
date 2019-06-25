import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { NewProcessClicked } from 'src/app/focus/focus.actions';
import { getFocussedProcess } from 'src/app/focus/focus.selectors';
import { map } from 'rxjs/operators';
import { Process, ProcessState, ProcessId } from 'src/app/wps/control/process';
import { WpsConfigurationProvider, ProcessDescription } from 'src/app/wps/configuration/configurationProvider';
import { getProcessStates } from 'src/app/wps/control/wps.selectors';



@Component({
    selector: 'ukis-configuration-wizard',
    templateUrl: './configuration-wizard.component.html',
    styleUrls: ['./configuration-wizard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfigurationWizardComponent implements OnInit {


    private focussedPageId$: Observable<string>;
    private processStates$: Observable<Map<ProcessId, ProcessState>>;
    processes: ProcessDescription[];

    constructor(
        private store: Store<State>, 
        configProvider: WpsConfigurationProvider    
    ) {

        this.processes = configProvider.getConfiguration();

        this.processStates$ = this.store.pipe(
            select(getProcessStates)
        );

        this.focussedPageId$ = this.store.pipe(
            select(getFocussedProcess),
            map(proc => proc.id)
        );
    }

    ngOnInit() {
    }

    getState(process: ProcessDescription): Observable<ProcessState> {
        return this.processStates$.pipe(
            map(states => states.get(process.id))
        )
    }

    onBlockClicked(event, process: Process) {
        this.store.dispatch(new NewProcessClicked({process: process}));
    }

    hasFocus(process: Process): Observable<boolean> {
        return this.focussedPageId$.pipe(
            map(id => id == process.id)
        );
    }
}
