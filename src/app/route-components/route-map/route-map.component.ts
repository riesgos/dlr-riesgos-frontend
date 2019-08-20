import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { LayersService } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';
import { MapOlService } from '@ukis/map-ol';
import { Store } from '@ngrx/store';
import { reducers, effects, State } from 'src/app/ngrx_register';
import { ActivatedRoute } from '@angular/router';
import { ScenarioChosen } from 'src/app/wps/wps.actions';
import { LayerMarshaller } from 'src/app/components/map/layer_marshaller';

@Component({
  selector: 'ukis-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    LayersService,
    MapStateService,
    MapOlService
  ]
})
export class RouteMapComponent implements OnInit {
  @HostBinding('class') class = 'content-container';

  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<State>
  ) { }


  ngOnInit() {
    const scenario = this.activeRoute.snapshot.queryParams['id'] || 'c1';
    console.log(`user just chose scenario ${scenario}`)
    this.store.dispatch(new ScenarioChosen({ scenario: scenario }));
  }

}
