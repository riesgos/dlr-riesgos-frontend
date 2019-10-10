import { WpsProcess, ProcessStateUnavailable, Product, WatchingProcess } from 'src/app/wps/wps.datatypes';
import { shakemapXmlRefOutput } from './shakyground';
import { schema, exposureRef } from './assetmaster';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { fragilityRef } from './modelProp';
import { fragilityRefDeusInput, shakemapRefDeusInput, exposureRefDeusInput } from './deusTranslator';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { FeatureCollection, feature, MultiPolygon, Polygon } from '@turf/helpers';
import { createBarchart, Bardata } from 'src/app/helpers/d3charts';



// export const fragility: WpsData & Product = {
//     uid: 'fragility',
//     description: {
//         id: 'fragility',
//         reference: false,
//         type: 'complex',
//         format: 'application/json'
//     },
//     value: null
// };

export const loss: WpsData & Product = {
    uid: 'loss',
    description: {
        id: 'loss',
        reference: false,
        type: 'literal'
    },
    value: 'testinputs/loss_sara.json'
};

export const damage: WpsData & Product = {
    uid: 'damage',
    description: {
        id: 'damage',
        reference: false,
        type: 'complex',
        format: 'application/json'
    },
    value: null
};

export const transition: VectorLayerData & WpsData & Product = {
    uid: 'transition',
    description: {
        id: 'transition',
        reference: false,
        type: 'complex',
        format: 'application/json',
        name: 'damage/transition',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();
                return new olStyle({
                  fill: new olFill({
                    color: [255, 0, 0, 0.3],
                  }),
                  stroke: new olStroke({
                    color: [255, 0, 0, 1],
                    witdh: 2
                  })
                });
            },
            text: (props: object) => {
                const anchor = document.createElement('div');
                const data: Bardata[] = [
                    {label: 'A', value: 2},
                    {label: 'B', value: 4},
                    {label: 'C', value: 1}
                ];
                const anchorUpdated = createBarchart(anchor, data, 300, 200, 'category', '$');
                return `<h3>Damage</h3>${anchor.innerHTML}`;
            }
        }
    },
    value: null
};

export const updated_exposure: WpsData & Product = {
    uid: 'updated_exposure',
    description: {
        id: 'updated_exposure',
        reference: false,
        type: 'complex',
        format: 'application/json'
    },
    value: null
};


export const Deus: WizardableProcess & WpsProcess = {
    id: 'org.n52.gfz.riesgos.algorithm.impl.DeusProcess',
    url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    state: new ProcessStateUnavailable(),
    name: 'Damage after EQ',
    description: 'This service outputs damage caused by a given earthquake.',
    requiredProducts: [loss, schema, fragilityRefDeusInput, shakemapRefDeusInput, exposureRefDeusInput].map(p => p.uid),
    providedProducts: [damage, transition, updated_exposure].map(p => p.uid),
    wizardProperties: {
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        shape: 'dot-circle'
    }
};
