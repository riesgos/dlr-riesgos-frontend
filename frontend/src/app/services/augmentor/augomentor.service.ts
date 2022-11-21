import { Injectable } from '@angular/core';
import { EqCatalog } from 'src/app/augmentors/peru/1_eqcatalog';
import { WizardableProduct } from 'src/app/components/config_wizard/wizardable_products';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { MappableProduct } from 'src/app/components/map/mappable/mappable_products';
import { RiesgosProduct, RiesgosScenarioMetadata, RiesgosStep, ScenarioName } from 'src/app/riesgos/riesgos.state';



export interface WizardableStepAugmentor {
  appliesTo(step: RiesgosStep): boolean;
  makeWizardable(step: RiesgosStep): WizardableStep;
}

export interface WizardableProductAugmentor {
  appliesTo(product: RiesgosProduct): boolean;
  makeWizardable(product: RiesgosProduct): WizardableProduct;
}

export interface MapableProductAugmentor {
  appliesTo(product: RiesgosProduct): boolean;
  makeMappable(product: RiesgosProduct): MappableProduct;
}



@Injectable({
  providedIn: 'root'
})
export class AugomentorService {

  public loadWizardPropertiesForProduct(scenarioName: ScenarioName, product: RiesgosProduct): WizardableProduct {
    for (const wizPropAug of this.getWizardProductAugmentors()) {
      if (wizPropAug.appliesTo(product)) return wizPropAug.makeWizardable(product);
    }
  }

  public loadWizardPropertiesForStep(scenarioName: ScenarioName, step: RiesgosStep): WizardableStep {
    for (const wizStepAug of this.getWizardStepAugmentors()) {
      if (wizStepAug.appliesTo(step)) return wizStepAug.makeWizardable(step);
    }
  }

  public loadMapPropertiesForProduct(scenarioName: ScenarioName, product: RiesgosProduct): MappableProduct {
    for (const mapPropAug of this.getMapProductAugmentors()) {
      if (mapPropAug.appliesTo(product)) return mapPropAug.makeMappable(product);
    }
  }

  private getWizardProductAugmentors(): WizardableProductAugmentor[] {

  }

  private getWizardStepAugmentors(): WizardableStepAugmentor[] {

  }

  private getMapProductAugmentors(): MapableProductAugmentor[] {

  }
}
