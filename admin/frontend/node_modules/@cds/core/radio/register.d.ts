import { CdsRadioGroup } from './radio-group.element.js';
import { CdsRadio } from './radio.element.js';
import '@cds/core/forms/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-radio-group': CdsRadioGroup;
        'cds-radio': CdsRadio;
    }
}
