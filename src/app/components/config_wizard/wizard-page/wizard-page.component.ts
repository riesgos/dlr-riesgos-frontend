import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ClickRunProcess, RestartingFromProcess } from 'src/app/wps/wps.actions';
import { UserconfigurableProduct, isUserconfigurableProduct, isStringSelectableProduct } from '../userconfigurable_wpsdata';
import { Product, WpsProcess } from 'src/app/wps/wps.datatypes';
import { getInputsForProcess } from 'src/app/wps/wps.selectors';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { WizardableProcess } from '../wizardable_processes';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardPageComponent implements OnInit {

  @Input() process: WpsProcess & WizardableProcess;
  parameters$: Observable<UserconfigurableProduct[]>;
  private _parameters: UserconfigurableProduct[];


  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.parameters$ = this.store.pipe(
      select(getInputsForProcess, {processId: this.process.id}),
      map((inputs: Product[]) =>  inputs.filter(i => isUserconfigurableProduct(i)) as UserconfigurableProduct[] ),
      tap((parameters: UserconfigurableProduct[]) => this._parameters = parameters)
    );
  }

  onSubmitClicked() {
    for (let i = 0; i < this._parameters.length; i++) {
      if (this._parameters[i].value === null) {
        if (this._parameters[i].description.defaultValue) {
          this._parameters[i] = {
            ...this._parameters[i],
            value: this._parameters[i].description.defaultValue
          };
        }
      }
    }
    this.store.dispatch(new ClickRunProcess({productsProvided: this._parameters, process: this.process }));
  }

  onReconfigureClicked() {
    this.store.dispatch(new RestartingFromProcess({process: this.process}));
  }


}
