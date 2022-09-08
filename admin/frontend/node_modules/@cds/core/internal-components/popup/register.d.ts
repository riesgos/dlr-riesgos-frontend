import '@cds/core/internal-components/close-button/register.js';
import { CdsInternalPopup } from './popup.element.js';
import { CdsInternalPointer } from './pointer.element.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-internal-popup': CdsInternalPopup;
        'cds-internal-pointer': CdsInternalPointer;
    }
}
