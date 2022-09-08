import { CdsControl } from '@cds/core/forms';
/**
 * Password
 *
 * ```typescript
 * import '@cds/core/password/register.js';
 * ```
 *
 * ```html
 * <cds-password>
 *   <label>Password</label>
 *   <input type="password" />
 *   <cds-control-message>message text</cds-control-message>
 * </cds-password>
 * ```
 *
 * @element cds-password
 * @slot - For projecting password input and label
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
export declare class CdsPassword extends CdsControl {
    private showPassword;
    i18n: {
        showButtonAriaLabel: string;
        hideButtonAriaLabel: string;
    };
    constructor();
    protected get suffixDefaultTemplate(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResultGroup[];
    togglePasswordVisibility(): void;
}
