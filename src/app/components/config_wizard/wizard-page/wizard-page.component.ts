import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ProductsProvided, ProcessStarted, ClickRunProcess } from 'src/app/wps/wps.actions';
import { UserconfigurableWpsDataDescription, isUserconfigurableWpsDataDescription } from '../userconfigurable_wpsdata';
import { Process, Product } from 'src/app/wps/wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public_api';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardPageComponent implements OnInit {

  @Input() process: Process;
  parameters: UserconfigurableWpsDataDescription[];


  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.parameters = this.process.requiredProducts
      .filter(descr => isUserconfigurableWpsDataDescription(descr))
      .map(descr => descr as UserconfigurableWpsDataDescription);
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

  private getDescription(id: string): UserconfigurableWpsDataDescription {
    for(let para of this.parameters) {
      if(para.id == id) return para;
    }
    throw new Error(`could not find a configuration with id ${id}`);
  }


}
