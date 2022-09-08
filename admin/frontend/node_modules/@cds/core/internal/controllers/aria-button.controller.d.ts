import { ReactiveController, ReactiveElement } from 'lit';
export interface AriaButton extends ReactiveElement {
    readonly: boolean;
    disabled: boolean;
}
/**
 * Provides nessesary attributes for indicating a non-button element as an accessible button type.
 */
export declare function ariaButton<T extends AriaButton>(): ClassDecorator;
export declare class AriaButtonController<T extends AriaButton> implements ReactiveController {
    private host;
    constructor(host: T);
    hostConnected(): void;
    hostUpdated(): void;
}
