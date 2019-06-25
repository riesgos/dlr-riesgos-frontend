import { Action } from '@ngrx/store';
import { Process, ProcessId } from '../wps/control/process';



export enum EFocusActionTypes {
    newProcessClicked = "[Focus] new process clicked"
}


export class NewProcessClicked implements Action {
    type: string = EFocusActionTypes.newProcessClicked;
    constructor(public payload: {processId: ProcessId}) {}
}


export type FocusAction = NewProcessClicked;