import { LitElement } from 'lit';
import { ControlStatus } from '../utils/interfaces.js';
import { ValidityStateKey } from '../utils/validate.js';
/**
 * Control Message
 *
 * ```typescript
 * import '@cds/core/forms/register.js';
 * ```
 *
 * ```html
 * <cds-control>
 *   <label>Test</label>
 *   <input type="text" />
 *   <cds-control-message>helper text</cds-control-message>
 * </cds-control>
 * ```
 *
 * @element cds-control-message
 * @slot - For projecting helper message text
 * @cssprop --color
 * @cssprop --font-size
 * @cssprop --font-weight
 * @cssprop --max-width
 * @cssprop --min-width
 */
export declare class CdsControlMessage extends LitElement {
    /**
     * Set the status of form control message validation
     * @type {neutral | error | success}
     */
    status: ControlStatus;
    /**
     * Defines the HTML5 ValidityState message of given control
     * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
     */
    error: ValidityStateKey;
    protected disabled: boolean;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResultGroup[];
    connectedCallback(): void;
}
