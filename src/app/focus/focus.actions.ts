import { Action } from '@ngrx/store';
import { Process } from '../wps/control/process';



export enum EFocusActionTypes {
    newProcessClicked = "[Focus] new process clicked"
}


export class NewProcessClicked implements Action {
    type: string = EFocusActionTypes.newProcessClicked;
    constructor(public payload: {process: Process}) {}
}


export type FocusAction = NewProcessClicked;