import { Component, Input, OnInit } from '@angular/core';
import { WizardService } from '../../wizard/wizard.service';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter } from 'rxjs';
import { RiesgosState } from 'src/app/state/state';
import * as Actions from 'src/app/state/actions';

@Component({
  selector: 'app-app-control',
  templateUrl: './app-control.component.html',
  styleUrls: ['./app-control.component.css']
})
export class AppControlComponent implements OnInit {

  @Input() showLink = true;
  @Input() showFix = true;
  partitionsLinked$ = new BehaviorSubject<boolean>(false);
  zoomingToStep$ = new BehaviorSubject<boolean>(false);

  constructor(
    private wizardSvc: WizardService,
    private store: Store<{riesgos: RiesgosState}>
  ) {}

  ngOnInit(): void {
    this.store.select(s => s.riesgos.userChoiceLinkMapViews).subscribe(this.partitionsLinked$);
    this.store.select(s => s.riesgos.scenarioData['PeruShort']?.left?.zoomToSelectedStep || false).subscribe(this.zoomingToStep$);
  }

  linkClicked($event: MouseEvent) {
    this.store.dispatch(Actions.setLinkMapViews({linkMapViews: !this.partitionsLinked$.value}))
  }

  zoomClicked($event: MouseEvent) {
    this.store.dispatch(Actions.setZoomToStep({zoomToStep: !this.zoomingToStep$.value}));
  }

}
