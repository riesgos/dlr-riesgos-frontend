import '@cds/core/button/register.js';
import '@cds/core/icon/register.js';
import '@cds/core/internal-components/close-button/register.js';
import { CdsAlertActions } from './alert-actions.element.js';
import { CdsAlertGroup } from './alert-group.element.js';
import { CdsAlert } from './alert.element.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-alert': CdsAlert;
        'cds-alert-actions': CdsAlertActions;
        'cds-alert-group': CdsAlertGroup;
    }
}
