import { CdsTextarea } from './textarea.element.js';
import '@cds/core/forms/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-textarea': CdsTextarea;
    }
}
