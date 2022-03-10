import { Injectable } from '@angular/core';
import { Process, Product } from './riesgos.datatypes';
import { HttpClient } from '@angular/common/http';
import { RiesgosScenarioMetadata } from './riesgos.state';
import { ConfigService, Config } from '../services/config/config.service';
import { Cache } from 'src/app/services/wps';
import { FakeCache } from 'src/app/services/wps';
import { IndexDbCache } from '../services/cache/indexDbCache';
import { RemoteCache } from '../services/cache/remoteCache';

// chile
import { QuakeLedger, InputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat, selectedEqs } from './scenarios/chile/quakeledger';
import { EqSelection, userinputSelectedEq, selectedEq } from './scenarios/chile/eqselection';
import { Shakyground, shakemapPgaOutput, eqShakemapRef, Gmpe, VsGrid, shakemapSa03WmsOutput, shakemapSa10WmsOutput } from './scenarios/chile/shakyground';
import { EqDeus, loss, eqDamageM, eqUpdatedExposureRef } from './scenarios/chile/eqDeus';
import { TsService, tsWms, tsShakemap } from './scenarios/chile/tsService';
import { TsDeus, schema, tsDamageM } from './scenarios/chile/tsDeus';
import { EqReliability, countryChile, hazardEq, damageConsumerAreas } from './scenarios/chile/reliability';
import { initialExposure, ExposureModel, modelChoice, initialExposureRef } from './scenarios/chile/exposure';
import { fragilityRef } from './scenarios/chile/modelProp';

// peru
import { ExposureModelPeru, initialExposurePeru, initialExposurePeruReference, modelChoicePeru } from './scenarios/peru/exposure';
import { QuakeLedgerPeru, InputBoundingboxPeru, mminPeru, mmaxPeru,
  zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru, selectedEqsPeru } from './scenarios/peru/quakeledger';
import { EqSelectionPeru, userinputSelectedEqPeru, selectedEqPeru } from './scenarios/peru/eqselection';
import { ShakygroundPeru, shakemapPgaOutputPeru, eqShakemapRefPeru, shakemapSa03OutputPeru, shakemapSa10OutputPeru } from './scenarios/peru/shakyground';
import { EqDeusPeru, lossPeru, eqDamagePeruM, eqUpdatedExposureRefPeru } from './scenarios/peru/eqDeus';
import { TsServicePeru, tsWmsPeru, tsShakemapPeru } from './scenarios/peru/tsService';
import { TsDeusPeru, tsDamagePeruM, schemaPeru } from './scenarios/peru/tsDeus';
import { EqReliabilityPeru, countryPeru, hazardEqPeru, damageConsumerAreasPeru } from './scenarios/peru/reliability';

// ecuador
import { VeiProvider, selectableVei } from './scenarios/ecuador/vei';
import { AshfallService, probability, ashfall, ashfallPoint } from './scenarios/ecuador/ashfallService';
import { AshfallExposureModel, LaharExposureModel, schemaEcuador,
  lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador,
  querymodeEcuador, assettypeEcuador, initialExposureAshfall, initialExposureAshfallRef,
  initialExposureLahar, initialExposureLaharRef, modelEcuador } from './scenarios/ecuador/exposure';
import { DeusAshfall, ashfallDamageM, ashfallUpdatedExposureRef } from './scenarios/ecuador/ashfallDamage';
import { LaharWrapper, laharHeightWms, laharHeightShakemapRef,
  laharVelocityWms, laharVelocityShakemapRef, laharPressureWms, laharErosionWms, laharDepositionWms, laharContoursWms } from './scenarios/ecuador/laharWrapper';
import { DeusLahar, laharDamageM, laharUpdatedExposureRef } from './scenarios/ecuador/laharDamage';
import { DeusLaharAndAshfall, laharAshfallDamageM } from './scenarios/ecuador/laharAndAshDamage';
import { LaharReliability, countryEcuador, hazardLahar, damageConsumerAreasEcuador } from './scenarios/ecuador/reliability';
import { FloodMayRunProcess, geomerFlood, FloodMayRun, userInputSelectedOutburst,
  hydrologicalSimulation, durationTiff, velocityTiff, depthTiff } from './scenarios/ecuador/geomerHydrological';
import { FloodDamageProcess, damageBuildings, damageManzanasGeojson } from './scenarios/ecuador/floodDamage';
import { vei, direction } from './scenarios/ecuador/lahar';
import { assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador } from './scenarios/ecuador/vulnerability';




@Injectable()
export class RiesgosService {

  private cache: Cache;

  constructor(
      private httpClient: HttpClient,
      private configSvc: ConfigService
    ) {}

