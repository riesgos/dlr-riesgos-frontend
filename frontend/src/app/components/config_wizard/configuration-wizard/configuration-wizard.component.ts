import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import * as FocusActions from 'src/app/focus/focus.actions';
import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Process } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess} from '../wizardable_processes';



@Component({
    selector: 'ukis-configuration-wizard',
    templateUrl: './configuration-wizard.component.html',
    styleUrls: ['./configuration-wizard.component.scss']
})
export class ConfigurationWizardComponent {

    @Input() navExpanded = true;
    private focussedPageId$: Observable<string>;
    @Input() public processes: WizardableProcess[];

    constructor(
        private store: Store<State>
    ) {
        this.focussedPageId$ = this.store.pipe(
            select(getFocussedProcessId)
        );
    }

    onBlockClicked(event, processDescr: Process) {
        this.store.dispatch(FocusActions.newProcessClicked({ processId: processDescr.uid }));
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
