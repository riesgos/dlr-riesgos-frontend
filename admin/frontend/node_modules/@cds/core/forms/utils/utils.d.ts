import { ControlLayout, FormLayout } from './interfaces.js';
import { CdsInternalControlGroup } from '../control-group/control-group.element.js';
import { CdsControl } from '../control/control.element.js';
import { CdsControlMessage } from '../control-message/control-message.element.js';
export declare const formLayouts: FormLayout[];
export declare const defaultFormLayout = "horizontal";
export declare const defaultControlWidth = "stretch";
export declare function associateInputAndLabel(input: HTMLInputElement, label: HTMLLabelElement): void;
export declare function associateInputToDatalist(input: HTMLInputElement, datalist: HTMLDataListElement): void;
export declare function assignInputId(input: HTMLInputElement): void;
export declare const layoutGroupToControlMapper: {
    [key: string]: ControlLayout;
};
export declare function getStatusIcon(status: 'error' | 'success' | 'neutral'): import("lit-html").TemplateResult<1>;
export declare function getLargestPrimaryLabelWidth(controls: (CdsControl | CdsInternalControlGroup)[]): Promise<string>;
export declare function controlIsWrapped(input: HTMLElement, label: HTMLElement, layout: FormLayout): boolean;
export declare function inlineControlListIsWrapped(inlineControls: CdsControl[], layout: FormLayout): boolean;
export declare function isVerticalLayout(layout: FormLayout): boolean;
/**
 * Returns updated message status unless hidden then returns 'neutral'
 */
export declare function getCurrentMessageStatus(messages: CdsControlMessage[]): Promise<import("./interfaces.js").ControlStatus>;
