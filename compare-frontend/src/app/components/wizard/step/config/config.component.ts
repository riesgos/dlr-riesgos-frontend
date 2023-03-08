import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RiesgosState, RiesgosStep } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  @Input() step!: RiesgosStep["step"];
  public formGroup: FormGroup = new FormGroup({});

  constructor(private store: Store<{ riesgos: RiesgosState }>) {}

  public execute() {
    this.store.dispatch(AppActions.stepConfig({ config: undefined }));
  }
}
