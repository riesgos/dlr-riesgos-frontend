import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ProductsProvided } from 'src/app/wps/control/wps.actions';
import { isUserconfigurableWpsData, UserconfigurableWpsData } from '../userconfigurable_wpsdata';
import { Process } from 'src/app/wps/control/process';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css']
})
export class WizardPageComponent implements OnInit {

  @Input() process: Process;
  parameters: UserconfigurableWpsData[];


  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.parameters = this.process.requiredProducts
      .filter(descr => isUserconfigurableWpsData(descr))
      .map(descr => descr as UserconfigurableWpsData);
  }

  onSubmit(products: UserconfigurableWpsData[]) {
    this.store.dispatch(new ProductsProvided({products: products}));
  }

  onNextClicked() {
    // @TODO: store.emmit(new NextClicked) ? 
    //this.nextClicked.emit(this.process.processId());
  } 

  onReconfigureClicked () {
    // @TODO: store.emmit(new Reconfigure) ? 
    // this.reconfigureClicked.emit(this.process.processId());
  }

}
