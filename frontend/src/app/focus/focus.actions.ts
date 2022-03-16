import { Action } from '@ngrx/store'; 
import { ProcessId } from '../riesgos/riesgos.datatypes';



export enum EFocusActionTypes {
    appInit = '[Focus] app initialized',
    newProcessClicked = '[Focus] new process clicked',
    goToNextProcess = '[Focus] going to next process'
}


export class AppInit implements Action {
    type: string = EFocusActionTypes.appInit;
}


export class NewProcessClicked implements Action {
    type: string = EFocusActionTypes.newProcessClicked;
    constructor(public payload: {processId: ProcessId}) {}
}


export class GoToNextProcess implements Action {
    type: string = EFocusActionTypes.goToNextProcess;
}


export type FocusAction = AppInit | NewProcessClicked | GoToNextProcess;
