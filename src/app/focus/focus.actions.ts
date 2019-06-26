import { Action } from '@ngrx/store'; 
import { ProcessId } from '../wps/control/workflow_datatypes';



export enum EFocusActionTypes {
    newProcessClicked = "[Focus] new process clicked"
}


export class NewProcessClicked implements Action {
    type: string = EFocusActionTypes.newProcessClicked;
    constructor(public payload: {processId: ProcessId}) {}
}


export type FocusAction = NewProcessClicked;