import { LitElement } from 'lit';
import { PointerElement } from '@cds/core/internal';
/**
 * ```typescript
 * import '@cds/core/internal-components/popup/register.js';
 * ```
 *
 * ```html
 * <cds-internal-pointer></cds-internal-pointer>
 * ```
 *
 * @beta
 * @element cds-internal-pointer
 * @slot - Content slot to override the default pointer SVG
 * @cssprop --pointer-fill
 * @cssprop --pointer-outline
 * @cssprop --transform
 *
 */
export declare class CdsInternalPointer extends LitElement implements PointerElement {
    axisAlign: 'start' | 'center' | 'end';
    /**
     * The "angle" pointer type is the right-angle triangle that we are used to seeing with signposts.
     * The "default" pointer type is an equilateral triangle like we see with the pop-outs in the
     * datagrid single row actions.
     *
     * @type {('angle' | 'default')}
     * @memberof CdsInternalPointer
     */
    type: 'angle' | 'default';
    protected get pointerTemplate(): import("lit-html").TemplateResult<2>;
    protected render(): import("lit-html").TemplateResult<1> | import("lit-html").TemplateResult<2>;
    connectedCallback(): void;
    static get styles(): import("lit").CSSResultGroup[];
}
