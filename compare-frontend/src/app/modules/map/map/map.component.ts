import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Partition, ScenarioName } from 'src/app/state/state';
import { MapService, MapState } from '../map.service';
import Layer from 'ol/layer/Layer';

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

  private baseLayers: Layer[] = [new TileLayer({
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

      this.mapSvc.getMapState(this.scenario, this.partition).subscribe(mapState => {
          this.handleMove(mapState);
          this.handleLayers(mapState);
          this.handleClick(mapState);
      });
    }
  }

  public closePopup() {
    this.mapSvc.closePopup(this.scenario, this.partition);
  }


  private handleMove(state: MapState) {
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

  private handleLayers(mapState: MapState) {
    const layers = mapState.layerComposites.map(c => {
      const id = c.id;
      const layer = c.layer;
      layer.set("compositeId", id);
      return layer;
    });
    this.map.setLayers([...this.baseLayers, ...layers]);
    // @TODO: set visibility from last time
  }

  private handleClick(mapState: MapState) {
    const location = mapState.clickLocation;
    this.overlay.setPosition(location);
    if (!location) return;

    const pixel = this.map.getPixelFromCoordinate(location);
    const features = this.map.getFeaturesAtPixel(pixel, {
      layerFilter: layer => !this.baseLayers.includes(layer)
    });

    // popup
    for (const composite of mapState.layerComposites) {
      if (composite.visible) {
        const popup = composite.popup(location, features);
        if (!popup) return;
        const { component, args } = popup;
        this.popupContainer.clear();
        const componentRef = this.popupContainer.createComponent(component, { index: 0 });
        for (const key in args) {
          componentRef.instance[key] = args[key];
        }
        return;
      }
    }

    // further click handling
    for (const composite of mapState.layerComposites) {
      if (composite.visible) {
        composite.onClick(location, features);
      }
    }
  }

}
