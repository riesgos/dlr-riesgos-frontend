import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ClickRunProcess, RestartingFromProcess } from 'src/app/riesgos/riesgos.actions';
import { UserconfigurableProduct, isUserconfigurableProduct, isStringSelectableProduct } from '../userconfigurable_wpsdata';
import { Product, WpsProcess } from 'src/app/riesgos/riesgos.datatypes';
import { getInputsForProcess } from 'src/app/riesgos/riesgos.selectors';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { WizardableProcess } from '../wizardable_processes';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css']
})
export class WizardPageComponent implements OnInit {

  @Input() process: WpsProcess & WizardableProcess;
  parameters$: Observable<UserconfigurableProduct[]>;


  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.parameters$ = this.store.pipe(
      select(getInputsForProcess, {processId: this.process.uid}),
      map((inputs: Product[]) =>  inputs.filter(i => isUserconfigurableProduct(i)) as UserconfigurableProduct[] )
    );
  }

  onReconfigureClicked() {
    this.store.dispatch(new RestartingFromProcess({process: this.process}));
  }


}
