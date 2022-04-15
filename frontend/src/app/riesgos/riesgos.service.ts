import { Injectable } from '@angular/core';
import { Process, Product } from './riesgos.datatypes';
import { HttpClient } from '@angular/common/http';
import { RiesgosScenarioMetadata } from './riesgos.state';
import { ConfigService, Config } from '../services/config/config.service';

// chile
import { QuakeLedger, InputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat, availableEqs } from './scenarios/chile/quakeledger';
import { EqSelection, userinputSelectedEq, selectedEq } from './scenarios/chile/eqselection';
import { Shakyground, shakemapPgaOutput, eqShakemapRef, Gmpe, VsGrid, shakemapSa03WmsOutput, shakemapSa10WmsOutput } from './scenarios/chile/shakyground';
import { EqDeus, loss, eqDamageWms, eqDamageMRef } from './scenarios/chile/eqDeus';
import { TsService, tsWms, tsShakemap } from './scenarios/chile/tsService';
import { TsDeus, schema, tsDamageWms, tsEconomicWms, tsTransitionWms } from './scenarios/chile/tsDeus';
import { EqReliability, countryChile, hazardEq, damageConsumerAreas } from './scenarios/chile/reliability';
import { initialExposure, ExposureModel, modelChoice, initialExposureRef } from './scenarios/chile/exposure';
import { fragilityRef } from './scenarios/chile/modelProp';

// peru
import { ExposureModelPeru, initialExposurePeru, initialExposurePeruReference, modelChoicePeru } from './scenarios/peru/exposure';
import { QuakeLedgerPeru, InputBoundingboxPeru, mminPeru, mmaxPeru,
  zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru, availableEqsPeru } from './scenarios/peru/quakeledger';
import { EqSelectionPeru, userinputSelectedEqPeru, selectedEqPeru } from './scenarios/peru/eqselection';
import { ShakygroundPeru, shakemapPgaOutputPeru, eqShakemapRefPeru, shakemapSa03OutputPeru, shakemapSa10OutputPeru } from './scenarios/peru/shakyground';
import { EqDeusPeru, lossPeru, eqDamageWmsPeru, eqEconomicWmsPeru, eqDamagePeruMRef } from './scenarios/peru/eqDeus';
import { TsServicePeru, tsWmsPeru, tsShakemapPeru } from './scenarios/peru/tsService';
import { TsDeusPeru, tsDamageWmsPeru, tsEconomicWmsPeru, tsTransitionWmsPeru, schemaPeru } from './scenarios/peru/tsDeus';
import { EqReliabilityPeru, countryPeru, hazardEqPeru, damageConsumerAreasPeru } from './scenarios/peru/reliability';

// ecuador
import { VeiProvider, selectableVei } from './scenarios/ecuador/vei';
import { AshfallService, probability, ashfall, ashfallPoint } from './scenarios/ecuador/ashfallService';
import { AshfallExposureModel, LaharExposureModel, schemaEcuador,
  lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador,
  querymodeEcuador, assettypeEcuador, initialExposureAshfall, initialExposureAshfallRef,
  initialExposureLahar, initialExposureLaharRef, modelEcuador } from './scenarios/ecuador/exposure';
import { DeusAshfall, ashfallDamageM, ashfallDamageMRef } from './scenarios/ecuador/ashfallDamage';
import { LaharWrapper, laharHeightWms, laharHeightShakemapRef,
  laharVelocityWms, laharVelocityShakemapRef, laharPressureWms, laharErosionWms, laharDepositionWms, laharContoursWms } from './scenarios/ecuador/laharWrapper';
import { DeusLahar, laharDamageM, laharDamageMRef } from './scenarios/ecuador/laharDamage';
import { DeusLaharAndAshfall, laharAshfallDamageM } from './scenarios/ecuador/laharAndAshDamage';
import { LaharReliability, countryEcuador, hazardLahar, damageConsumerAreasEcuador } from './scenarios/ecuador/reliability';
import { FloodMayRunProcess, geomerFlood, FloodMayRun, userInputSelectedOutburst,
  hydrologicalSimulation, durationTiff, velocityTiff, depthTiff } from './scenarios/ecuador/geomerHydrological';
