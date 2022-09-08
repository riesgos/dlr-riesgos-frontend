export declare const CDS_FOCUS_TRAP_DOCUMENT_ATTR = "cds-focus-trap";
/**
 * FocusTrapTrackerService is a static class that keeps track of the active element with focus trap,
 * in case there are multiple in a given page.
 */
export declare class FocusTrapTrackerService {
    static getTrapElements(): {
        focusTrapId: string;
    }[];
    static setTrapElements(elements: {
        focusTrapId: string;
    }[]): void;
    static removeTrapElement(element: {
        focusTrapId: string;
    }): void;
    static setCurrent(element: {
        focusTrapId: string;
    }): void;
    static activatePreviousCurrent(): void;
    static getCurrent(): {
        focusTrapId: string;
    } | null;
}
