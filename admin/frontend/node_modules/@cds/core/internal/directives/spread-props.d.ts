import { ElementPart, Directive, DirectiveParameters } from 'lit/directive.js';
export declare class SpreadProps extends Directive {
    render(): string;
    update(part: ElementPart, params: DirectiveParameters<this>): string;
}
export declare const spreadProps: any;
declare global {
    interface HTMLElement {
        '..': any;
    }
}
