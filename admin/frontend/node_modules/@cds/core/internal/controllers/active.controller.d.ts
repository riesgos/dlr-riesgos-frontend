import { ReactiveController, ReactiveElement } from 'lit';
export interface Active extends ReactiveElement {
    disabled: boolean;
}
/**
 * This mimics the mouse-click visual behavior for keyboard only users and screen readers.
 * Browsers do not apply the CSS psuedo-selector :active in those instances. So we need this
 * for our :active styles to show.
 *
 * Make sure to update a component's CSS to account for the presence of the [cds-active] attribute
 * in all instance where :active is defined.
 */
export declare function active<T extends Active>(): ClassDecorator;
export declare class ActiveController<T extends Active> implements ReactiveController {
    private host;
    constructor(host: T);
    hostConnected(): Promise<void>;
    private emulateActive;
    private emulateInactive;
}
