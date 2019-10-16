import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { vei } from './lahar';
import { ProcessStateUnavailable, CustomProcess, Product } from 'src/app/wps/wps.datatypes';
import { Observable, of } from 'rxjs';
import { StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from '@ukis/services-wps/src/public-api';



export const selectableVei: StringSelectUconfProduct & WpsData = {
    uid: 'user_intensity',
    description: {
        id: 'intensity',
        reference: false,
        type: 'literal',
        options: ['VEI1', 'VEI2', 'VEI3', 'VEI4'],
        defaultValue: 'VEI1',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'intensity',
        }
    },
    value: null
};



export const VeiProvider: WizardableProcess & CustomProcess = {
    uid: 'vei_provider',
    name: 'VEI Selection',
    requiredProducts: [selectableVei.uid],
    providedProducts: [vei.uid],
    state: new ProcessStateUnavailable(),
    wizardProperties: {
        providerName: '',
        providerUrl: '',
        shape: 'avalance'
    },
    execute: (products: Product[]): Observable<Product[]> => {
        const selectedVeiProd = products.find(p => p.uid === selectableVei.uid);
        return of([{
            ... vei,
            value: selectedVeiProd.value
        }]);
    }
}
