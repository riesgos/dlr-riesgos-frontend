import { IconRegistrySources } from '@cds/core/internal';
declare type IconSvgString = string;
declare type IconNameString = string;
declare type IconAliases = string[];
export interface IconShapeCollection {
    outline?: IconSvgString;
    solid?: IconSvgString;
    outlineBadged?: IconSvgString;
    outlineAlerted?: IconSvgString;
    solidBadged?: IconSvgString;
    solidAlerted?: IconSvgString;
}
export declare type IconShapeTuple = [IconNameString, IconSvgString | IconShapeCollection];
export interface IconShapeSources {
    [key: string]: IconShapeTuple;
}
declare module '@cds/core/internal' {
    interface IconRegistrySources {
        [key: string]: IconSvgString | IconShapeCollection;
    }
}
export declare type IconRegistry = Partial<IconRegistrySources>;
declare type NameOfIconToAlias = string;
export declare type IconAlias = [NameOfIconToAlias, IconAliases];
export {};
