import { Injectable } from '@angular/core';
import { Process, Product } from './riesgos.datatypes';
import { HttpClient } from '@angular/common/http';
import { RiesgosScenarioMetadata } from './riesgos.state';

// chile
import { QuakeLedger, InputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat, availableEqs } from './scenarios/chile/1_catalog';
import { EqSelection, userinputSelectedEq, selectedEq } from './scenarios/chile/2_eqselection';
import { Shakyground, shakemapPgaOutput, eqShakemapRef, Gmpe, VsGrid, shakemapSa03WmsOutput, shakemapSa10WmsOutput } from './scenarios/chile/3_eqsim';
import { EqDeus, loss, eqDamageWms, eqDamageMRef, eqDamageMeta } from './scenarios/chile/5_eqdamage';
import { TsService, tsWms } from './scenarios/chile/6_tssim';
import { TsDeus, schema, tsDamageWms, tsDamageMeta } from './scenarios/chile/7_tsdamage';
import { EqReliability, countryChile, hazardEq, damageConsumerAreas } from './scenarios/chile/8_sysrel';
import { initialExposure, ExposureModel, modelChoice, initialExposureRef } from './scenarios/chile/4_exposure';
import { fragilityRef } from './scenarios/chile/modelProp';

// peru
import { ExposureModelPeru, initialExposurePeru, initialExposurePeruReference, modelChoicePeru } from './scenarios/peru/4_exposure';
import { QuakeLedgerPeru, InputBoundingboxPeru, mminPeru, mmaxPeru,
  zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru, availableEqsPeru } from './scenarios/peru/1_catalog';
import { EqSelectionPeru, userinputSelectedEqPeru, selectedEqPeru } from './scenarios/peru/2_eqselection';
import { ShakygroundPeru, shakemapPgaOutputPeru, eqShakemapRefPeru, shakemapSa03OutputPeru, shakemapSa10OutputPeru } from './scenarios/peru/3_eqsim';
import { EqDeusPeru, lossPeru, eqDamageWmsPeru, eqDamagePeruMRef, eqDamageMetaPeru } from './scenarios/peru/5_eqdamage';
import { TsServicePeru, tsWmsPeru } from './scenarios/peru/6_tssim';
import { TsDeusPeru, tsDamageWmsPeru, tsDamageMetaPeru, schemaPeru } from './scenarios/peru/7_tsdamage';
import { EqReliabilityPeru, countryPeru, hazardEqPeru, damageConsumerAreasPeru } from './scenarios/peru/8_sysrel';

// ecuador
import { VeiProvider, selectableVei } from './scenarios/ecuador/1_veiselection';
import { AshfallService, probability, ashfall, ashfallPoint } from './scenarios/ecuador/2_ashfallsim';
import { AshfallExposureModel, LaharExposureModel, schemaEcuador,
  lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador,
  querymodeEcuador, assettypeEcuador, initialExposureAshfall, initialExposureAshfallRef,
  initialExposureLahar, initialExposureLaharRef, modelEcuador } from './scenarios/ecuador/3_exposure';
import { DeusAshfall, ashfallDamageM, ashfallDamageMRef } from './scenarios/ecuador/4_ashfalldamage';
import { LaharWrapper, laharHeightWms, laharHeightShakemapRef,
  laharVelocityWms, laharVelocityShakemapRef, laharPressureWms, laharErosionWms, laharDepositionWms, laharContoursWms } from './scenarios/ecuador/5_lahar';
import { DeusLahar, laharDamageM, laharDamageMRef } from './scenarios/ecuador/7_lahardamage';
import { DeusLaharAndAshfall, laharAshfallDamageM } from './scenarios/ecuador/8_laharAndAshDamage';
import { LaharReliability, countryEcuador, hazardLahar, damageConsumerAreasEcuador } from './scenarios/ecuador/9_sysrel';
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
          selectableVei, vei,
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
