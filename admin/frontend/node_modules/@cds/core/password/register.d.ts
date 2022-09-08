import { CdsPassword } from './password.element.js';
import '@cds/core/forms/register.js';
import '@cds/core/button-action/register.js';
import '@cds/core/icon/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-password': CdsPassword;
    }
}
