import { CdsToggleGroup } from './toggle-group.element.js';
import { CdsToggle } from './toggle.element.js';
import '@cds/core/forms/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-toggle-group': CdsToggleGroup;
        'cds-toggle': CdsToggle;
    }
}
