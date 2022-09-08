import { ReactiveController, ReactiveElement } from 'lit';
export declare type AriaDisabled = ReactiveElement & {
    disabled: boolean;
    readonly?: boolean;
};
/**
 * Provides all nessesary aria-* attributes to create valid disabled state for interactive components.
 */
export declare function ariaDisabled<T extends AriaDisabled>(): ClassDecorator;
export declare class AriaDisabledController<T extends AriaDisabled> implements ReactiveController {
    private host;
    constructor(host: T);
    hostUpdated(): void;
}
