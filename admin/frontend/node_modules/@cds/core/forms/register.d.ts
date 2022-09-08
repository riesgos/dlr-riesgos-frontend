import '@cds/core/icon/register.js';
import '@cds/core/button-action/register.js';
import { CdsControl } from './control/control.element.js';
import { CdsControlAction } from './control-action/control-action.element.js';
import { CdsInternalControlGroup } from './control-group/control-group.element.js';
import { CdsInternalControlInline } from './control-inline/control-inline.element.js';
import { CdsInternalControlLabel } from './control-label/control-label.element.js';
import { CdsControlMessage } from './control-message/control-message.element.js';
import { CdsFormGroup } from './form-group/form-group.element.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-control': CdsControl;
        'cds-control-action': CdsControlAction;
        'cds-internal-control-group': CdsInternalControlGroup;
        'cds-internal-control-inline': CdsInternalControlInline;
        'cds-internal-control-label': CdsInternalControlLabel;
        'cds-control-message': CdsControlMessage;
        'cds-form-group': CdsFormGroup;
    }
}
