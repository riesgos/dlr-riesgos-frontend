import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Partition, ScenarioName } from 'src/app/state/state';
import { MapService, MapState } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('popup') popup!: ElementRef<HTMLDivElement>;
  @ViewChild('popupBody', { read: ViewContainerRef, static: true }) popupContainer!: ViewContainerRef;

  private baseLayers = [new TileLayer({
    source: new OSM()
  })];
  private overlay = new Overlay({});
  private map: Map = new Map({
    layers: this.baseLayers,
    view: new View({
      projection: 'EPSG:4326', // 'EPSG:900913',
      center: [-50, -20],
      zoom: 4
    }),
    controls: [],
    overlays: [this.overlay]    
  });

  constructor(
    private mapSvc: MapService
  ) {}

  ngAfterViewInit(): void {
    if (this.mapContainer && this.popupContainer) {
  
      this.map.setTarget(this.mapContainer.nativeElement);
      this.overlay.setElement(this.popup.nativeElement);


      /*********************************************************************
       *   SENDING OUT EVENTS TO STATE-MGMT
       *********************************************************************/

      this.map.on('moveend', (evt) => {
        const zoom = this.map.getView().getZoom()!;
        const centerCoord = this.map.getView().getCenter()!;
        const center = [centerCoord[0], centerCoord[1]];
        this.mapSvc.mapMove(this.scenario, this.partition, zoom, center);
      });

      this.map.on('click', (evt) => {
        const location = evt.coordinate;
        this.mapSvc.mapClick(this.scenario, this.partition, location);
      });



      /*********************************************************************
       *   HANDLING EVENTS FROM STATE-MGMT
       *********************************************************************/

      this.mapSvc.getMapState(this.scenario, this.partition).pipe(
        ).subscribe(mapState => {
          this.updatePosition(mapState);
          this.setLayers(mapState);
          this.setOverlay(mapState);
      });
    }
  }


  private updatePosition(state: MapState) {
    if (
      this.map.getView().getZoom() !== state.zoom ||
      this.map.getView().getCenter()![0] !== state.center[0] ||
      this.map.getView().getCenter()![1] !== state.center[1]
    ) {
      this.map.getView().animate({
        center: state.center,
        zoom: state.zoom,
        duration: 100
      })
    }
  }

  private setLayers(mapState: MapState) {
    // @TODO: set visibility from last time
    const layers = mapState.layers.map(l => l.layer);
    this.map.setLayers([...this.baseLayers, ...layers]);
  }

  private setOverlay(mapState: MapState) {
    this.overlay.setPosition(mapState.clickLocation);
    if (!mapState.clickLocation) return;
    for (const layer of mapState.layers) {
      if (layer.visible) {
        // const { component, args } = layer.popup;
        // const componentRef = this.popupContainer.createComponent(component);
        //   for (const key in args) {
        //     componentRef.instance[key] = args[key];
        //   }
        return;
      }
    }
  }

}
