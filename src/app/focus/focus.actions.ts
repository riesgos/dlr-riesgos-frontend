import { Action } from '@ngrx/store'; 
import { ProcessId } from '../wps/wps.datatypes';



export enum EFocusActionTypes {
    newProcessClicked = "[Focus] new process clicked",
    goToNextProcess = "[Focus] going to next process"
}


export class NewProcessClicked implements Action {
    type: string = EFocusActionTypes.newProcessClicked;
    constructor(public payload: {processId: ProcessId}) {}
}


export class GoToNextProcess implements Action {
    type: string = EFocusActionTypes.goToNextProcess
}


export type FocusAction = NewProcessClicked | GoToNextProcess;