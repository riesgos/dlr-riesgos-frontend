import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects, State } from '../ngrx_register';
import { HttpClient, HttpXhrBackend, HttpHandler, XhrFactory } from '@angular/common/http';
import { ProductsProvided, ScenarioChosen, ClickRunProcess } from '../wps/wps.actions';
import { getProcessStates, getProducts, getProduct, getCurrentScenarioWpsState } from '../wps/wps.selectors';
import {
  QuakeLedger, inputBoundingbox, mmin, mmax, zmin, zmax, p,
  etype, tlon, tlat, selectedEqs
} from './chile/quakeledger';
import { debounceTime, map, filter, switchMap } from 'rxjs/operators';
import { Product, Process } from '../wps/wps.datatypes';
import { schema, ExposureModel, lonmin, lonmax, latmin, latmax, querymode, assettype, selectedRowsXml } from './chile/assetmaster';
import { assetcategory, losscategory, taxonomies, VulnerabilityModel, buildingAndDamageClassesRef } from './chile/modelProp';
import { Observable } from 'rxjs';
import { Shakyground, shakemapWmsOutput, shakemapRefOutput } from './chile/shakyground';
import { selectedEq, EqSelection, userinputSelectedEq } from './chile/eqselection';


/**
 * These are not actual unit-tests, but much rather integration tests.
 * Here we test if all services return the expected results.
 * This requires actual http-calls to those services. We do *not* mock a backend.
 * While you could argue that this is not the purpose of a unit-test, we take this liberty
 * to easily check if the backend is healthy.
 */

class MyXhrFactory extends XhrFactory {
  build(): XMLHttpRequest {
    return new XMLHttpRequest();
  }
}

class TestHttpClient extends HttpClient {
  constructor() {
    super(new HttpXhrBackend(new MyXhrFactory()))
  }
}

fdescribe('WPS-service integration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useClass: TestHttpClient }
      ],
      imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
      ],
    });
  });

  const completeProductStore: Product[] = [];

  it('EQ-service should work as expected', (done) => {

    const inputs = [
      inputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat
    ].map(i => {
      return {
        ...i,
        value: i.description.defaultValue
      };
    });

    const outputs = [
      selectedEqs
    ];

    expectOutputsToBeSet('c1', QuakeLedger, inputs, outputs, completeProductStore).subscribe(consecutiveProducts => done());
  }, 10000);

  it('vulnerability should work as expected', (done) => {

    const inputs = [
      schema, assetcategory, losscategory, taxonomies
    ].map(inp => {
      return {
        ... inp,
        value: inp.description.defaultValue
      };
    });

    const outputs = [
      buildingAndDamageClassesRef
    ];

    expectOutputsToBeSet('c1', VulnerabilityModel, inputs, outputs, completeProductStore).subscribe(consecutiveProducts => done());
  }, 10000);

  it('Exposure-model should work as expected', (done) => {

    const inputs = [
      lonmin, lonmax, latmin, latmax, querymode, schema, assettype
    ].map(i => {
      return {
        ...i,
        value: i.description.defaultValue
      };
    });

    const outputs = [
      selectedRowsXml
    ];

    expectOutputsToBeSet('c1', ExposureModel, inputs, outputs, completeProductStore).subscribe(consecutiveProducts => done());
  }, 10000);

  it('EQ-simulation should work as expected', (done) => {

    const inputs = [
      inputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat
    ].map(i => {
      return {
        ...i,
        value: i.description.defaultValue
      };
    });

    const outputs = [
      selectedEqs
    ];

    expectOutputsToBeSet('c1', QuakeLedger, inputs, outputs, completeProductStore).pipe(

      switchMap((allProds: Product[]) => {

        const newInputs = [{
          ... userinputSelectedEq
        }];

        const newOutpus = [{
          ...selectedEq
        }];

        return expectOutputsToBeSet('c1', EqSelection, newInputs, newOutpus, allProds);

      }),

      switchMap((allProds: Product[]) => {

        const se = allProds.find(pr => pr.uid === 'user_selectedRow');

        const newInputs = [{
          ...se,
          value: se.value
        }];

        const newOutpus = [
          shakemapWmsOutput,
          shakemapRefOutput
        ];

        return expectOutputsToBeSet('c1', Shakyground, newInputs, newOutpus, allProds);
      })

    ).subscribe(out => done());


  }, 30000);

});



function expectOutputsToBeSet(
  scenario: string, process: Process, inputs: Product[], outputs: Product[], consecutiveProducts: Product[]): Observable<Product[]> {

  const store: Store<State> = TestBed.get(Store);
  store.dispatch(new ScenarioChosen({ scenario }));

  consecutiveProducts = consecutiveProducts.concat(inputs);

  store.dispatch(new ClickRunProcess({
    productsProvided: consecutiveProducts,
    process: QuakeLedger
  }));

  const outputIds = outputs.map(o => o.uid);

  return store.pipe(

    // get state
    select(getCurrentScenarioWpsState),

    // wait until outputs have been delivered
    filter((scenarioData) => {
      const products = scenarioData.productValues;
      for (const product of products) {
        if (outputIds.includes(product.uid)) {
          if (product.value === undefined) {
            return false;
          }
        }
      }
      return true;
    }),

    // test that outputs are all set
    map(scenarioData => {
      const products = scenarioData.productValues;
      for (const product of products) {
        // expect that every output product has been set to some value.
        if (outputIds.includes(product.uid)) {
          expect(product.value).toBeDefined();
        }
      }
      // store all set products in the inter-test-product-store.
      consecutiveProducts = products.filter(prd => prd.value !== undefined);
      return consecutiveProducts;
    })
  );
}
