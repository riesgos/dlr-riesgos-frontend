import { ReactiveController, ReactiveElement } from 'lit';
export declare type AriaPressed = ReactiveElement & {
    pressed: boolean;
    readonly?: boolean;
};
/**
 * Provides all nessesary aria-* attributes to create valid pressed button states
 * https://sarahmhigley.com/writing/playing-with-state/
 */
export declare function ariaPressed<T extends AriaPressed>(): ClassDecorator;
export declare class AriaPressedController<T extends AriaPressed> implements ReactiveController {
    private host;
    constructor(host: T);
    hostUpdated(): void;
}
