import { Injectable } from '@angular/core';
import { MappableProduct } from 'src/app/components/map/mappable/mappable_products';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep, ScenarioName } from 'src/app/riesgos/riesgos.state';
import { Store } from '@ngrx/store';
import { WizardableProduct } from 'src/app/components/config_wizard/wizardable_products';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';

import { QuakeLedgerPeru, EtypePeru, AvailableEqsPeru } from 'src/app/riesgos/scenarios/peru/1_catalog';
import { DataService } from '../data/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';




export interface WizardableStepAugmenter {
  appliesTo(step: RiesgosStep): boolean;
  makeStepWizardable(step: RiesgosStep): WizardableStep;
}

export interface WizardableProductAugmenter {
  appliesTo(product: RiesgosProduct): boolean;
  makeProductWizardable(product: RiesgosProduct): WizardableProduct;
}

export interface MappableProductAugmenter {
  appliesTo(product: RiesgosProduct): boolean;
  makeProductMappable(product: RiesgosProduct): MappableProduct;
}

function isWizardableStepAugmenter(a: Augmenter): a is WizardableStepAugmenter {
  return 'makeStepWizardable' in a;
}

function isWizardableProductAugmenter(a: Augmenter): a is WizardableProductAugmenter {
  return 'makeProductWizardable' in a;
}

function isMappableProductAugmenter(a: Augmenter): a is MappableProductAugmenter {
  return 'makeProductMappable' in a;
}

export type Augmenter = WizardableStepAugmenter | WizardableProductAugmenter | MappableProductAugmenter;



/**
 * Our backend returns the core-data for each step.
 * But often we want to enrich that core data with additional information.
 * This information may be specific to only some components of the frontend, though.
 * This service enriches core-data with all extra-information that the frontend-components need.
 * 
 * - `WizardableStepAugmenter`: makes step displayable in wizard
 * - `WizardableProductAugmenter`: makes product displayable in wizard
 * - `MappableProductAugmenter`: makes product displayable in map
 * 
 * Since this class is also the point where each augmenter is instantiated, it can be used 
 * to inject into the augmenters any necessary services or data.
 */

@Injectable({
  providedIn: 'root'
})
export class AugmenterService {

  private augmenters: Augmenter[] = [
    new QuakeLedgerPeru(), new EtypePeru(), new AvailableEqsPeru()
  ];

  constructor(
    private store: Store,
    private resolver: DataService
  ) {}

  public loadWizardPropertiesForProduct(scenarioName: ScenarioName, product: RiesgosProduct): Observable<WizardableProduct> {
    const augmenter = this.getWizardProductAugmenters().find(a => a.appliesTo(product));
    return this.resolver.resolveReference(product).pipe(
      map(resolvedProduct => augmenter.makeProductWizardable(resolvedProduct))
    );
  }

  public loadWizardPropertiesForStep(scenarioName: ScenarioName, step: RiesgosStep): WizardableStep {
    for (const wizStepAug of this.getWizardStepAugmenters()) {
      if (wizStepAug.appliesTo(step)) return wizStepAug.makeStepWizardable(step);
    }
  }

  public loadMapPropertiesForProduct(scenarioName: ScenarioName, product: RiesgosProduct): Observable<MappableProduct> {
    const augmenter = this.getMapProductAugmenters().find(a => a.appliesTo(product));
    return this.resolver.resolveReference(product).pipe(
      map(resolvedProduct => augmenter.makeProductMappable(resolvedProduct))
    );
  }

  private getWizardProductAugmenters(): WizardableProductAugmenter[] {
    return this.augmenters.filter(a => isWizardableProductAugmenter(a)) as WizardableProductAugmenter[];
  }

  private getWizardStepAugmenters(): WizardableStepAugmenter[] {
    return this.augmenters.filter(a => isWizardableStepAugmenter(a)) as WizardableStepAugmenter[];
  }

  private getMapProductAugmenters(): MappableProductAugmenter[] {
    return this.augmenters.filter(a => isMappableProductAugmenter(a)) as MappableProductAugmenter[];
  }
}
