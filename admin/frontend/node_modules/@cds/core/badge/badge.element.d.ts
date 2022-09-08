import { StatusTypes } from '@cds/core/internal';
import { LitElement } from 'lit';
/**
 * Badges provide a method to highlight a count of an element either next to it
 * or inside the element itself.
 *
 * ```typescript
 * import '@cds/core/badge/register.js';
 * ```
 *
 * ```html
 * <cds-badge status="info">2<span cds-layout="display:screen-reader-only"> items. Item text for screen-readers should be added to badges in elements that will only be read in a screen-reader.</span></cds-badge>
 * ```
 *
 * @element cds-badge
 * @slot - Content slot for inside the badge
 * @cssprop --background
 * @cssprop --border-color
 * @cssprop --border-radius
 * @cssprop --border-width
 * @cssprop --color
 * @cssprop --font-size
 * @cssprop --font-weight
 * @cssprop --padding
 * @cssprop --size
 */
export declare class CdsBadge extends LitElement {
    /**
     * Sets the color of the badge
     */
    color: 'default' | 'gray' | 'purple' | 'blue' | 'orange' | 'light-blue' | null;
    /**
     * Sets the color of the badge
     * @type {'neutral' | 'info' | 'success' | 'warning' | 'danger'}
     */
    status: StatusTypes;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResultGroup[];
}
