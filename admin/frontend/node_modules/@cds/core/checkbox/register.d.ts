import { CdsCheckbox } from './checkbox.element.js';
import { CdsCheckboxGroup } from './checkbox-group.element.js';
import '@cds/core/forms/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-checkbox': CdsCheckbox;
        'cds-checkbox-group': CdsCheckboxGroup;
    }
}
