import { Component, OnInit, ChangeDetectionStrategy, HostBinding, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ActivatedRoute } from '@angular/router';
import { ScenarioChosen } from 'src/app/wps/wps.actions';
import { LayersService } from '@ukis/services-layers';
import { MapOlService } from '@ukis/map-ol';
import { MapStateService } from '@ukis/services-map-state';


@Component({
  selector: 'ukis-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // providers: [
  //     MapOlService, LayersService, MapStateService
  // ]
})
export class RouteMapComponent implements OnInit {
  @HostBinding('class') class = 'content-container';

  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<State>
  ) { }

  private _collapsedLayerControl = false;
  private _collapsedConfigurationWizard = false;

  get collapsedLayerControl(): boolean {
    return this._collapsedLayerControl;
  }
  set collapsedLayerControl(value: boolean) {
    console.log('set expandedLayerContro',value)
    this._collapsedLayerControl = value;
  }

  get collapsedConfigurationWizard(): boolean {
    return this._collapsedConfigurationWizard;
  }
  set collapsedConfigurationWizard(value: boolean) {
    console.log('set collapsedConfigurationWizard',value)
    this._collapsedConfigurationWizard = value;
  }


  ngOnInit() {
    const scenario = this.activeRoute.snapshot.queryParams['id'] || 'c1';
    this.store.dispatch(new ScenarioChosen({ scenario }));
  }

}