    /**
     * NOTE:
     * the type of cache to use is loaded from config-file via `this.configSvc.getConfig()`.
     * That call to `getConfig` must not be made in the RiesgosService.constructor.
     * This is because the services provided in the app-module are initialized before APP_INITIALIZER is done.
     * If `getConfig` gets called before APP_INITIALIZER has returned the actual configuration, we get an error.
     */
    private getCache(): Cache {
      if (this.cache) {
        return this.cache;
      } else {
        const c: Config = this.configSvc.getConfig();
        switch (c.wpsCache) {
          case 'local':
            this.cache = new IndexDbCache();
            break;
          case 'remote':
            this.cache = new RemoteCache(this.httpClient, c.wpsCacheUrl);
            break;
          case 'none':
          default:
            this.cache = new FakeCache();
        }
      }
      return this.cache;
    }

    public loadScenarioMetadata(): RiesgosScenarioMetadata[] {
      return [{
        id: 'c1',
        title: 'Showcase Chile',
        preview: `assets/images/tsunami_en.jpg`,
        description: '',
      }, {
        id: 'e1',
        title: 'Showcase Ecuador',
        preview: `assets/images/lahar_en.jpg`,
        description: '',
      }, {
        id: 'p1',
        title: 'Showcase Peru',
        preview: `assets/images/tsunami_en.jpg`,
        description: '',
      }];
  }

  public loadScenarioData(scenario: string): [Process[], Product[]] {
    const cache = this.getCache();

    let processes: Process[] = [];
    let products: Product[] = [];
    switch (scenario) {
      case 'c1':
        processes = [
          new QuakeLedger(this.httpClient, cache),
          EqSelection,
          new Shakyground(this.httpClient, cache),
          new ExposureModel(this.httpClient, cache),
          new EqDeus(this.httpClient, cache),
          new TsService(this.httpClient, cache),
          new TsDeus(this.httpClient, cache),
          new EqReliability(this.httpClient, cache)
        ];
        products = [
          modelChoice,
          initialExposure, initialExposureRef,
          InputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat,
          selectedEqs, userinputSelectedEq,
          Gmpe, VsGrid, selectedEq,
          eqShakemapRef, shakemapPgaOutput, shakemapSa03WmsOutput, shakemapSa10WmsOutput,
          loss, eqDamageM, eqUpdatedExposureRef,
          tsWms, tsShakemap,
          countryChile, hazardEq,
          damageConsumerAreas, schema,
          tsDamageM,
          // physicalImpact
        ];
        break;
      case 'p1':
        processes = [
          new QuakeLedgerPeru(this.httpClient, cache),
          EqSelectionPeru,
          new ShakygroundPeru(this.httpClient, cache),
          new ExposureModelPeru(this.httpClient, cache),
          new EqDeusPeru(this.httpClient, cache),
          new TsServicePeru(this.httpClient, cache),
          new TsDeusPeru(this.httpClient, cache),
          new EqReliabilityPeru(this.httpClient, cache)
        ];
        products = [
          modelChoicePeru, initialExposurePeru, initialExposurePeruReference,
          InputBoundingboxPeru, mminPeru, mmaxPeru, zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru,
          lossPeru, eqDamagePeruM, Gmpe, VsGrid,
          selectedEqsPeru, userinputSelectedEqPeru,
          selectedEqPeru,
          shakemapPgaOutputPeru, shakemapSa03OutputPeru, shakemapSa10OutputPeru, eqShakemapRefPeru,
          tsWmsPeru, tsShakemapPeru, eqUpdatedExposureRefPeru, schemaPeru, 
          tsDamagePeruM,
          countryPeru, hazardEqPeru,
          damageConsumerAreasPeru
        ];
        break;
      case 'e1':
        processes = [
          VeiProvider,

          new AshfallService(this.httpClient, cache),
          new AshfallExposureModel(this.httpClient, cache),
          new DeusAshfall(this.httpClient, cache),

          new LaharWrapper(this.httpClient, cache),
          new LaharExposureModel(this.httpClient, cache),
          new DeusLahar(this.httpClient, cache),

          new DeusLaharAndAshfall(this.httpClient, cache),
          new LaharReliability(this.httpClient, cache),

          FloodMayRunProcess,
          geomerFlood,
          new FloodDamageProcess(this.httpClient, cache)
        ];
        products = [
          schemaEcuador, lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, assettypeEcuador, modelEcuador,
          fragilityRef, initialExposureAshfall, initialExposureAshfallRef, initialExposureLahar, initialExposureLaharRef,
          selectableVei, vei, FloodMayRun,
          probability, ashfall, ashfallPoint,
          ashfallDamageM, ashfallUpdatedExposureRef,
          direction, laharHeightWms, laharHeightShakemapRef, laharVelocityWms, laharVelocityShakemapRef,
          laharPressureWms, laharErosionWms, laharDepositionWms, laharContoursWms,
          assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador,
          laharDamageM, laharUpdatedExposureRef,
          laharAshfallDamageM,
          countryEcuador, hazardLahar,
          damageConsumerAreasEcuador,
          userInputSelectedOutburst, hydrologicalSimulation, durationTiff, velocityTiff, depthTiff,
          damageBuildings, damageManzanasGeojson
        ];
        break;
      default:
        throw new Error(`Unknown scenario ${scenario}`);
    }

    return [processes, products];
  }
}
