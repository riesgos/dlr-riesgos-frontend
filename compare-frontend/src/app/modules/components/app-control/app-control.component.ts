import { Component, Input, OnInit } from '@angular/core';
import { WizardService } from '../../wizard/wizard.service';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { RiesgosState } from 'src/app/state/state';
import { getRules } from 'src/app/state/rules';

@Component({
  selector: 'app-app-control',
  templateUrl: './app-control.component.html',
  styleUrls: ['./app-control.component.css']
})
export class AppControlComponent implements OnInit {

  @Input() showLink = true;
  @Input() showFix = true;
  viewsLinked$ = new BehaviorSubject<boolean>(false);
  zoomingToStep$ = new BehaviorSubject<boolean>(false);

  constructor(
    private wizardSvc: WizardService,
    private store: Store<{riesgos: RiesgosState}>
  ) {}

  ngOnInit(): void {
    // this.store.select(s => getRules(s.riesgos.rules).mirrorMove).subscribe(this.viewsLinked$);
    // this.store.select(s => getRules(s.riesgos.rules).mi).subscribe(this.zoomingToStep$);
  }

  linkClicked($event: MouseEvent) {
    // this.store.dispatch({type: 'linkViews', link: !this.viewsLinked$.value});
  }

  zoomClicked($event: MouseEvent) {
    // this.store.dispatch({type: 'zoomToStep', link: !this.zoomingToStep$.value});
  }

}
