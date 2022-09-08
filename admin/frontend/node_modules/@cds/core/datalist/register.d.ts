import { CdsDatalist } from './datalist.element.js';
import '@cds/core/forms/register.js';
import '@cds/core/button-expand/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-datalist': CdsDatalist;
    }
}
