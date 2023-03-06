import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RiesgosState } from 'src/app/state/state';
import * as AppActions from '../../state/actions';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.css']
})
export class StartpageComponent implements OnInit {

  public studyAreas$ = this.store.select((state) => {
    console.log("Got metadata: ", state.metaData)
    return state.metaData
  })

  constructor(private store: Store<RiesgosState>) {}

  ngOnInit(): void {
    this.store.dispatch(AppActions.scenarioLoadStart());
  }

}
