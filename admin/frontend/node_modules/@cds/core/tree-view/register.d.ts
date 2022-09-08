import '@cds/core/icon/register.js';
import '@cds/core/internal-components/visual-checkbox/register.js';
import '@cds/core/progress-circle/register.js';
import '@cds/core/button-expand/register.js';
import { CdsTree } from './tree.element.js';
import { CdsTreeItem } from './tree-item.element.js';
declare global {
    interface HTMLElementTagNameMap {
        'cds-tree': CdsTree;
        'cds-tree-item': CdsTreeItem;
    }
}
