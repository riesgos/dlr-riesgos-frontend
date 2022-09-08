import { CdsFile } from './file.element.js';
import '@cds/core/forms/register.js';
import '@cds/core/button/register.js';
import '@cds/core/button-action/register.js';
import '@cds/core/icon/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-file': CdsFile;
    }
}
