import { EventEmitter } from '@cds/core/internal';
import { CdsButtonAction } from '@cds/core/button-action';
export declare type ButtonSort = 'none' | 'ascending' | 'descending';
/**
 * Action Button
 *
 * ```typescript
 * import '@cds/core/button-sort/register.js';
 * ```
 *
 * ```html
 * <cds-button-sort></cds-button-sort>
 * ```
 * @beta
 * @element cds-button-sort
 */
export declare class CdsButtonSort extends CdsButtonAction {
    sort: ButtonSort;
    sortChange: EventEmitter<ButtonSort>;
    static get styles(): import("lit").CSSResultGroup[];
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
}
