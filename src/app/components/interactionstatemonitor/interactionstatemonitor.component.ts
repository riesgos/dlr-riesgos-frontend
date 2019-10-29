import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InteractionState } from 'src/app/interactions/interactions.state';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-interactionstatemonitor',
  templateUrl: './interactionstatemonitor.component.html',
  styleUrls: ['./interactionstatemonitor.component.scss']
})
export class InteractionstatemonitorComponent implements OnInit {

  public message$: Observable<string>;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.message$ = this.store.pipe(
      select('interactionState'),
      map((currentInteractionState: InteractionState) => {
        console.log('new mode: ', currentInteractionState.mode);
        switch (currentInteractionState.mode) {
          case 'normal':
            return '';
          case 'featureselection':
            return 'you can now select a feature on the map';
          case 'bbox':
            return 'you can now drag a box on the map';
        }
      })
    );
  }

}
