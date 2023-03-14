import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Partition, RiesgosState, ScenarioName } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;
  private map: Map = new Map({
    layers: [new TileLayer({
      source: new OSM()
    })],
    view: new View({
      projection: 'EPSG:4326', // 'EPSG:900913',
      center: [-50, -20],
      zoom: 4
    }),
    controls: []
  });;

  constructor(private store: Store<{ riesgos: RiesgosState }>) {}

  ngAfterViewInit(): void {
    if (this.mapContainer) {
  
      this.map.setTarget(this.mapContainer.nativeElement);

      this.map.on('moveend', (evt) => {
        const zoom = this.map.getView().getZoom()!;
        const centerCoord = this.map.getView().getCenter()!;
        const center = [centerCoord[0], centerCoord[1]];
        this.store.dispatch(AppActions.mapMove({ scenario: this.scenario, partition: this.partition, zoom, center }))
      });

      this.store.select(state => state.riesgos.scenarioData[this.scenario]![this.partition]).subscribe(state => {
        this.map.getView().setZoom(state.map.zoom);
        this.map.getView().setCenter(state.map.center);
      });
    }
  }

}
