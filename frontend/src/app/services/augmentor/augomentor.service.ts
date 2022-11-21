import { Injectable } from '@angular/core';
import { EqCatalog } from 'src/app/augmentors/peru/1_eqcatalog';
import { UserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { MappableProduct } from 'src/app/components/map/mappable/riesgos.datatypes.mappable';
import { RiesgosProduct, RiesgosScenarioMetadata, RiesgosStep, ScenarioName } from 'src/app/riesgos/riesgos.state';


export interface Augmentor {
  scenarios: ScenarioName[];
  steps: string[];
  products: string[];
  previewProperties?: (scenario: ScenarioName, metadata: RiesgosScenarioMetadata, existingData: any) => any;
  stepWizardProperties?: (scenario: ScenarioName, step: RiesgosStep, existingData: WizardableStep) => WizardableStep;
  productWizardProperties?: (scenario: ScenarioName, product: RiesgosProduct, existingData: UserConfigurableProduct) => UserConfigurableProduct;
  productMapProperties?: (scenario: ScenarioName, product: RiesgosProduct, existingData: MappableProduct) => MappableProduct;
}

@Injectable({
  providedIn: 'root'
})
export class AugomentorService {

  private augmentors: Augmentor[] = [
    this.eqCatalog
  ];

  constructor(
    private eqCatalog: EqCatalog
  ) { }

  public loadPreviewPropertiesForScenario(scenario: RiesgosScenarioMetadata) {
    let output;
    for (const augmentor of this.augmentors) {
      if (augmentor.scenarios.includes(scenario.id as ScenarioName) && augmentor.previewProperties) {
        output = augmentor.previewProperties(scenario.id as ScenarioName, scenario, output);
      }
    }
    return output;
  }

  public loadWizardPropertiesForProduct(scenarioName: ScenarioName, product: RiesgosProduct): UserConfigurableProduct {
    let output: UserConfigurableProduct;
    for (const augmentor of this.augmentors) {
      if (augmentor.scenarios.includes(scenarioName) && augmentor.products.includes(product.id) && augmentor.productWizardProperties) {
        output = augmentor.productWizardProperties(scenarioName, product, output);
      }
    }
    return output;
  }

  public loadWizardPropertiesForStep(scenarioName: ScenarioName, step: RiesgosStep): WizardableStep {
    let output: WizardableStep;
    for (const augmentor of this.augmentors) {
      if (augmentor.scenarios.includes(scenarioName) && augmentor.steps.includes(step.step.id) && augmentor.stepWizardProperties) {
        output = augmentor.stepWizardProperties(scenarioName, step, output);
      }
    }
    return output;
  }

  public loadMapPropertiesForProduct(scenarioName: ScenarioName, product: RiesgosProduct): MappableProduct {
    let output: MappableProduct;
    for (const augmentor of this.augmentors) {
      if (augmentor.scenarios.includes(scenarioName) && augmentor.productMapProperties) {
        output = augmentor.productMapProperties(scenarioName, product, output);
      }
    }
    return output;
  }
}
