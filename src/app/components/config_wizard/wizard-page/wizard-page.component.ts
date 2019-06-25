import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ProductsProvided } from 'src/app/wps/control/wps.actions';
import { Process } from 'src/app/wps/control/workflowcontrol';
import { getStateForProcess } from 'src/app/wps/control/wps.selectors';
import { isUserconfigurableWpsData, UserconfigurableWpsData } from '../userconfigurable_wpsdata';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css']
})
export class WizardPageComponent implements OnInit {

  @Input() process: Process;
  parameters: UserconfigurableWpsData[];
  processState$ = this.store.pipe(
    select(getStateForProcess, {id: this.process.id})
  );

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
