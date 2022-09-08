import { LitElement } from 'lit';
/**
 * Web component accordion to be used inside an accordion
 *
 * ```typescript
 * import '@cds/core/accordion/register.js';
 * ```
 *
 * ```html
 * <cds-accordion>
 *   <cds-accordion-panel expanded>
 *     <cds-accordion-header>Item 1</cds-accordion-header>
 *     <cds-accordion-content>Content 1</cds-accordion-content>
 *   </cds-accordion-panel>
 *   <cds-accordion-panel>
 *     <cds-accordion-header>Item 2</cds-accordion-header>
 *     <cds-accordion-content>Content 2</cds-accordion-content>
 *   </cds-accordion-panel>
 *   <cds-accordion-panel disabled>
 *     <cds-accordion-header>Item 3</cds-accordion-header>
 *     <cds-accordion-content>Content 3</cds-accordion-content>
 *   </cds-accordion-panel>
 * </cds-accordion>
 * ```
 *
 * @element cds-accordion-header
 * @cssprop --color
 * @cssprop --font-size
 * @cssprop --font-weight
 * @cssprop --background
 * @cssprop --icon-color
 * @cssprop --icon-transform
 */
export declare class CdsAccordionHeader extends LitElement {
    /** @private */
    expanded: boolean;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResultGroup[];
}
