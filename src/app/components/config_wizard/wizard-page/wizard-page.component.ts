import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ProductsProvided, ClickRunProcess, RestartingFromProcess } from 'src/app/wps/wps.actions';
import { UserconfigurableWpsDataDescription, isUserconfigurableWpsDataDescription, UserconfigurableWpsData, isUserconfigurableWpsData } from '../userconfigurable_wpsdata';
import { Process, Product, ProductDescription } from 'src/app/wps/wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public_api';
import { getInputsForProcess } from 'src/app/wps/wps.selectors';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardPageComponent implements OnInit {

  @Input() process: Process;
  parameters$: Observable<UserconfigurableWpsData[]>;
  private _parameters: UserconfigurableWpsData[];


  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.parameters$ = this.store.pipe(
      select(getInputsForProcess, {processId: this.process.id}), 
      map((inputs: Product[]) =>  inputs.filter(i => isUserconfigurableWpsData(i)) as UserconfigurableWpsData[] ),
      tap((parameters: UserconfigurableWpsData[]) => this._parameters = parameters)
    );
  }

  onSubmit(formData) {

    let products: Product[] = [];
    for (let key in formData) {

      let val = formData[key];
      let descr = this.getDescription(key);
      
      products.push({
        description: descr, 
        value: val
      });
    }

    this.store.dispatch(new ClickRunProcess({productsProvided: products, process: this.process }));
  }

  onReconfigureClicked () {
    this.store.dispatch(new RestartingFromProcess({process: this.process}));
  }


  private getDescription(id: ProductId): ProductDescription {
    const product = this._parameters.find(p => p.description.id == id);
    if(!product) throw new Error(`No such product ${id} on the wizard-page for process ${this.process.id}`);
    return product.description;
  }

}
