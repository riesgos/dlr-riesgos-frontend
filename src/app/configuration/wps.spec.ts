import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects, State } from '../ngrx_register';
import { HttpClient, HttpXhrBackend, HttpHandler, XhrFactory } from '@angular/common/http';
import { ProductsProvided, ScenarioChosen, ClickRunProcess } from '../wps/wps.actions';
import { getProcessStates, getProducts, getProduct } from '../wps/wps.selectors';
import { QuakeLedger, inputBoundingbox, mmin, mmax, zmin, zmax, p,
    etype, tlon, tlat, selectedEqs } from './chile/quakeledger';
import { debounceTime } from 'rxjs/operators';
import { Product } from '../wps/wps.datatypes';


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
          {provide: HttpClient, useClass: TestHttpClient}
        ],
      imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
      ],
    });
  });

  const consecutiveProducts: Product[] = [];

  it('should be the only test run', () => {
      console.log('I\'ve been called!');
      expect(1).toBeTruthy();
  });

  it('EQ-service should respond as expected', (done) => {
    const store: Store<State> = TestBed.get(Store);

    store.dispatch(new ScenarioChosen({scenario: 'c1'}));

    const products = [
        inputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat
    ];
    const vproducts = products.map(prod => {
        return {
            ...prod,
            value: prod.description.defaultValue
        };
    });

    store.dispatch(new ClickRunProcess({
        productsProvided: vproducts,
        process: QuakeLedger
    }));

    store.pipe(
        select(getProduct, {productId: selectedEqs.uid}),
        debounceTime(9000)
    ).subscribe(product => {
        expect(product.value).toBeTruthy();
        done();
    });


  }, 10000);
});
