import { StringSelectUserConfigurableProduct, WizardableProduct } from "src/app/components/config_wizard/wizardable_products";
import { WizardableStep } from "src/app/components/config_wizard/wizardable_steps";
import { WizardableProductAugmenter, WizardableStepAugmenter } from "src/app/services/augmenter/augmenter.service";
import { RiesgosProduct, RiesgosStep } from "../../riesgos.state";


// @TODO: this is awkward.
// In future, frontend should be able to create its own steps
// without needing one from the backend


export class SelectableVei implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'veiUserSelection'
    }

    makeProductWizardable(product: RiesgosProduct): StringSelectUserConfigurableProduct[] {
        return [{
            ...product,
            description: {
                options: ['VEI1', 'VEI2', 'VEI3', 'VEI4'],
                defaultValue: 'VEI1',
                wizardProperties: {
                    fieldtype: 'stringselect',
                    name: 'intensity',
                }
            },
        }]
    }

}


export class VeiSelector implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'VeiSelection';
    }
    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ...step,
            scenario: 'Ecuador',
            wizardProperties: {
                providerName: '',
                providerUrl: '',
                shape: 'volcanoe',
                wikiLink: 'VeiSelection'
            }
        }
    }
}
