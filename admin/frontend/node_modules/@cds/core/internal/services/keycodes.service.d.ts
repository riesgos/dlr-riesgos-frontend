export declare type KeyCodeValues = Map<string, string>;
/**
 * KeyCodes is a static class that gives users the ability to lookup and even store
 * keycodes for their applications.
 *
 * @privateRemarks
 *
 * The key codes dictionary/hashmap is private to this module. There is no way to access it directly
 * outside of the module.
 *
 */
export declare class KeyCodeService {
    /**
     * keycodes() returns a clone of the key codes dictionary/hashmap, not the actual registry.
     * Performing actions on the return value of the keycodes getter will not be reflected in the
     * actual keycodes dictionary!
     */
    static get keycodes(): KeyCodeValues;
    static add(keycode: string, code: string): void;
    static has(keycode: string): boolean;
    static getCode(keycode: string, keyCodeRegistry?: KeyCodeValues): string;
}
export declare function getKeycodeFromRegistry(codeToLookup: string, registry: KeyCodeValues): string;
