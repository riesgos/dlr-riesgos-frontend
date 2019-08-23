import { Process, ProcessState, WpsProcess, ProcessStateTypes,
        ProcessStateUnavailable, WatchingProcess, Product } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { UserconfigurableWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from 'projects/services-wps/src/public-api';
import { convertWpsDataToProds, convertWpsDataToProd } from 'src/app/wps/wps.selectors';
import { selectedEq } from './eqselection';



export const lat: WpsData = {
    description: {
        id: 'lat',
        sourceProcessId: 'auto',
        reference: false,
        type: 'literal',
    },
    value: null
};

export const lon: WpsData = {
    description: {
        id: 'lon',
        sourceProcessId: 'auto',
        reference: false,
        type: 'literal',
    },
    value: null
};

export const mag: WpsData = {
    description: {
        id: 'mag',
        sourceProcessId: 'auto',
        reference: false,
        type: 'literal',
    },
    value: null
};


export const epicenter: WpsData = {
    description: {
        id: 'epiCenter',
        sourceProcessId: 'get_scenario',
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
    requiredProducts: convertWpsDataToProds([selectedEq, lat, lon, mag]).map(p => p.uid),
    providedProduct: convertWpsDataToProd(epicenter).uid,
    wpsVersion: '1.0.0',
    wizardProperties: {
        shape: 'tsunami',
        providerName: 'Alfred Wegener Institute, Helmholtz Centre for Polar and Marine Research',
        providerUrl: 'https://www.awi.de/en/'
    },
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        let outprods: Product[] = [];
        if (newProduct.uid === 'EqSelection_quakeMLFile') {
            const newProds = convertWpsDataToProds([{
                ... lon,
                value: newProduct.value[0].features[0].geometry.coordinates[0]
            }, {
                ...lat,
                value: newProduct.value[0].features[0].geometry.coordinates[1]
            }, {
                ...mag,
                value: newProduct.value[0].features[0].properties['magnitude.mag.value']
            }]);
            outprods = outprods.concat(newProds);
        }
        return outprods;
    }
};
