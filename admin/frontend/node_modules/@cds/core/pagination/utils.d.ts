export declare type PaginationIconConfig = {
    shape: string;
    direction: 'up' | 'right' | 'down' | 'left';
};
export declare function getPaginationIconConfig(action: 'first' | 'prev' | 'next' | 'last'): PaginationIconConfig;
