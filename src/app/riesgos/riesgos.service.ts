import { Injectable } from '@angular/core';
import { Process, Product } from './riesgos.datatypes';
import { ExposureSelection, modelChoice } from '../configuration/chile/exposureSelection';
import { QuakeLedger, InputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat, selectedEqs } from '../configuration/chile/quakeledger';
import { EqSelection, userinputSelectedEq, selectedEq } from '../configuration/chile/eqselection';
import { Shakyground, shakemapWmsOutput, eqShakemapRef } from '../configuration/chile/shakyground';
import { EqDeus, loss, eqDamageM, eqUpdatedExposureRef } from '../configuration/chile/eqDeus';
import { TsService, tsWms, tsShakemap } from '../configuration/chile/tsService';
import { TsDeus, tsDamage, tsTransition, tsUpdatedExposure } from '../configuration/chile/tsDeus';
import { EqReliability, countryChile, hazardEq, damageConsumerAreas } from '../configuration/chile/reliability';
import { lonmin, lonmax, latmin, latmax, assettype, schema, querymode, initialExposure } from '../configuration/chile/exposure';
import { assetcategory, losscategory, taxonomies, fragilityRef } from '../configuration/chile/modelProp';
import { ExposureModelPeru, lonminPeru, lonmaxPeru, latminPeru,
  latmaxPeru, assettypePeru, schemaPeru, querymodePeru, initialExposurePeru } from '../configuration/peru/exposure';
import { QuakeLedgerPeru, InputBoundingboxPeru, mminPeru, mmaxPeru,
  zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru, selectedEqsPeru } from '../configuration/peru/quakeledger';
import { EqSelectionPeru, userinputSelectedEqPeru, selectedEqPeru } from '../configuration/peru/eqselection';
import { ShakygroundPeru, shakemapWmsOutputPeru, eqShakemapRefPeru } from '../configuration/peru/shakyground';
import { EqDeusPeru, lossPeru, eqDamagePeruM, eqUpdatedExposureRefPeru } from '../configuration/peru/eqDeus';
import { TsServicePeru, tsWmsPeru, tsShakemapPeru } from '../configuration/peru/tsService';
import { TsDeusPeru, tsDamagePeru, tsTransitionPeru, tsUpdatedExposurePeru } from '../configuration/peru/tsDeus';
import { EqReliabilityPeru, countryPeru, hazardEqPeru, damageConsumerAreasPeru } from '../configuration/peru/reliability';
import { assetcategoryPeru, losscategoryPeru, taxonomiesPeru } from '../configuration/peru/modelProp';
import { VeiProvider, selectableVei } from '../configuration/ecuador/vei';
import { AshfallService, probability, ashfall, ashfallPoint } from '../configuration/ecuador/ashfallService';
import { AshfallExposureModel, LaharExposureModel, schemaEcuador,
  lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador,
  querymodeEcuador, assettypeEcuador, initialExposureAshfall, initialExposureAshfallRef,
  initialExposureLahar, initialExposureLaharRef } from '../configuration/ecuador/exposure';
import { DeusAshfall, ashfallDamageM, ashfallUpdatedExposureRef } from '../configuration/ecuador/ashfallDamage';
import { LaharWrapper, laharHeightWms, laharHeightShakemapRef,
  laharVelocityWms, laharVelocityShakemapRef, laharPressureWms, laharErosionWms, laharDepositionWms, laharContoursWms } from '../configuration/ecuador/laharWrapper';
import { DeusLahar, laharDamageM, laharUpdatedExposureRef } from '../configuration/ecuador/laharDamage';
import { DeusLaharAndAshfall, laharAshfallDamageM } from '../configuration/ecuador/laharAndAshDamage';
import { LaharReliability, countryEcuador, hazardLahar, damageConsumerAreasEcuador } from '../configuration/ecuador/reliability';
import { FloodMayRunProcess, geomerFlood, FloodMayRun, userinputSelectedOutburst,
  hydrologicalSimulation, durationTiff, velocityTiff, depthTiff } from '../configuration/ecuador/geomerHydrological';
import { FlooddamageProcess, FlooddamageTranslator, damageManzanas, damageBuildings, damageManzanasGeojson } from '../configuration/ecuador/floodDamage';
import { vei, direction } from '../configuration/ecuador/lahar';
import { assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador } from '../configuration/ecuador/vulnerability';
import { HttpClient } from '@angular/common/http';
import { RiesgosScenarioMetadata } from './riesgos.state';



@Injectable({
  providedIn: 'root'
})
export class RiesgosService {

  constructor(private httpClient: HttpClient) { }

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
          new ExposureSelection(this.httpClient),
          new QuakeLedger(this.httpClient),
          EqSelection,
          new Shakyground(this.httpClient),
          new EqDeus(this.httpClient),
          new TsService(this.httpClient),
          new TsDeus(this.httpClient),
          new EqReliability(this.httpClient),
          // PhysicalImpactAssessment
        ];
        products = [
          modelChoice,
          lonmin, lonmax, latmin, latmax, assettype, schema, querymode,
          assetcategory, losscategory, taxonomies,
          initialExposure,
          new InputBoundingbox(), mmin, mmax, zmin, zmax, p, etype, tlon, tlat,
          selectedEqs, userinputSelectedEq,
          selectedEq, shakemapWmsOutput, eqShakemapRef,
          loss, eqDamageM, eqUpdatedExposureRef,
          tsWms, tsShakemap,
          countryChile, hazardEq,
          damageConsumerAreas,
          tsDamage, tsTransition, tsUpdatedExposure,
          // physicalImpact
        ];
        break;
      case 'p1':
        processes = [
          new ExposureModelPeru(this.httpClient),
          new QuakeLedgerPeru(this.httpClient),
          EqSelectionPeru,
          new ShakygroundPeru(this.httpClient),
          new EqDeusPeru(this.httpClient),
          new TsServicePeru(this.httpClient),
          new TsDeusPeru(this.httpClient),
          new EqReliabilityPeru(this.httpClient)
        ];
        products = [
          lonminPeru, lonmaxPeru, latminPeru, latmaxPeru, assettypePeru, schemaPeru, querymodePeru,
          assetcategoryPeru, losscategoryPeru, taxonomiesPeru,
          initialExposurePeru,
          new InputBoundingboxPeru(), mminPeru, mmaxPeru, zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru,
          lossPeru, eqDamagePeruM,
          selectedEqsPeru, userinputSelectedEqPeru,
          selectedEqPeru, shakemapWmsOutputPeru, eqShakemapRefPeru,
          tsWmsPeru, tsShakemapPeru, eqUpdatedExposureRefPeru,
          tsDamagePeru, tsTransitionPeru, tsUpdatedExposurePeru,
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
          new FlooddamageProcess(this.httpClient),
          FlooddamageTranslator
        ];
        products = [
          schemaEcuador, lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, assettypeEcuador,
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
          userinputSelectedOutburst, hydrologicalSimulation, durationTiff, velocityTiff, depthTiff,
          damageManzanas, damageBuildings,
          damageManzanasGeojson
        ];
        break;
      default:
        throw new Error(`Unknown scenario ${scenario}`);
    }

    return [processes, products];
  }
}
