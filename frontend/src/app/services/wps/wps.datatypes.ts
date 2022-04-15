export type ProductId = string;

export type WpsVersion = '1.0.0' | '2.0.0';
export type WpsDataFormat = 'application/vnd.geo+json' | 'application/json' | 'application/WMS' |
  'application/xml' | 'text/xml' | 'application/text' | 'image/geotiff' |
  'text/plain' | 'string';


export interface WpsDataDescription {
  id: ProductId;
  title: string; // @TODO: is this field obsolete?
  type: 'literal' | 'complex' | 'bbox' | 'status' | 'error';
  reference: boolean;
  format?: WpsDataFormat;
  description?: string;
  defaultValue?: any;
  options?: any[];
}

export interface WpsData {
  description: WpsDataDescription;
  value: any;
}

export interface WpsBboxDescription {
  id: ProductId;
  type: 'bbox';
  reference: boolean;
  format?: WpsDataFormat;
  description?: string;
  defaultValue?: any;
}

export interface WpsBboxValue {
  crs: string;
  lllon: number;
  lllat: number;
  urlon: number;
  urlat: number;
}

export const isBbox = (obj: object): obj is WpsBboxValue => {
  return (
    obj.hasOwnProperty('crs') &&
    obj.hasOwnProperty('lllon') &&
    obj.hasOwnProperty('lllat') &&
    obj.hasOwnProperty('urlon') &&
    obj.hasOwnProperty('urlat')
  );
};