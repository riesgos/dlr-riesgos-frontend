import { CdsBaseButton } from '@cds/core/internal';
/**
 * Inline buttons are used inside and alongside textual content within Clarity components.
 * They give action buttons a less prominent, yet familiar, visual presence.
 *
 * ```typescript
 * import '@cds/core/button/register.js';
 * ```
 *
 * ```html
 * <cds-button-inline>Button text goes here</cds-button-inline>
 * ```
 *
 * @element cds-button-inline
 * @slot - Content slot for inside the button
 * @cssprop --text-decoration
 * @cssprop --color
 * @cssprop --font-size
 * @cssprop --line-height
 * @cssprop --letter-spacing
 */
export declare class CdsButtonInline extends CdsBaseButton {
    protected icon: HTMLElement;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResultGroup[];
}
/**
 * @deprecated
 * renamed to `cds-button-inline` in 6.0 to align to rest of the `cds-button-*` APIs
 */
export declare class CdsInlineButton extends CdsButtonInline {
}
