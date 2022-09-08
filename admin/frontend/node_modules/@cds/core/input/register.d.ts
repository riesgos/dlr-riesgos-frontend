import { CdsInput } from './input.element.js';
import { CdsInputGroup } from './input-group.element.js';
import '@cds/core/forms/register.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-input': CdsInput;
        'cds-input-group': CdsInputGroup;
    }
}
