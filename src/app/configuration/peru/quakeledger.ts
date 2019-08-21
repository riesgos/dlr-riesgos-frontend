import { WpsProcess, ProcessStateUnavailable, WatchingProcess, Product, CustomProcess } from '../../wps/wps.datatypes';
import { UserconfigurableWpsData, StringSelectUconfWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerData, BboxLayerData } from 'src/app/components/map/mappable_wpsdata';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { Style, Fill, Stroke, Circle, Text } from 'ol/style';
import { selectedRows } from '../chile/modelProp';
import { Observable, of } from 'rxjs';
import { WpsData } from 'projects/services-wps/src/public-api';
import { selectedEqs } from '../chile/quakeledger';


export const inputBoundingboxPeru: UserconfigurableWpsData & BboxLayerData = {
    description: {
        id: 'input-boundingbox',
        sourceProcessId: 'user',
        name: 'eq-selection: boundingbox',
        type: 'bbox',
        reference: false,
        description: 'Please select an area of interest',
        defaultValue: [-86.5, -20.5, -68.5, -0.6],
        wizardProperties: {
            name: 'AOI',
            fieldtype: 'bbox',
        },
    },
    value: null
};


const fakeEqs =  [
    {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -77.68, -12.62
                    ]
                },
                'properties': {
                    'origin.publicID': '1',
                    'origin.depth.value': '28.0',
                    'magnitude.mag.value': '8.0',
                },
                'id': '1'
            },
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -78.19, -11.77
                    ]
                },
                'properties': {
                    'origin.publicID': '2',
                    'origin.depth.value': '28.0',
                    'magnitude.mag.value': '8.0',
                },
                'id': '2'
            },
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -78.70, -10.93
                    ]
                },
                'properties': {
                    'origin.publicID': '3',
                    'origin.depth.value': '28.0',
                    'magnitude.mag.value': '8.0',
                },
                'id': '3'
            },
        ]
    }
];


export const QuakeLedgerPeru: WizardableProcess & CustomProcess = {
    state: new ProcessStateUnavailable(),
    id: 'org.n52.wps.python.algorithm.QuakeMLProcessBBox',
    name: 'Earthquake Catalogue',
    requiredProducts: ['input-boundingbox', 'mmin', 'mmax', 'zmin', 'zmax', 'p', 'etype', 'tlon', 'tlat'],
    providedProduct: 'selectedRows',
    wizardProperties: {
        shape: 'earthquake',
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    },

    execute: (inputs: WpsData[]): Observable<WpsData[]> => {
        return of([{
            ... selectedEqs,
            value: fakeEqs
        }]);
    },

};
