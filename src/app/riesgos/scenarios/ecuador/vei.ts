import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { vei } from './lahar';
import { ProcessStateUnavailable, ExecutableProcess, Product } from 'src/app/riesgos/riesgos.datatypes';
import { Observable, of } from 'rxjs';
import { StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WpsData } from '@dlr-eoc/utils-ogc';



export const selectableVei: StringSelectUconfProduct & WpsData = {
    uid: 'selectable_intensity',
    description: {
        id: 'intensity',
        title: '',
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



export const VeiProvider: WizardableProcess & ExecutableProcess = {
    uid: 'vei_provider',
    name: 'VEI Selection',
    description: 'The Volcanic Explosivity Index (VEI) is a relative measure of the explosiveness of volcanic eruptions. Volume of products, eruption cloud height, and qualitative observations are used to determine the explosivity value.',
    requiredProducts: [selectableVei.uid],
    providedProducts: [vei.uid],
    state: new ProcessStateUnavailable(),
    wizardProperties: {
        providerName: '',
        providerUrl: '',
        shape: 'volcanoe',
    },
    execute: (products: Product[]): Observable<Product[]> => {
        const selectedVeiProd = products.find(p => p.uid === selectableVei.uid);
        return of([{
            ... vei,
            value: selectedVeiProd.value
        }]);
    }
}
