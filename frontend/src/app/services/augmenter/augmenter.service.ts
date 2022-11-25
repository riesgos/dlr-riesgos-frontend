import { Injectable } from '@angular/core';
import { MappableProduct } from 'src/app/components/map/mappable/mappable_products';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from 'src/app/riesgos/riesgos.state';
import { Store } from '@ngrx/store';
import { WizardableProduct } from 'src/app/components/config_wizard/wizardable_products';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';

import { QuakeLedgerPeru, EtypePeru, AvailableEqsPeru } from 'src/app/riesgos/scenarios/peru/1_catalog';
import { DataService } from '../data/data.service';
import { forkJoin, Observable, of } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';
import { EqSelectionPeru, SelectedEqPeru, UserinputSelectedEqPeru } from 'src/app/riesgos/scenarios/peru/2_eqselection';
import { GmpePeru, ShakemapWmsPeru, ShakygroundPeru, VsgridPeru } from 'src/app/riesgos/scenarios/peru/3_eqsim';




export interface WizardableStepAugmenter {
  appliesTo(step: RiesgosStep): boolean;
  makeStepWizardable(step: RiesgosStep): WizardableStep;
}

export interface WizardableProductAugmenter {
  appliesTo(product: RiesgosProduct): boolean;
  makeProductWizardable(product: RiesgosProduct): WizardableProduct[];
}

export interface MappableProductAugmenter {
  appliesTo(product: RiesgosProduct): boolean;
  makeProductMappable(product: RiesgosProductResolved): MappableProduct[];
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

  private augmenters: Augmenter[] = [];

  constructor(
    private store: Store,
    private dataSvc: DataService
  ) {
    this.augmenters = [
      // inputs                                               // steps                // outputs
      new EtypePeru(),                                        new QuakeLedgerPeru(),  new AvailableEqsPeru(),
      new UserinputSelectedEqPeru(this.store, this.dataSvc),  new EqSelectionPeru(),  new SelectedEqPeru(),
      new VsgridPeru(), new GmpePeru(),                       new ShakygroundPeru(),  new ShakemapWmsPeru(),
    ];
  }

  public loadWizardPropertiesForProducts(products: RiesgosProduct[]): Observable<WizardableProduct[]> {
    const tasks$ = products.map(p => this.loadWizardPropertiesForProduct(p)).filter(p => !!p);
    return forkJoin(tasks$).pipe(
      map(d => d.flat()),
      defaultIfEmpty([])
    );
  }

  public loadMapPropertiesForProducts(products: RiesgosProduct[]): Observable<MappableProduct[]> {
    const tasks$ = products.map(p => this.loadMapPropertiesForProduct(p)).filter(p => !!p);
    return forkJoin(tasks$).pipe(
      map(d => d.flat()),
      defaultIfEmpty([]),
    );
  }

  public loadWizardPropertiesForSteps(steps: RiesgosStep[]): WizardableStep[] {
    const wizardSteps = steps.map(s => this.loadWizardPropertiesForStep(s)).filter(ws => !!ws);
    return wizardSteps;
  }

  public loadWizardPropertiesForProduct(product: RiesgosProduct): Observable<WizardableProduct[]> | undefined {
    let resolved$: Observable<RiesgosProduct> = this.dataSvc.resolveReference(product);
    if (!resolved$) resolved$ = of(product);

    const augmenter = this.getWizardProductAugmenters().find(a => a.appliesTo(product));
    if (!augmenter) { 
      console.warn(`No wizard-product-augmenter found for product ${product.id}`);
      return undefined;
    }

    return resolved$.pipe(
      map(resolvedProduct => augmenter.makeProductWizardable(resolvedProduct))
    );
  }

  public loadWizardPropertiesForStep(step: RiesgosStep): WizardableStep {
    const augmenter = this.getWizardStepAugmenters().find(a => a.appliesTo(step));
    if (!augmenter) { 
      console.warn(`No wizard-step-augmenter found for step ${step.step.id}`);
      return undefined;
    }
    return augmenter.makeStepWizardable(step);
  }

  public loadMapPropertiesForProduct(product: RiesgosProduct): Observable<MappableProduct[]> | undefined {
    const resolved$ = this.dataSvc.resolveReference(product);
    if (!resolved$) return undefined;

    const augmenter = this.getMapProductAugmenters().find(a => a.appliesTo(product));
    if (!augmenter) { 
      console.warn(`No map-product-augmenter found for product ${product.id}`);
      return undefined;
    }

    return resolved$.pipe(
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
