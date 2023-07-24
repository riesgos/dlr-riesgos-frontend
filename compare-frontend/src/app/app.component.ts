import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RiesgosState } from './state/state';
import { Observable, map } from 'rxjs';
import { RuleSetName } from './state/rules';
import { movingBackToMenu } from './state/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {


  public ruleSet$: Observable<RuleSetName | 'none'>;
  
  constructor(private router: Router, private store: Store<{riesgos: RiesgosState}>) {
    this.ruleSet$ = this.store.select(state => state.riesgos.rules).pipe(
      map(v => v === undefined ? 'none' : v)
    );
  }

  clickOnModes() {
    this.store.dispatch(movingBackToMenu());
    this.router.navigateByUrl("/");
  }

}
