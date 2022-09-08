import { CdsSearch } from './search.element.js';
import '@cds/core/button-action/register.js';
import '@cds/core/icon/register.js';
import '@cds/core/forms/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-search': CdsSearch;
    }
}
