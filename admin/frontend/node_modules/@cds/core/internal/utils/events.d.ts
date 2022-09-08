export declare function stopEvent(event: Event): void;
export declare const getElementUpdates: (element: HTMLElement, propertyKey: string, callback: (value: any) => void) => MutationObserver;
export declare function onFirstInteraction(element: HTMLElement): Promise<null>;
export declare function onChildListMutation(element: HTMLElement, fn: (mutation?: MutationRecord) => void): MutationObserver;
export declare function listenForAttributeChange(element: HTMLElement, attrName: string, fn: (attrValue: string | null) => void): MutationObserver;
export declare function listenForAttributeListChange(element: HTMLElement, attrNames: string[], fn: (attrValue: string | null) => void): MutationObserver;
