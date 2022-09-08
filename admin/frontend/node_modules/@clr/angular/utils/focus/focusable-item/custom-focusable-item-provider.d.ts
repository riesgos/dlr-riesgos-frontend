import { Type } from '@angular/core';
import { FocusableItem } from './focusable-item';
export declare function customFocusableItemProvider<T>(implementation: Type<T>): ({
    provide: import("@angular/core").InjectionToken<string>;
    useFactory: typeof import("../../id-generator/id-generator.service").uniqueIdFactory;
} | Type<T> | {
    provide: typeof FocusableItem;
    useExisting: Type<T>;
})[];
