import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RiesgosState, ScenarioNameOrNone } from './state/state';
import { Observable, map, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  public currentScenario$: Observable<ScenarioNameOrNone>;
  
  constructor(private router: Router, private store: Store<RiesgosState>) {
    this.currentScenario$ = this.store.select(state => state.currentScenario).pipe(
      map(v => v === undefined ? 'none' : v),
      tap(v => console.log(v))
    );
  }
}
