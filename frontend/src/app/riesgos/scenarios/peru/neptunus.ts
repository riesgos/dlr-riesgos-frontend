import { HttpClient } from '@angular/common/http';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { ProcessStateUnavailable, Product, WpsProcess } from '../../riesgos.datatypes';

export const tsunamiGeoTiff: WpsData & Product = {
    uid: 'tsunamiGeotiff',
    description: {
        id: 'intensity',
        title: '',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        // encoding: 'UTF-8'
    },
    value: null
}

export const intensityParameter: WpsData & Product = {
    uid: 'intensityParameter',
    description: {
        id: 'intensityname',
        title: '',
        type: 'literal',
        reference: false,
    },
    value: 'MWH'
};

export const intensityUnit: WpsData & Product = {
    uid: 'intensityUnit',
    description: {
        id: 'intensityunit',
        title: '',
        reference: false,
        type: 'literal'
    },
    value: 'm'
};

// https://rz-vm140.gfz-potsdam.de:8443/wps/WebProcessingService?service=WPS&request=DescribeProcess&version=2.0.0&identifier=org.n52.gfz.riesgos.algorithm.impl.NeptunusProcess
export class Neptunus extends WpsProcess {
    constructor(http: HttpClient, middleWareUrl: string) {
        super(
            'neptunus',
            'Neptunus',
            [tsunamiGeoTiff.uid, intensityParameter.uid, intensityUnit.uid, 'exposure', 'schema', 'fragility'],
            ['updated_exposure', 'transition', 'damage'],
            'org.n52.gfz.riesgos.algorithm.impl.NeptunusProcess',
            'neptunus_description',
            `https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService`,
            '2.0.0',
            http,
            new ProcessStateUnavailable(),
            middleWareUrl
        );
    }
}