import { Injectable } from '@angular/core';
import { MappableProduct } from 'src/app/components/map/mappable/mappable_products';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep, ScenarioName } from 'src/app/riesgos/riesgos.state';
import { Store } from '@ngrx/store';
import { WizardableProduct } from 'src/app/components/config_wizard/wizardable_products';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';

import { QuakeLedgerPeru, EtypePeru, AvailableEqsPeru } from 'src/app/riesgos/scenarios/peru/1_catalog';




export interface WizardableStepAugmentor {
  appliesTo(step: RiesgosStep): boolean;
  makeStepWizardable(step: RiesgosStep): WizardableStep;
}

export interface WizardableProductAugmentor {
  appliesTo(product: RiesgosProduct): boolean;
  makeProductWizardable(product: RiesgosProduct): WizardableProduct;
}

export interface MapableProductAugmentor {
  appliesTo(product: RiesgosProduct): boolean;
  makeProductMappable(product: RiesgosProduct): MappableProduct;
}

function isWizardableStepAugmentor(a: Augmentor): a is WizardableStepAugmentor {
  return 'makeStepWizardable' in a;
}

function isWizardableProductAugmentor(a: Augmentor): a is WizardableProductAugmentor {
  return 'makeProductWizardable' in a;
}

function isMapableProductAugmentor(a: Augmentor): a is MapableProductAugmentor {
  return 'makeProductMappable' in a;
}

export type Augmentor = WizardableStepAugmentor | WizardableProductAugmentor | MapableProductAugmentor;



/**
 * Our backend returns the core-data for each step.
 * But often we want to enrich that core data with additional information.
 * This information may be specific to only some components of the frontend, though.
 * This service enriches core-data with all extra-information that the frontend-components need.
 * 
 * - `WizardableStepAugmentor`: makes step displayble in wizard
 * - `WizardableProductAugmentor`: makes product displayble in wizard
 * - `MapableProductAugmentor`: makes product displayable in map
 * 
 * Since this class is also the point where each augmentor is instantiated, it can be used 
 * to inject into the augmentors any neccessary services or data.
 */

@Injectable({
  providedIn: 'root'
})
export class AugomentorService {

  private augmentors: Augmentor[] = [
    new QuakeLedgerPeru(), new EtypePeru(), new AvailableEqsPeru()
  ];

  constructor(private store: Store) {}

  public loadWizardPropertiesForProduct(scenarioName: ScenarioName, product: RiesgosProduct): WizardableProduct {
    for (const wizPropAug of this.getWizardProductAugmentors()) {
      if (wizPropAug.appliesTo(product)) return wizPropAug.makeProductWizardable(product);
    }
  }

  public loadWizardPropertiesForStep(scenarioName: ScenarioName, step: RiesgosStep): WizardableStep {
    for (const wizStepAug of this.getWizardStepAugmentors()) {
      if (wizStepAug.appliesTo(step)) return wizStepAug.makeStepWizardable(step);
    }
  }

  public loadMapPropertiesForProduct(scenarioName: ScenarioName, product: RiesgosProductResolved): MappableProduct {
    for (const mapPropAug of this.getMapProductAugmentors()) {
      if (mapPropAug.appliesTo(product)) return mapPropAug.makeProductMappable(product);
    }
  }

  private getWizardProductAugmentors(): WizardableProductAugmentor[] {
    return this.augmentors.filter(a => isWizardableProductAugmentor(a)) as WizardableProductAugmentor[];
  }

  private getWizardStepAugmentors(): WizardableStepAugmentor[] {
    return this.augmentors.filter(a => isWizardableStepAugmentor(a)) as WizardableStepAugmentor[];
  }

  private getMapProductAugmentors(): MapableProductAugmentor[] {
    return this.augmentors.filter(a => isMapableProductAugmentor(a)) as MapableProductAugmentor[];
  }
}
