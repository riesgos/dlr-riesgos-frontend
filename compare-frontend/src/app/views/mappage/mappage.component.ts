import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RiesgosState } from 'src/app/state/state';

@Component({
  selector: 'app-mappage',
  templateUrl: './mappage.component.html',
  styleUrls: ['./mappage.component.css']
})
export class MappageComponent {

  constructor(
    private store: Store<{ riesgos: RiesgosState }>,
    private router: Router
  ) {
    this.store.select(state => state.riesgos.currentScenario).subscribe(scn => {
      if (scn === 'none') {
        router.navigate(['/']);
      }
    });
  }
}
