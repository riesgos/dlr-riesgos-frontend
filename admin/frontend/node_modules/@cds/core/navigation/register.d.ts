import '@cds/core/button/register.js';
import '@cds/core/icon/register.js';
import '@cds/core/divider/register.js';
import { CdsNavigation } from './navigation.element.js';
import { CdsNavigationGroup } from './navigation-group.element.js';
import { CdsNavigationStart } from './navigation-start.element.js';
import { CdsNavigationItem } from './navigation-item.element.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-navigation': CdsNavigation;
        'cds-navigation-group': CdsNavigationGroup;
        'cds-navigation-start': CdsNavigationStart;
        'cds-navigation-item': CdsNavigationItem;
    }
}
