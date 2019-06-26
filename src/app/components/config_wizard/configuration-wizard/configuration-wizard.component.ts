import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { NewProcessClicked } from 'src/app/focus/focus.actions';
import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { map } from 'rxjs/operators';
import { getProcessStates } from 'src/app/wps/control/wps.selectors';
import { Process } from 'src/app/wps/control/wps.datatypes';



@Component({
    selector: 'ukis-configuration-wizard',
    templateUrl: './configuration-wizard.component.html',
    styleUrls: ['./configuration-wizard.component.scss'],
    encapsulation: ViewEncapsulation.None, 
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationWizardComponent implements OnInit {


    private focussedPageId$: Observable<string>;
    private processes$: Observable<Process[]>;

    constructor(
        private store: Store<State>
    ) {

        this.processes$ = this.store.pipe(
            select(getProcessStates),
            map(processMap => {
                let out: Process[] = [];
                processMap.forEach((v, k) => out.push(v));
                return out;
            })
        );

        this.focussedPageId$ = this.store.pipe(
            select(getFocussedProcessId)
        );
    }

    ngOnInit() {
    }

    onBlockClicked(event, processDescr: Process) {
        this.store.dispatch(new NewProcessClicked({processId: processDescr.id}));
    }

    hasFocus(processDescr: Process): Observable<boolean> {
        return this.focussedPageId$.pipe(
            map(id => id == processDescr.id)
        );
    }
}
