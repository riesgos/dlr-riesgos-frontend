import { ReactiveController, ReactiveElement } from 'lit';
export declare type AriaPopupTrigger = {
    popup: string;
};
/**
 * Provides all nessesary aria-* attributes to create a vaild aria popup trigger.
 * Used in combination of the `@ariaPopup` controller.
 */
export declare function ariaPopupTrigger<T extends ReactiveElement & AriaPopupTrigger>(): ClassDecorator;
export declare class AriaPopupTriggerController<T extends ReactiveElement & AriaPopupTrigger> implements ReactiveController {
    private host;
    constructor(host: T);
    hostConnected(): void;
}
