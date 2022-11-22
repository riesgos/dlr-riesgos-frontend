import { createAction, props } from '@ngrx/store';



export const appInit = createAction(
    '[Focus] app initialized'
);

export const newProcessClicked = createAction(
    '[Focus] new process clicked',
    props<{processId: string}>()
);

export const goToNextProcess = createAction(
    '[Focus] going to next process'
);
