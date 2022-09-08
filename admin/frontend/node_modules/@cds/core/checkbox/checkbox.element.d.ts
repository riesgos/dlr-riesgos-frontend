import { CdsInternalControlInline } from '@cds/core/forms';
/**
 * Checkbox
 *
 * ```typescript
 * import '@cds/core/checkbox/register.js';
 * ```
 *
 * ```html
 * <cds-checkbox>
 *   <label>checkbox</label>
 *   <input type="checkbox" />
 *   <cds-control-message>message text</cds-control-message>
 * </cds-checkbox>
 * ```
 *
 * @element cds-checkbox
 * @slot - For projecting checkbox
 * @cssprop --color
 * @cssprop --check-color
 * @cssprop --background
 * @cssprop --border-radius
 */
export declare class CdsCheckbox extends CdsInternalControlInline {
    static get styles(): import("lit").CSSResultGroup[];
}
