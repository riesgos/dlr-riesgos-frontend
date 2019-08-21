import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ProductsProvided, ClickRunProcess, RestartingFromProcess } from 'src/app/wps/wps.actions';
import { UserconfigurableWpsDataDescription, isUserconfigurableWpsDataDescription, UserconfigurableWpsData, isUserconfigurableWpsData, FeatureSelectUconfWD, isStringSelectableParameter } from '../userconfigurable_wpsdata';
import { Process, Product, ProductDescription, ProcessId, WpsProcess } from 'src/app/wps/wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public-api';
import { getInputsForProcess, convertWpsDataToProds } from 'src/app/wps/wps.selectors';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { WizardableProcess } from '../wizardable_processes';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardPageComponent implements OnInit {

  @Input() process: WpsProcess & WizardableProcess;
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

  onSubmitClicked() {
    for (const parameter of this._parameters) {
      if (parameter.value == null) {
        if (parameter.description.defaultValue) {
          parameter.value = parameter.description.defaultValue;
        } else if (isStringSelectableParameter(parameter)) {
          parameter.value = parameter.description.options[0];
        }
      }
    }
    this.store.dispatch(new ClickRunProcess({productsProvided: convertWpsDataToProds(this._parameters), process: this.process }));
  }

  onReconfigureClicked() {
    this.store.dispatch(new RestartingFromProcess({process: this.process}));
  }


}
