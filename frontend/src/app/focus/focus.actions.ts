import { createAction, props } from '@ngrx/store';
import { StepId } from '../riesgos/riesgos.datatypes';



export const appInit = createAction(
    '[Focus] app initialized'
);

export const newProcessClicked = createAction(
    '[Focus] new process clicked',
    props<{processId: StepId}>()
);

export const goToNextProcess = createAction(
    '[Focus] going to next process'
);
