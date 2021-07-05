import { HttpClient } from '@angular/common/http';
import { WpsData } from '@dlr-eoc/utils-ogc';
import { WizardableProcess, WizardProperties } from '../../../components/config_wizard/wizardable_processes';
import { Product, WpsProcess } from '../../riesgos.datatypes';
import { VectorLayerProduct } from '../../riesgos.datatypes.mappable';
import { Style, Stroke } from 'ol/style';


export const elevation: WpsData & Product = {
    uid: 'elevation',
    description: {
        id: 'elevation',
        reference: false,
        title: 'elevation',
        type: 'literal',
    },
    value: '500m'
}

export const gml: WpsData & VectorLayerProduct = {
    description: {
        id: 'gml',
        reference: false,
        format: 'application/vnd.geo+json',
        title: 'GML',
        type: 'complex',
        vectorLayerAttributes: {
            style: (feature: any) => {
                return new Style({
                    stroke: new Stroke({
                      color: '#666666',
                      width: 1,
                    }),
                  });
            },

        }
    },
    uid: 'gml',
    value: null
}


export class LocalService extends WpsProcess implements WizardableProcess {
    
    wizardProperties: WizardProperties = {
        providerName: 'CIGIDEN',
        providerUrl: 'https://cigiden.org',
        shape: 'bolt'
    };


    constructor(http: HttpClient) {
        super('mylocalservice', 'My local service', ['elevation'], ['gml'], 'DtmProcess', 'This is a description', 'localhost:1410', '1.0.0', http);
    }
}