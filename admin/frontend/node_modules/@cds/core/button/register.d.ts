import '@cds/core/icon/register.js';
import '@cds/core/progress-circle/register.js';
import { CdsButton } from './button.element.js';
import { CdsIconButton } from './icon-button.element.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-button': CdsButton;
        'cds-icon-button': CdsIconButton;
    }
}
