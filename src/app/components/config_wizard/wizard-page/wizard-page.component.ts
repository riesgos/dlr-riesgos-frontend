import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ProductsProvided } from 'src/app/wps/control/wps.actions';
import { isUserconfigurableWpsData, UserconfigurableWpsData } from '../userconfigurable_wpsdata';
import { ProcessDescription } from 'src/app/wps/configuration/configurationProvider';
import { Observable } from 'rxjs';
import { ProcessState } from 'src/app/wps/control/process';
import { getProcessStates } from 'src/app/wps/control/wps.selectors';
import { map } from 'rxjs/operators';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css']
})
export class WizardPageComponent implements OnInit {

  @Input() processDescription: ProcessDescription;
  state$: Observable<ProcessState | undefined>;
  parameters: UserconfigurableWpsData[];


  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.parameters = this.processDescription.requiredProducts
      .filter(descr => isUserconfigurableWpsData(descr))
      .map(descr => descr as UserconfigurableWpsData);

    this.state$ = this.store.pipe(
      select(getProcessStates),
      map(states => states.get(this.processDescription.id))
    );
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
