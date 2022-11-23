import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import * as FocusActions from 'src/app/focus/focus.actions';
import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { WizardableStep } from '../wizardable_steps';



@Component({
    selector: 'ukis-configuration-wizard',
    templateUrl: './configuration-wizard.component.html',
    styleUrls: ['./configuration-wizard.component.scss']
})
export class ConfigurationWizardComponent {

    private focussedPageId$: Observable<string>;
    @Input() navExpanded = true;
    @Input() steps: WizardableStep[];

    constructor(
        private store: Store<State>
    ) {
        this.focussedPageId$ = this.store.pipe(
            select(getFocussedProcessId)
        );
    }

    onBlockClicked(event, step: WizardableStep) {
        this.store.dispatch(FocusActions.newProcessClicked({ processId: step.step.id }));
    }

    hasFocus(step: WizardableStep): Observable<boolean> {
        return this.focussedPageId$.pipe(distinctUntilChanged()).pipe(
            map(id => id === step.step.id)
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
