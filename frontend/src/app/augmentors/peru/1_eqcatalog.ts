import { Injectable } from "@angular/core";
import { UserConfigurableProduct } from "src/app/components/config_wizard/userconfigurable_wpsdata";
import { WizardableStep } from "src/app/components/config_wizard/wizardable_steps";
import { MappableProduct } from "src/app/components/map/mappable/riesgos.datatypes.mappable";
import { ScenarioName, RiesgosScenarioMetadata, RiesgosProduct, RiesgosStep, StepStateAvailable } from "src/app/riesgos/riesgos.state";
import { Augmentor } from "src/app/services/augmentor/augomentor.service";


@Injectable({
    providedIn: 'root'
})
export class EqCatalog implements Augmentor {
    scenarios = ['Peru' as ScenarioName];
    steps = ['Eqs'];
    products = ['availableEqs'];

    stepWizardProperties(scenario: ScenarioName, step: RiesgosStep, existingData: WizardableStep): WizardableStep {
        const ws: WizardableStep = {
            scenario: scenario,
            state: step.state,
            step: step.step,
            wizardProperties: {
                shape: 'bullseye',
                providerName: 'GFZ',
                providerUrl: 'https://www.gfz-potsdam.de/en/',
                wikiLink: 'EqCatalogue',
                dataSources: [{ label: 'Quakeledger (GFZ)', href: 'https://dataservices.gfz-potsdam.de/panmetaworks/showshort.php?id=bae8fc94-4799-11ec-947f-3811b03e280f' }]
            }
        };
        return ws;
    }
    
    // productWizardProperties(scenario: ScenarioName, product: RiesgosProduct, existingData: UserConfigurableProduct): UserConfigurableProduct {

    // }

    // productMapProperties(scenario: ScenarioName, product: RiesgosProduct, existingData: MappableProduct): MappableProduct {

    // };

}