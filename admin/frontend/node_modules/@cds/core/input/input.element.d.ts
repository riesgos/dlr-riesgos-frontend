import { CdsControl } from '@cds/core/forms';
/**
 * Input
 *
 * ```typescript
 * import '@cds/core/input/register.js';
 * ```
 *
 * ```html
 * <cds-input>
 *   <label>input</label>
 *   <input type="text" />
 * </cds-input>
 * ```
 *
 * @element cds-input
 * @slot - For projecting input and label
 * @cssprop --background
 * @cssprop --background-size
 * @cssprop --border
 * @cssprop --border-color
 * @cssprop --border-bottom
 * @cssprop --outline
 * @cssprop --padding
 * @cssprop --font-size
 * @cssprop --color
 * @cssprop --line-height
 * @cssprop --transition
 */
export declare class CdsInput extends CdsControl {
    static get styles(): import("lit").CSSResultGroup[];
}
