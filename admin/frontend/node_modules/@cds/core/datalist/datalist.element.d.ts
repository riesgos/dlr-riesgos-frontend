import { CdsControl } from '@cds/core/forms';
/**
 * Datalist
 *
 * ```typescript
 * import '@cds/core/datalist/register.js';
 * ```
 *
 * ```html
 * <cds-datalist>
 *   <label>datalist</label>
 *   <input type="text" />
 *   <datalist>
 *     <option value="item 1"></option>
 *     <option value="item 2"></option>
 *     <option value="item 3"></option>
 *   </datalist>
 *   <cds-control-message>message text</cds-control-message>
 * </cds-datalist>
 * ```
 *
 * @element cds-datalist
 * @slot - For projecting input, datalist and label
 * @cssprop --background
 * @cssprop --background-size
 * @cssprop --border
 * @cssprop --border-bottom
 * @cssprop --outline
 * @cssprop --padding
 * @cssprop --font-size
 * @cssprop --color
 * @cssprop --line-height
 * @cssprop --transition
 */
export declare class CdsDatalist extends CdsControl {
    protected globalStyles: import("lit").CSSResultGroup;
    protected datalistControl: HTMLDataListElement;
    protected get suffixDefaultTemplate(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResultGroup[];
}
