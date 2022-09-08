declare type BoolFn = () => boolean;
export declare function returnOrFallthrough(conditions: [BoolFn, () => any][], fallthrough: () => any): any;
export declare function anyPassOrAnyFail(truths: BoolFn[], untruths: BoolFn[], fallthrough: boolean): boolean;
export {};
