import { CustomProcess, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Observable, of } from 'rxjs';
import { WpsData } from 'projects/services-wps/src/public-api';



export const hydrologicalSimulation: WmsLayerData = {
    description: {
        id: 'hydrologicalSimulation',
        sourceProcessId: 'geomerHydrological',
        name: 'Hydrological Simulation',
        format: 'application/WMS',
        reference: true,
        type: 'complex',
    },
    value: null
};


export const geomerHydrological: WizardableProcess & CustomProcess = {
    id: 'geomerHydrological',
    name: 'Hydrology',
    requiredProducts: ['result'],
    providedProduct: 'hydrologicalSimulation',
    state: new ProcessStateUnavailable(),
    wizardProperties: {
        providerName: 'geomer',
        providerUrl: 'https://www.geomer.de/en/index.html',
        shape: 'tsunami'
    },
    execute: (inputs: WpsData[]): Observable<WpsData[]> => {
        return of([{
            ...hydrologicalSimulation,
            value: ['https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?version=1.3.0&service=wms&request=GetCapabilities']
        }]);
    }
};
