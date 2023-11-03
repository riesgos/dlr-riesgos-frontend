import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { RiesgosState } from 'src/app/state/state';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent {


  public scenario$ = this.store.select(state => state.riesgos.currentScenario);

  constructor(private store: Store<{ riesgos: RiesgosState }>) {}
}
