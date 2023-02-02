import { Injectable } from '@angular/core';
import { MappableProduct } from 'src/app/components/map/mappable/mappable_products';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from 'src/app/riesgos/riesgos.state';
import { Store } from '@ngrx/store';
import { WizardableProduct } from 'src/app/components/config_wizard/wizardable_products';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';

import { QuakeLedgerPeru, EtypePeru, AvailableEqsPeru, MminPeru, MmaxPeru, ZminPeru, ZmaxPeru, PPeru } from 'src/app/riesgos/scenarios/peru/1_catalog';
import { DataService } from '../data/data.service';
import { forkJoin, Observable, of } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';
import { EqSelectionPeru, SelectedEqPeru, UserinputSelectedEqPeru } from 'src/app/riesgos/scenarios/peru/2_eqselection';
import { GmpePeru, ShakemapWmsPeru, ShakygroundPeru, VsgridPeru } from 'src/app/riesgos/scenarios/peru/3_eqsim';
import { ExposureModelPeru, InitialExposurePeru, ModelChoicePeru } from 'src/app/riesgos/scenarios/peru/4_exposure';
import { EqDamageWmsPeru, EqDeusPeru } from 'src/app/riesgos/scenarios/peru/5_eqdamage';
import { State } from 'src/app/ngrx_register';
import { TsServicePeru, TsWmsPeru } from 'src/app/riesgos/scenarios/peru/6_tssim';
import { SchemaTs, TsDamageWmsPeru, TsDeusPeru } from 'src/app/riesgos/scenarios/peru/7_tsdamage';
import { ConfigService } from '../configService/configService';
import { DamageConsumerAreasPeru, EqReliabilityPeru } from 'src/app/riesgos/scenarios/peru/8_sysrel';
import { EtypeChile, QuakeLedgerChile, AvailableEqsChile, ZminChile, MmaxChile, MminChile, PChile, ZmaxChile } from 'src/app/riesgos/scenarios/chile/1_catalog';
import { UserinputSelectedEqChile, EqSelectionChile, SelectedEqChile } from 'src/app/riesgos/scenarios/chile/2_eqselection';
import { VsgridChile, GmpeChile, ShakygroundChile, ShakemapWmsChile } from 'src/app/riesgos/scenarios/chile/3_eqsim';
import { ModelChoiceChile, ExposureModelChile, InitialExposureChile } from 'src/app/riesgos/scenarios/chile/4_exposure';
import { EqDeusChile, EqDamageWmsChile } from 'src/app/riesgos/scenarios/chile/5_eqdamage';
import { TsServiceChile, TsWmsChile } from 'src/app/riesgos/scenarios/chile/6_tssim';
import { SchemaTsChile, TsDeusChile, TsDamageWmsChile } from 'src/app/riesgos/scenarios/chile/7_tsdamage';
import { EqReliabilityChile, DamageConsumerAreasChile } from 'src/app/riesgos/scenarios/chile/8_sysrel';
import { SelectableVei, VeiSelector } from 'src/app/riesgos/scenarios/ecuador/1_veiselection';
import { Ashfall, AshfallService, Probability } from 'src/app/riesgos/scenarios/ecuador/2_ashfallsim';
import { AshfallExposureEcuador, AshfallExposureProvider } from 'src/app/riesgos/scenarios/ecuador/3_ashfall_exposure';
import { LaharExposureEcuador, LaharExposureProvider } from 'src/app/riesgos/scenarios/ecuador/6_lahar_exposure';
import { AshfallDamage, AshfallDamageMultiLayer } from 'src/app/riesgos/scenarios/ecuador/4_ashfalldamage';
import { LaharDirection, LaharSim, LaharWmses } from 'src/app/riesgos/scenarios/ecuador/5_lahar';
import { LaharDamage, LaharDamageMultiLayer } from 'src/app/riesgos/scenarios/ecuador/7_lahardamage';
import { LaharAshfallDamage, LaharAshfallDamageMultiLayer } from 'src/app/riesgos/scenarios/ecuador/8_laharAndAshDamage';
import { DamageConsumerAreasEcuador, LaharReliability } from 'src/app/riesgos/scenarios/ecuador/9_sysrel';




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
    private store: Store<State>,
    private dataSvc: DataService,
    private config: ConfigService,
  ) {
    this.augmenters = [

      // Peru
      // inputs                                               // steps                  // outputs
      new EtypePeru(), new MminPeru(), new MmaxPeru(), 
      new ZminPeru(), new ZmaxPeru(), new PPeru(),            new QuakeLedgerPeru(),    new AvailableEqsPeru(),
      new UserinputSelectedEqPeru(this.store, this.dataSvc),  new EqSelectionPeru(),    new SelectedEqPeru(),
      new VsgridPeru(), new GmpePeru(),                       new ShakygroundPeru(),    new ShakemapWmsPeru(),
      new ModelChoicePeru(),                                  new ExposureModelPeru(),  new InitialExposurePeru(),  
                                                              new EqDeusPeru(),         new EqDamageWmsPeru(this.store, this.dataSvc),
                                                              new TsServicePeru(),      new TsWmsPeru(),
      new SchemaTs(),                                         new TsDeusPeru(),         new TsDamageWmsPeru(this.store, this.dataSvc),
                                                              new EqReliabilityPeru(),  new DamageConsumerAreasPeru(),


      // Chile
      // inputs                                                // steps                  // outputs
      new EtypeChile(), new MminChile(), new MmaxChile(), 
      new ZminChile(), new ZmaxChile(), new PChile(),          new QuakeLedgerChile(),    new AvailableEqsChile(),
      new UserinputSelectedEqChile(this.store, this.dataSvc),  new EqSelectionChile(),    new SelectedEqChile(),
      new VsgridChile(), new GmpeChile(),                      new ShakygroundChile(),    new ShakemapWmsChile(),
      new ModelChoiceChile(),                                  new ExposureModelChile(),  new InitialExposureChile(),  
                                                               new EqDeusChile(),         new EqDamageWmsChile(this.store, this.dataSvc),
                                                               new TsServiceChile(),      new TsWmsChile(),
      new SchemaTsChile(),                                     new TsDeusChile(),         new TsDamageWmsChile(this.store, this.dataSvc),
                                                               new EqReliabilityChile(),  new DamageConsumerAreasChile(),


      // Ecuador
      // inputs               // steps                        // outputs
      new SelectableVei(),    new VeiSelector(),
      new Probability(),      new AshfallService(),           new Ashfall(),
                              new AshfallExposureProvider(),  new AshfallExposureEcuador(),
                              new AshfallDamage(),            new AshfallDamageMultiLayer(),
                              new LaharSim(),                 new LaharWmses(),
      new LaharDirection(),   new LaharExposureProvider(),    new LaharExposureEcuador(),
                              new LaharDamage(),              new LaharDamageMultiLayer(),
                              new LaharAshfallDamage(),       new LaharAshfallDamageMultiLayer(),
                              new LaharReliability(),         new DamageConsumerAreasEcuador(),

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
    if (!augmenter) return undefined;

    return resolved$.pipe(
      map(resolvedProduct => augmenter.makeProductWizardable(resolvedProduct))
    );
  }

  public loadWizardPropertiesForStep(step: RiesgosStep): WizardableStep {
    const augmenter = this.getWizardStepAugmenters().find(a => a.appliesTo(step));
    if (!augmenter) return undefined;

    return augmenter.makeStepWizardable(step);
  }

  public loadMapPropertiesForProduct(product: RiesgosProduct): Observable<MappableProduct[]> | undefined {
    const resolved$ = this.dataSvc.resolveReference(product);
    if (!resolved$) return undefined;

    const augmenter = this.getMapProductAugmenters().find(a => a.appliesTo(product));
    if (!augmenter) return undefined;

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
