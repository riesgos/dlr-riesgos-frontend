import { CdsDate } from './date.element.js';
import '@cds/core/forms/register.js';
import '@cds/core/button-action/register.js';
import '@cds/core/icon/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-date': CdsDate;
    }
}
