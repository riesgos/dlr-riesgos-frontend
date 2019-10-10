import { WatchingProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { fragilityRef, VulnerabilityModel } from '../chile/modelProp';
import { fragilityRefDeusInput, shakemapRefDeusInput, exposureRefDeusInput } from '../chile/deusTranslator';
import { shakemapXmlRefOutput } from '../chile/shakyground';
import { exposureRef, ExposureModel, lonmin, lonmax, latmin, latmax } from '../chile/assetmaster';


export const lonminEcuador = {
    ...lonmin
};
lonminEcuador.description.defaultValue = '-79';


export const lonmaxEcuador = {
    ...lonmax
};
lonmaxEcuador.description.defaultValue = '-78';

export const latminEcuador = {
    ...latmin
};
latminEcuador.description.defaultValue = '-1';

export const latmaxEcuador = {
    ...latmax
};
latmaxEcuador.description.defaultValue = '-0.4';


export const LaharExposureModel = {
    ... ExposureModel,
    name: 'Lahar exposure model'
};


export const LaharVulnerabilityModel = {
    ... VulnerabilityModel,
    name: 'Lahar vulnerability model'
};


export const LaharDeusTranslator: WatchingProcess = {
    id: 'LaharDeusTranslator',
    name: 'LaharDeusTranslator',
    requiredProducts: [fragilityRef, exposureRef].map(p => p.uid),
    providedProducts: [fragilityRefDeusInput, exposureRefDeusInput].map(p => p.uid),
    state: new ProcessStateUnavailable(),
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.uid) {
            case fragilityRef.uid:
                return [{
                    ...fragilityRefDeusInput,
                    value: newProduct.value
                }];
            case exposureRef.uid:
                const exposureDeus = {
                    ...exposureRefDeusInput,
                    value: newProduct.value
                };
                delete exposureDeus.description.vectorLayerAttributes; // To avoid displaying exposure on map twice
                delete exposureDeus.description.name;
                return [exposureDeus];
            default:
                return [];
        }
    }
};

