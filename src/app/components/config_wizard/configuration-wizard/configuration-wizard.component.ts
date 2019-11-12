import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { NewProcessClicked } from 'src/app/focus/focus.actions';
import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { getProcessStates } from 'src/app/wps/wps.selectors';
import { Process } from 'src/app/wps/wps.datatypes';
import { WizardableProcess, isWizardableProcess } from '../wizardable_processes';



@Component({
    selector: 'ukis-configuration-wizard',
    templateUrl: './configuration-wizard.component.html',
    styleUrls: ['./configuration-wizard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfigurationWizardComponent implements OnInit {

    @Input() navExpanded = true;
    private focussedPageId$: Observable<string>;
    public processes$: Observable<WizardableProcess[]>;
    constructor(
        private store: Store<State>
    ) {

        this.processes$ = this.store.pipe(
            select(getProcessStates),
            map(processes => {
                return processes.filter(process => isWizardableProcess(process)) as WizardableProcess[];
            })
        );

        this.focussedPageId$ = this.store.pipe(
            select(getFocussedProcessId)
        );
    }

    ngOnInit() { }

    onBlockClicked(event, processDescr: Process) {
        this.store.dispatch(new NewProcessClicked({ processId: processDescr.uid }));
    }

    hasFocus(processDescr: Process): Observable<boolean> {
        return this.focussedPageId$.pipe(distinctUntilChanged()).pipe(
            map(id => id === processDescr.uid)
        );
    }

    processStateForTranslate(stateType) {
        let value;
        if (stateType === 'unavailable') {
            value = 'Unavailable';
        }
        if (stateType === 'available') {
            value = 'Available';
        }
        if (stateType === 'running') {
            value = 'Running';
        }
        if (stateType === 'completed') {
            value = 'Completed';
        }
        if (stateType === 'error') {
            value = 'Error';
        }
        return value;
    }

    getClassForLabel(stateType) {
        return {
            'label-unavailable': stateType === 'unavailable',
            'label-info': stateType === 'available',
            'label-warning': stateType === 'running',
            'label-success': stateType === 'completed',
            'label-danger': stateType === 'error'
        };
    }

    getClassForProcess(stateType) {
        return {
            'is-unavailable': stateType === 'unavailable',
            'is-highlight': stateType === 'available',
            'is-warning': stateType === 'running',
            'is-success': stateType === 'completed',
            'is-danger': stateType === 'error'
        };
    }

    groupExpand: boolean = true;

    updateGroupExpand(event: any) {
        this.groupExpand = event;
    }
}
