import { CustomProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { fragilityRefDeusInput, exposureRefDeusInput, shakemapRefDeusInput } from '../chile/deusTranslator';
import { damage, updated_exposure, transition, Deus } from '../chile/deus';
import { Observable, of } from 'rxjs';
import damageJson from './data/losses.json';
import transitionJson from './data/transitions.json';
import updated_exposureJson from './data/updated_exposure.json';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';


export const FakeDeus: CustomProcess & WizardableProcess = {
    id: 'fakeDeus',
    name: Deus.name,
    requiredProducts: Deus.requiredProducts,
    providedProducts: Deus.providedProducts,
    wizardProperties: Deus.wizardProperties,
    state: new ProcessStateUnavailable(),
    execute: (inuts: Product[]): Observable<Product[]> => {

        const fakeDamage = {
            ...damage,
            value: [damageJson]
        };

        const fakeTransition = {
            ...transition,
            value: [transitionJson]
        };

        const fakeExposure = {
            ...updated_exposure,
            value: [updated_exposureJson]
        };

        return of([fakeDamage, fakeTransition, fakeExposure]);
    }
};
