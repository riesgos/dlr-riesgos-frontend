import { CustomProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Observable, of } from 'rxjs';
import { WpsData } from 'projects/services-wps/src/public-api';
import { laharWms } from './lahar';



export const hydrologicalSimulation: WmsLayerData & WpsData = {
    uid: 'geomerHydrological_hydrologicalSimulation',
    description: {
        id: 'hydrologicalSimulation',
        name: 'Hydrological Simulation',
        format: 'application/WMS',
        reference: false,
        type: 'complex',
    },
    value: null
};


export const geomerHydrological: WizardableProcess & CustomProcess = {
    id: 'geomerHydrological',
    name: 'Flood',
    requiredProducts: [laharWms].map(p => p.uid),
    providedProducts: [hydrologicalSimulation.uid],
    state: new ProcessStateUnavailable(),
    wizardProperties: {
        providerName: 'geomer',
        providerUrl: 'https://www.geomer.de/en/index.html',
        shape: 'tsunami'
    },
    execute: (inputs: Product[]): Observable<Product[]> => {
        return of([{
            ...hydrologicalSimulation,
            value: ['https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?version=1.3.0&service=wms&request=GetCapabilities']
        }]);
    }
};
