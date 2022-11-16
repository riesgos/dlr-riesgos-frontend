import { APP_INITIALIZER, Inject, Injectable } from '@angular/core';
import { Process, Product } from './riesgos.datatypes';
import { HttpClient } from '@angular/common/http';
import { RiesgosScenarioMetadata } from './riesgos.state';

// chile
import { QuakeLedger, InputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat, availableEqs } from './scenarios/chile/quakeledger';
import { EqSelection, userinputSelectedEq, selectedEq } from './scenarios/chile/eqselection';
import { Shakyground, shakemapPgaOutput, eqShakemapRef, Gmpe, VsGrid, shakemapSa03WmsOutput, shakemapSa10WmsOutput } from './scenarios/chile/shakyground';
import { EqDeus, loss, eqDamageWms, eqDamageMRef, eqDamageMeta } from './scenarios/chile/eqDeus';
import { TsService, tsWms } from './scenarios/chile/tsService';
import { TsDeus, schema, tsDamageWms, tsDamageMeta } from './scenarios/chile/tsDeus';
import { EqReliability, countryChile, hazardEq, damageConsumerAreas } from './scenarios/chile/reliability';
import { initialExposure, ExposureModel, modelChoice, initialExposureRef } from './scenarios/chile/exposure';
import { fragilityRef } from './scenarios/chile/modelProp';

// peru
import { ExposureModelPeru, initialExposurePeru, initialExposurePeruReference, modelChoicePeru } from './scenarios/peru/exposure';
import { QuakeLedgerPeru, InputBoundingboxPeru, mminPeru, mmaxPeru,
  zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru, availableEqsPeru } from './scenarios/peru/quakeledger';
import { EqSelectionPeru, userinputSelectedEqPeru, selectedEqPeru } from './scenarios/peru/eqselection';
import { ShakygroundPeru, shakemapPgaOutputPeru, eqShakemapRefPeru, shakemapSa03OutputPeru, shakemapSa10OutputPeru } from './scenarios/peru/shakyground';
import { EqDeusPeru, lossPeru, eqDamageWmsPeru, eqDamagePeruMRef, eqDamageMetaPeru } from './scenarios/peru/eqDeus';
import { TsServicePeru, tsWmsPeru } from './scenarios/peru/tsService';
import { TsDeusPeru, tsDamageWmsPeru, tsDamageMetaPeru, schemaPeru } from './scenarios/peru/tsDeus';
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
import { FloodMayRun } from './scenarios/ecuador/geomerHydrological';
import { vei, direction } from './scenarios/ecuador/lahar';
import { assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador } from './scenarios/ecuador/vulnerability';
import { ConfigService } from '../services/configService/configService';




@Injectable()
export class RiesgosService {

  constructor(
      private httpClient: HttpClient,
      private configService: ConfigService
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
          new QuakeLedger(this.httpClient, this.configService.getConfig().middlewareUrl),
          EqSelection,
          new Shakyground(this.httpClient, this.configService.getConfig().middlewareUrl),
          new ExposureModel(this.httpClient, this.configService.getConfig().middlewareUrl),
          new EqDeus(this.httpClient, this.configService.getConfig().middlewareUrl),
          new TsService(this.httpClient, this.configService.getConfig().middlewareUrl),
          new TsDeus(this.httpClient, this.configService.getConfig().middlewareUrl),
          new EqReliability(this.httpClient, this.configService.getConfig().middlewareUrl)
        ];
        products = [
          modelChoice,
          initialExposure, initialExposureRef,
          InputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat,
          availableEqs, userinputSelectedEq,
          Gmpe, VsGrid, selectedEq,
          eqShakemapRef, shakemapPgaOutput, shakemapSa03WmsOutput, shakemapSa10WmsOutput,
          loss, eqDamageWms, eqDamageMRef, eqDamageMeta,
          tsWms, tsDamageMeta,
          countryChile, hazardEq,
          damageConsumerAreas, schema,
          tsDamageWms,
        ];
        break;
      case 'p1':
        processes = [
          new QuakeLedgerPeru(this.httpClient, this.configService.getConfig().middlewareUrl),
          EqSelectionPeru,
          new ShakygroundPeru(this.httpClient, this.configService.getConfig().middlewareUrl),
          new ExposureModelPeru(this.httpClient, this.configService.getConfig().middlewareUrl),
          new EqDeusPeru(this.httpClient, this.configService.getConfig().middlewareUrl),
          new TsServicePeru(this.httpClient, this.configService.getConfig().middlewareUrl),
          new TsDeusPeru(this.httpClient, this.configService.getConfig().middlewareUrl),
          new EqReliabilityPeru(this.httpClient, this.configService.getConfig().middlewareUrl)
        ];
        products = [
          modelChoicePeru, initialExposurePeru, initialExposurePeruReference,
          InputBoundingboxPeru, mminPeru, mmaxPeru, zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru,
          lossPeru, eqDamageWmsPeru, eqDamageMetaPeru, Gmpe, VsGrid,
          availableEqsPeru, userinputSelectedEqPeru,
          selectedEqPeru,
          shakemapPgaOutputPeru, shakemapSa03OutputPeru, shakemapSa10OutputPeru, eqShakemapRefPeru,
          tsWmsPeru, eqDamagePeruMRef, schemaPeru, 
          tsDamageWmsPeru, tsDamageMetaPeru,
          countryPeru, hazardEqPeru,
          damageConsumerAreasPeru
        ];
        break;
      case 'e1':
        processes = [
          VeiProvider,
          new AshfallService(this.httpClient, this.configService.getConfig().middlewareUrl),
          new AshfallExposureModel(this.httpClient, this.configService.getConfig().middlewareUrl),
          new DeusAshfall(this.httpClient, this.configService.getConfig().middlewareUrl),
          new LaharWrapper(this.httpClient, this.configService.getConfig().middlewareUrl),
          new LaharExposureModel(this.httpClient, this.configService.getConfig().middlewareUrl),
          new DeusLahar(this.httpClient, this.configService.getConfig().middlewareUrl),
          new DeusLaharAndAshfall(this.httpClient, this.configService.getConfig().middlewareUrl),
          new LaharReliability(this.httpClient, this.configService.getConfig().middlewareUrl),
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
          damageConsumerAreasEcuador
        ];
        break;
      default:
        throw new Error(`Unknown scenario ${scenario}`);
    }

    return [processes, products];
  }
}
