import { WpsProcess, ProcessStateUnavailable, WatchingProcess, Product } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { selectedEq } from './eqselection';



export const lat: WpsData & Product = {
    uid: 'auto_lat',
    description: {
        id: 'lat',
        reference: false,
        type: 'literal',
    },
    value: null
};

export const lon: WpsData & Product = {
    uid: 'auto_lon',
    description: {
        id: 'lon',
        reference: false,
        type: 'literal',
    },
    value: null
};

export const mag: WpsData & Product = {
    uid: 'auto_mag',
    description: {
        id: 'mag',
        reference: false,
        type: 'literal',
    },
    value: null
};


export const epicenter: WpsData & Product = {
    uid: 'get_scenario_epiCenter',
    description: {
        id: 'epiCenter',
        reference: false,
        format: 'application/WMS',
        type: 'literal',
    },
    value: null
};



export const TsService: WizardableProcess & WpsProcess & WatchingProcess = {
    state: new ProcessStateUnavailable(),
    id: 'get_scenario',
    url: 'http://tsunami-wps.awi.de/wps',
    name: 'Earthquake/tsunami interaction',
    description: 'Relates a tsunami to a given earthquake',
    requiredProducts: [selectedEq, lat, lon, mag].map(p => p.uid),
    providedProducts: [epicenter.uid],
    wpsVersion: '1.0.0',
    wizardProperties: {
        shape: 'tsunami',
        providerName: 'Alfred Wegener Institute, Helmholtz Centre for Polar and Marine Research',
        providerUrl: 'https://www.awi.de/en/'
    },
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        let outprods: Product[] = [];
        if (newProduct.uid === 'EqSelection_quakeMLFile') {
            const newProds = [{
                ... lon,
                value: newProduct.value[0].features[0].geometry.coordinates[0]
            }, {
                ...lat,
                value: newProduct.value[0].features[0].geometry.coordinates[1]
            }, {
                ...mag,
                value: newProduct.value[0].features[0].properties['magnitude.mag.value']
            }];
            outprods = outprods.concat(newProds);
        }
        return outprods;
    }
};