import { FloodDamageProcess, damageBuildings, damageManzanasGeojson } from './scenarios/ecuador/floodDamage';
import { vei, direction } from './scenarios/ecuador/lahar';
import { assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador } from './scenarios/ecuador/vulnerability';




@Injectable()
export class RiesgosService {

  constructor(
      private httpClient: HttpClient,
      private configSvc: ConfigService
    ) {}


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

    let processes: Process[] = [];
    let products: Product[] = [];
    switch (scenario) {
      case 'c1':
        processes = [
          new QuakeLedger(this.httpClient),
          EqSelection,
          new Shakyground(this.httpClient),
          new ExposureModel(this.httpClient),
          new EqDeus(this.httpClient),
          new TsService(this.httpClient),
          new TsDeus(this.httpClient),
          new EqReliability(this.httpClient)
        ];
        products = [
          modelChoice,
          initialExposure, initialExposureRef,
          InputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat,
          availableEqs, userinputSelectedEq,
          Gmpe, VsGrid, selectedEq,
          eqShakemapRef, shakemapPgaOutput, shakemapSa03WmsOutput, shakemapSa10WmsOutput,
          loss, eqDamageWms, eqDamageMRef,
          tsWms, tsShakemap,
          countryChile, hazardEq,
          damageConsumerAreas, schema,
          tsDamageWms, tsEconomicWms, tsTransitionWms,
          // physicalImpact
        ];
        break;
      case 'p1':
        processes = [
          new QuakeLedgerPeru(this.httpClient),
          EqSelectionPeru,
          new ShakygroundPeru(this.httpClient),
          new ExposureModelPeru(this.httpClient),
          new EqDeusPeru(this.httpClient),
          new TsServicePeru(this.httpClient),
          new TsDeusPeru(this.httpClient),
          new EqReliabilityPeru(this.httpClient)
        ];
        products = [
          modelChoicePeru, initialExposurePeru, initialExposurePeruReference,
          InputBoundingboxPeru, mminPeru, mmaxPeru, zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru,
          lossPeru, eqDamageWmsPeru, eqEconomicWmsPeru, Gmpe, VsGrid,
          availableEqsPeru, userinputSelectedEqPeru,
          selectedEqPeru,
          shakemapPgaOutputPeru, shakemapSa03OutputPeru, shakemapSa10OutputPeru, eqShakemapRefPeru,
          tsWmsPeru, tsShakemapPeru, eqDamagePeruMRef, schemaPeru, 
          tsDamageWmsPeru, tsEconomicWmsPeru, tsTransitionWmsPeru,
          countryPeru, hazardEqPeru,
          damageConsumerAreasPeru
        ];
        break;
      case 'e1':
        processes = [
          VeiProvider,

          new AshfallService(this.httpClient),
          new AshfallExposureModel(this.httpClient),
          new DeusAshfall(this.httpClient),

          new LaharWrapper(this.httpClient),
          new LaharExposureModel(this.httpClient),
          new DeusLahar(this.httpClient),

          new DeusLaharAndAshfall(this.httpClient),
          new LaharReliability(this.httpClient),

          FloodMayRunProcess,
          geomerFlood,
          new FloodDamageProcess(this.httpClient)
        ];
        products = [
          schemaEcuador, lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, assettypeEcuador, modelEcuador,
          fragilityRef, initialExposureAshfall, initialExposureAshfallRef, initialExposureLahar, initialExposureLaharRef,
          selectableVei, vei, FloodMayRun,
          probability, ashfall, ashfallPoint,
          ashfallDamageM, ashfallDamageMRef,
          direction, laharHeightWms, laharHeightShakemapRef, laharVelocityWms, laharVelocityShakemapRef,
          laharPressureWms, laharErosionWms, laharDepositionWms, laharContoursWms,
          assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador,
          laharDamageM, laharDamageMRef,
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
