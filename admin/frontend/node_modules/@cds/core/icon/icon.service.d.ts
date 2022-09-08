import { IconAlias, IconRegistry, IconShapeTuple } from './interfaces/icon.interfaces.js';
/**
 * ClarityIcons is a static class that gives users the ability to interact with
 * the icon registry. This includes capabilities to add, retrieve, or alias icons
 * in the registry.
 *
 * @privateRemarks
 *
 * The icon registry is private to the module. There is no way to access it directly
 * outside of the module.
 *
 */
export declare class ClarityIcons {
    /**
     * Returns a readonly reference of the icon registry.
     */
    static get registry(): Readonly<IconRegistry>;
    static addIcons(...shapes: IconShapeTuple[]): void;
    /**
     * @description
     * Use `addIcons` instead of `addAliases`
     *
     * This method is a backwords compatibility function to the old API
     *
     * The team will revisit this method for possible deprecation.
     */
    static addAliases(...aliases: IconAlias[]): void;
    static getIconNameFromShape(iconShape: IconShapeTuple): string;
}
