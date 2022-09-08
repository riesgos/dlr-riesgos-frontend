import '@cds/core/internal-components/overlay/register.js';
import '@cds/core/internal-components/close-button/register.js';
import { CdsModal } from './modal.element.js';
import { CdsModalActions } from './modal-actions.element.js';
import { CdsModalContent } from './modal-content.element.js';
import { CdsModalHeader } from './modal-header.element.js';
import { CdsModalHeaderActions } from './modal-header-actions.element.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-modal-content': CdsModalContent;
        'cds-modal-actions': CdsModalActions;
        'cds-modal-header-actions': CdsModalHeaderActions;
        'cds-modal-header': CdsModalHeader;
        'cds-modal': CdsModal;
    }
}
