import { LitElement } from 'lit';
/**
 * Label
 *
 * ```typescript
 * import '@cds/core/forms/register.js';
 * ```
 *
 * ```html
 * <cds-internal-control-label status="primary | secondary">
 *   <label>...</label>
 * </cds-internal-control-label>
 * ```
 *
 * @element cds-internal-control-label
 * @slot - For projecting label text
 * @cssprop --label-width
 */
export declare class CdsInternalControlLabel extends LitElement {
    disabled: boolean;
    action: 'primary' | 'secondary';
    static get styles(): import("lit").CSSResultGroup[];
    render(): import("lit-html").TemplateResult<1>;
}
