import { Map as OlMap, Overlay, View } from 'ol';
import { applyStyle } from 'ol-mapbox-style';
import MVT from 'ol/format/MVT';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import OSM from 'ol/source/OSM';
import VectorTile from 'ol/source/VectorTile';
import { createXYZ } from 'ol/tilegrid';
import { Partition, ScenarioName } from 'src/app/state/state';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import greyScale from '../data/open-map-style.Positron.json';
import { MapService, MapState } from '../map.service';
import BaseEvent from 'ol/events/Event';
import { Subscription } from 'rxjs';
import { maybeArraysEqual } from 'src/app/state/helpers';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('popup') popup!: ElementRef<HTMLDivElement>;
  @ViewChild('popupBody', { read: ViewContainerRef, static: true }) popupContainer!: ViewContainerRef;

  private baseLayers: Layer[] = getBaseLayers();
  private overlay = new Overlay({});
  private map!: OlMap;

  private olSubs: Map<'moveend' | 'click', (event: BaseEvent | Event) => unknown> = new Map();
  private subs: Subscription[] = [];

  constructor(
    private mapSvc: MapService,
    private zone: NgZone
  ) {
      // no need to run this outside of zone
      this.map = new OlMap({
        layers: this.baseLayers,
        view: new View({
          projection: 'EPSG:4326',
          center: [0, 0],
          zoom: 0
        }),
        controls: [],
        overlays: [this.overlay]    
      });
  }

  ngOnDestroy(): void {
    this.olSubs.forEach((handler, key) => {
      this.map.un(key as any, handler);
    });
    this.subs.map(s => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    if (this.mapContainer && this.popupContainer) {
  
      // needs to be outside of zone: only place where ol attaches to event-handlers
      this.zone.runOutsideAngular(() => {
        this.map.setTarget(this.mapContainer.nativeElement);
      });
      this.overlay.setElement(this.popup.nativeElement);


      /*********************************************************************
       *   SENDING OUT EVENTS TO STATE-MGMT
       *********************************************************************/

      const moveHandler = (evt: BaseEvent | Event) => {
        const zoom = this.map.getView().getZoom()!;
        const centerCoord = this.map.getView().getCenter()!;
        const center = [centerCoord[0], centerCoord[1]];
        
        // center == [0, 0]: comes from map-initialization. no need to handle this.
        if (center[0] === 0 && center[1] === 0) return;

        console.log(`map moved manually to ${center}`)
        this.mapSvc.mapMove(this.scenario, this.partition, zoom, center);
      };
      
      const clickHandler = (evt: any) => {
        const location = evt.coordinate;
        this.mapSvc.mapClick(this.scenario, this.partition, location);
      }

      // no need to run this outside of zone
      this.map.on('moveend', moveHandler);
      this.map.on('click', clickHandler);

      this.olSubs.set('moveend', moveHandler);
      this.olSubs.set('click', clickHandler);

      /*********************************************************************
       *   HANDLING EVENTS FROM STATE-MGMT
       *********************************************************************/

      const mapStateSub = this.mapSvc.getMapState(this.scenario, this.partition).subscribe(mapState => {
console.log(`got map-state ${mapState.center}`)
          this.handleMove(mapState);
          this.handleLayers(mapState);
          this.handleClick(mapState);
      });
      this.subs.push(mapStateSub);
    }
  }

  public closePopup() {
    this.mapSvc.closePopup(this.scenario, this.partition);
  }


  private handleMove(state: MapState) {
console.log(`handling move to ${state.center}`)
    if (
      this.map.getView().getZoom() !== state.zoom ||
      this.map.getView().getCenter()![0] !== state.center[0] ||
      this.map.getView().getCenter()![1] !== state.center[1]
    ) {
      this.map.getView().animate({
        center: state.center,
        zoom: state.zoom,
        duration: 100,
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


  private _lastClickLocation: number[] | undefined;
  private handleClick(mapState: MapState) {
    
    const location = mapState.clickLocation;
    this.overlay.setPosition(location); 

    if (!location || maybeArraysEqual(this._lastClickLocation, location)) {
      this._lastClickLocation = location;
      return;
    } else {
      this._lastClickLocation = location;
    }

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
        break;
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


function getBaseLayers() {
  const osmBase = new TileLayer({
    source: new OSM()
  });

  // const vectorTileBase = new VectorTileLayer({
  //   declutter: true,
  //   source: new VectorTile({
  //       format: new MVT(),
  //       tileGrid: createXYZ({
  //           minZoom: 0,
  //           maxZoom: 12
  //       }),
  //       url: 'https://{a-d}.tiles.geoservice.dlr.de/service/tms/1.0.0/planet_eoc@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf?flipy=true'
  //   }),
  //   renderMode: 'hybrid'
  // });
  // applyStyle(vectorTileBase, greyScale, 'planet0-12');

  return [osmBase];
}