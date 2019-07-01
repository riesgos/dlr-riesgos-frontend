import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ProductsProvided, ProcessStarted, ClickRunProcess } from 'src/app/wps/wps.actions';
import { UserconfigurableWpsDataDescription, isUserconfigurableWpsDataDescription, UserconfigurableWpsData, isUserconfigurableWpsData } from '../userconfigurable_wpsdata';
import { Process, Product, ProductDescription } from 'src/app/wps/wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public_api';
import { getInputsForProcess } from 'src/app/wps/wps.selectors';
import { map } from 'rxjs/operators';
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


  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.parameters$ = this.store.pipe(
      select(getInputsForProcess, {processId: this.process.id}), 
      map((inputs: Product[]) =>  inputs.filter(i => isUserconfigurableWpsData(i)) as UserconfigurableWpsData[] )
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

    this.store.dispatch(new ClickRunProcess({productsProvided: products, process: this.process}));
  }

  onNextClicked() {
    // @TODO: store.emmit(new NextClicked) ? 
    //this.nextClicked.emit(this.process.processId());
  } 

  onReconfigureClicked () {
    // @TODO: store.emmit(new Reconfigure) ? 
    // this.reconfigureClicked.emit(this.process.processId());
  }

  private getDescription(key: ProductId): ProductDescription {
    const d =  this.process.requiredProducts.find(prodD => prodD.id == key);
    if(d === undefined) throw new Error(`product ${key} not known within requirements of process ${this.process.id}`);
    return d;
  }

}
