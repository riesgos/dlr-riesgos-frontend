/**
 * @description
 *
 * These are storybook utils for creating a dynamic demo.
 *
 * @internal
 */
export declare type CheckboxSelection = true | false | 'indeterminate';
export declare class TreeItem {
    id: string;
    open: boolean;
    show: boolean;
    expanded: false;
    expandable: false;
    parent: TreeItem | null;
    nodes: TreeItem[];
    private _selected;
    set selected(value: CheckboxSelection);
    get selected(): CheckboxSelection;
    constructor(id: string);
}
export declare function createItems(parent?: any, length?: number): TreeItem[];
