import { ReactiveController, ReactiveElement } from 'lit';
export declare type ButtonSubmit = ReactiveElement & HTMLElement & {
    name: string;
    value: string;
    disabled: boolean;
    type: 'button' | 'submit';
    readonly: boolean;
};
/**
 * Shim for allowing native submit type events with custom element buttons as Safari prevents use of extending native element types
 */
export declare function buttonSubmit<T extends ButtonSubmit>(): ClassDecorator;
export declare class ButtonSubmitController<T extends ButtonSubmit> implements ReactiveController {
    private host;
    private triggerNativeButtonBehaviorHandler;
    private emulateKeyBoardEventBehaviorHandler;
    constructor(host: T);
    hostUpdated(): void;
    private setButtonType;
    private setupNativeButtonBehavior;
    private emulateKeyBoardEventBehavior;
    /**
     * We have to append a hidden button outside the web component in the light DOM
     * This allows us to trigger native submit events within a form element.
     */
    private triggerNativeButtonBehavior;
}
