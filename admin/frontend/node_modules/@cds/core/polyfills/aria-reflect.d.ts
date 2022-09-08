declare global {
    interface Element {
        role: any;
        ariaActiveDescendant: any;
        ariaControls: any;
        ariaLabelledBy: any;
        ariaDisabled: any;
        ariaExpanded: any;
        ariaSelected: any;
        ariaAtomic: any;
        ariaAutoComplete: any;
        ariaBusy: any;
        ariaChecked: any;
        ariaColCount: any;
        ariaColIndex: any;
        ariaColSpan: any;
        ariaCurrent: any;
        ariaHasPopup: any;
        ariaHidden: any;
        ariaKeyShortcuts: any;
        ariaLabel: any;
        ariaLevel: any;
        ariaLive: any;
        ariaModal: any;
        ariaMultiLine: any;
        ariaMultiSelectable: any;
        ariaOrientation: any;
        ariaPlaceholder: any;
        ariaPosInSet: any;
        ariaPressed: any;
        ariaReadOnly: any;
        ariaRequired: any;
        ariaRoleDescription: any;
        ariaRowCount: any;
        ariaRowIndex: any;
        ariaRowSpan: any;
        ariaSetSize: any;
        ariaSort: any;
        ariaValueMax: any;
        ariaValueMin: any;
        ariaValueNow: any;
        ariaValueText: any;
    }
}
export declare function reflect(element: HTMLElement | Element, attributeName: string, propertyName: string): void;
