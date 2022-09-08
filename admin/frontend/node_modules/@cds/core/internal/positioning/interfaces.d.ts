export declare type WindowDims = {
    height: number;
    width: number;
};
export declare type PointerObj = {
    size?: number;
    location?: string;
};
export declare type PositionObj = {
    popup: {
        top: number;
        left: number;
    };
    pointer?: PointerObj;
};
export declare type PositionObjOrNot = false | PositionObj;
export declare type CardinalPositionConfig = false | PositionObjOrNot[];
export declare type CardinalPositions = 'top' | 'right' | 'bottom' | 'left';
export declare type AxisAligns = 'start' | 'mid' | 'end';
export declare type AllCardinalPositionConfigs = {
    [index: string]: CardinalPositionConfig;
    top: CardinalPositionConfig;
    bottom: CardinalPositionConfig;
    left: CardinalPositionConfig;
    right: CardinalPositionConfig;
};
export declare type PositionConfig = false | AllCardinalPositionConfigs;
export declare enum Positions {
    Responsive = 0,
    Top = 1,
    Left = 2,
    TopOrLeft = 3,
    Right = 4,
    TopOrRight = 5,
    Horizontal = 6,
    TopOrHorizontal = 7,
    Bottom = 8,
    Vertical = 9,
    BottomOrLeft = 10,
    VerticalOrLeft = 11,
    BottomOrRight = 12,
    VerticalOrRight = 13,
    BottomOrHorizontal = 14,
    All = 15
}
export declare type PositionableElement = HTMLElement & {
    crossAxisOffset: number;
    mainAxisOffset: number;
    orientation: string;
    pointer: PointerElement;
    pointerAlign: AxisAligns;
    anchorAlign: AxisAligns;
    anchorRect: DOMRect;
    contentWrapper: HTMLElement;
    hostWrapper: HTMLElement;
    pointerWrapper: HTMLElement;
};
export declare type PointerElement = HTMLElement & {
    type: string;
    axisAlign: string;
};
