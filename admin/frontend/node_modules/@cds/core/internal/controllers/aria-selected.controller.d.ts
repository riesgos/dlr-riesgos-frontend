import { ReactiveController, ReactiveElement } from 'lit';
export declare type AriaSelected = ReactiveElement & {
    selected: boolean;
};
/**
 * Provides all nessesary aria-* attributes to create valid aria selection state.
 */
export declare function ariaSelected<T extends AriaSelected>(): ClassDecorator;
export declare class AriaSelectedController<T extends AriaSelected> implements ReactiveController {
    private host;
    constructor(host: T);
    hostUpdated(): void;
}
