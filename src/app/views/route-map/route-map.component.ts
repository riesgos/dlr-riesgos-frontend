import { Component, OnInit, HostBinding, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ActivatedRoute } from '@angular/router';
import { ScenarioChosen } from 'src/app/riesgos/riesgos.actions';
import { LayersService } from '@dlr-eoc/services-layers';
import { MapOlService } from '@dlr-eoc/map-ol';
import { MapStateService } from '@dlr-eoc/services-map-state';
import { LayerMarshaller } from 'src/app/components/map/layer_marshaller';


@Component({
  selector: 'ukis-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss'],
  /**
   * Note that the services LayersService, MapStateService and MapOlService
   * must be provided here, in the route-map component, not the map component.
   * Otherwise, the map and the layercontrol each get a *different* instance of these services,
   * which causes different layers to be displayed in these two different subcomponents of the route-map.
   */
  providers: [LayersService, MapStateService, MapOlService, LayerMarshaller]
})
export class RouteMapComponent implements OnInit {
  @HostBinding('class') class = 'content-container';

  public nav = {
    left: {
      width: 19,
      minWidth: 12,
      maxWidth: 40,
      unit: 'rem'
    },
    right: {
      width: 12,
      minWidth: 12,
      maxWidth: 24,
      unit: 'rem'
    }
  };

  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<State>,
    private olSvc: MapOlService
  ) { }

  private _collapsedLayerControl = false;
  private _collapsedConfigurationWizard = false;

  get collapsedLayerControl(): boolean {
    return this._collapsedLayerControl;
  }
  set collapsedLayerControl(value: boolean) {
    this._collapsedLayerControl = value;
  }

  get collapsedConfigurationWizard(): boolean {
    return this._collapsedConfigurationWizard;
  }
  set collapsedConfigurationWizard(value: boolean) {
    this._collapsedConfigurationWizard = value;
  }

  ngOnInit() {
    const scenario = this.activeRoute.snapshot.queryParams['id'] || 'c1';
    this.olSvc.setProjection('EPSG:4326');
    this.store.dispatch(new ScenarioChosen({ scenario }));
  }
}
