import { CdsButtonAction } from '@cds/core/button-action';
export declare const CdsCloseButtonTagName = "cds-internal-close-button";
/**
 * Standard close button for Clarity Components extends default cds-button-action
 *
 * ```typescript
 * import '@cds/core/internal-components/close-button/register.js';
 * ```
 *
 * ```html
 * <cds-internal-close-button></cds-internal-close-button>
 * ```
 *
 * @element cds-internal-close-button
 */
export declare class CdsInternalCloseButton extends CdsButtonAction {
    shape: string;
    connectedCallback(): void;
}
