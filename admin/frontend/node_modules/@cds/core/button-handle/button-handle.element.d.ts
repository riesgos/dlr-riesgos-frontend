import { CdsButtonAction } from '@cds/core/button-action';
/**
 * Action Handle Button
 *
 * ```typescript
 * import '@cds/core/button-handle/register.js';
 * ```
 *
 * ```html
 * <cds-button-handle></cds-button-handle>
 * ```
 * @beta
 * @element cds-button-handle
 * @slot - For projecting text content or cds-icon
 */
export declare class CdsButtonHandle extends CdsButtonAction {
    static get styles(): import("lit").CSSResultGroup[];
    connectedCallback(): void;
}
