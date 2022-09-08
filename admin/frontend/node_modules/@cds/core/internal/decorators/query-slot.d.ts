export interface QuerySlotConfig {
    required?: 'error' | 'warning';
    requiredMessage?: string;
    /** auto assign found element to a particular slot */
    assign?: string;
    exemptOn?: (self: any) => boolean;
}
/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's light DOM Slot.
 *
 * @ExportDecoratedItems
 */
export declare function querySlot(selector: string, config?: QuerySlotConfig): (protoOrDescriptor: Record<string, unknown> | any, name?: PropertyKey | undefined) => any;
/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's light DOM Slot.
 *
 * @ExportDecoratedItems
 */
export declare function querySlotAll(selector: string, config?: QuerySlotConfig): (protoOrDescriptor: Record<string, unknown> | any, name?: PropertyKey | undefined) => any;
