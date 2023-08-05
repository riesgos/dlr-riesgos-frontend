import { Map as OlMap, Overlay, View } from 'ol';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import MVT from "ol/format/MVT";
import { Partition, ScenarioName } from 'src/app/state/state';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MapService, MapState } from '../map.service';
import BaseEvent from 'ol/events/Event';
import { Subscription, firstValueFrom } from 'rxjs';
import { maybeArraysEqual } from 'src/app/state/helpers';
import { FeatureLike } from 'ol/Feature';
import { TileWMS, VectorTile, XYZ } from 'ol/source';
// import Attribution from 'ol/control/Attribution';
import {defaults} from 'ol/control';
import { HttpClient } from '@angular/common/http';
import VectorTileLayer from 'ol/layer/VectorTile';
import { applyStyle } from 'ol-mapbox-style';
import greyScale from "../data/open-map-style.Positron.json";
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import TileSource from 'ol/source/Tile';
import VectorSource from 'ol/source/Vector';
import { Positioning } from 'ol/Overlay';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  encapsulation: ViewEncapsulation.None
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
    private changeDetector: ChangeDetectorRef,
    private zone: NgZone,
    private http: HttpClient
  ) {
      // no need to run this outside of zone
      this.map = new OlMap({
        layers: this.baseLayers,
        view: new View({
          projection: 'EPSG:4326',
          center: [0, 0],
          zoom: 0
        }),
        controls: defaults({ attribution: true, rotate: false, zoom: false }),
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

        // explicitly inside zone - otherwise issues with ngrx(-devtools) ... wouldn't update selected eq.
        this.zone.run(() => this.mapSvc.mapMove(this.scenario, this.partition, zoom, center));
      };

      const clickHandler = (evt: any) => {

        const location = evt.coordinate;
        const pixel = this.map.getPixelFromCoordinate(location);
        let clickedFeature: { compositeId: string, feature: any } | undefined = undefined;
        this.map.forEachFeatureAtPixel(pixel, (feature, layer, geometry) => {
          clickedFeature = { compositeId: layer.get("compositeId"), feature };
          return true;
        });

        this.zone.run(() => this.mapSvc.mapClick(this.scenario, this.partition, location, clickedFeature));
      }

      // no need to run this outside of zone
      this.map.on('moveend', moveHandler);
      this.map.on('click', clickHandler);

      this.olSubs.set('moveend', moveHandler);
      this.olSubs.set('click', clickHandler);

      /*********************************************************************
       *   HANDLING EVENTS FROM STATE-MGMT
       *********************************************************************/

      const mapStateSub = this.mapSvc.getMapState(this.scenario, this.partition).subscribe(async mapState => {
          this.handleMove(mapState);
          this.handleLayers(mapState);
          setTimeout(async () => await this.handleClick(mapState), 10); // allowing a little time for layers to be drawn to map before handling this.
      });
      this.subs.push(mapStateSub);
    }
  }

  public closePopup() {
    this.zone.run(() => this.mapSvc.closePopup(this.scenario, this.partition));
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
        duration: 100,
      })
    }
  }

  private handleLayers(mapState: MapState) {

    const oldLayers = this.map.getAllLayers();

    const newLayers = mapState.layerComposites.map(c => {
      const id = c.id;
      const layer = c.layer;
      layer.set("compositeId", id);
      if (c.opacity) layer.setOpacity(c.opacity);
      layer.setVisible(c.visible);
      return layer;
    });

    const newLayerIds = newLayers.map(nl => nl.get("compositeId"));
    newLayerIds.push("baseLayer");
    const oldLayerIds = oldLayers.map(nl => nl.get("compositeId"));

    const toRemove = oldLayers.filter(ol => !newLayerIds.includes(ol.get("compositeId")));
    const toUpdate = newLayers.filter(nl =>  oldLayerIds.includes(nl.get("compositeId")));
    const toAdd    = newLayers.filter(nl => !oldLayerIds.includes(nl.get("compositeId")));

    for (const layer of toRemove) {
      this.map.removeLayer(layer);
    }

    for (const layer of toUpdate) {
      const oldLayer = oldLayers.find(l => l.get("compositeId") === layer.get("compositeId"));
      if (!oldLayer) this.map.addLayer(layer);
      else {
        if (this.different(oldLayer, layer)) {
          // making sure we inject the updated layer at the same position as the old layer
          const oldIndex = this.map.getAllLayers().map((l, i) => [l.get("compositeId"), i]).find(([compId, i]) => compId === layer.get("compositeId"));
          this.map.removeLayer(oldLayer);
          if (oldIndex) {
            this.map.getLayers().insertAt(oldIndex[1], layer);
          } else {
            // if (layer.getSource() instanceof TileWMS) (layer.getSource() as TileWMS).crossOrigin = 'anonymous'
            this.map.addLayer(layer);
          }
        }
      }
    }

    for (const layer of toAdd) {
      this.map.addLayer(layer);
    }

  }

  private different(oldLayer: Layer, newLayer: Layer): boolean {
    // return true;  // I think its cheaper to just replace the layer always than to compare the data-content of the layers
    if (oldLayer.getOpacity() !== newLayer.getOpacity()) return true;
    if (oldLayer.getVisible() !== newLayer.getVisible()) return true;
    const oldSource = oldLayer.getSource();
    const newSource = newLayer.getSource();
    if (oldSource instanceof VectorSource && newSource instanceof VectorSource) {
      const reader = new GeoJSON();
      const oldData = reader.writeFeatures(oldSource.getFeatures());
      const newData = reader.writeFeatures(newSource.getFeatures());
      if (oldData !== newData) return true;
    }
    return false;
  }


  private _lastClickLocation: number[] | undefined;
  private async handleClick(mapState: MapState) {
    const location = mapState.clickLocation;
    
    if (!location) {
      this.overlay.setPosition(undefined);
      this._lastClickLocation = undefined;
      return;
    }

    const pixel = this.map.getPixelFromCoordinate(location);
    let clickedFeature: FeatureLike | undefined;
    let compositeId: string | undefined;

    // trying to get clicked feature from vector-layers ...
    this.map.forEachFeatureAtPixel(pixel, (feature, layer) => {
      if (this.baseLayers.includes(layer)) return false;
      clickedFeature = feature;
      compositeId = layer.get("compositeId");
      return true;
    });

    // ... trying to get feature from raster layers.
    if (!clickedFeature) {
      for (const layer of this.map.getAllLayers().reverse()) {  // needs reverse, because ol returns layers not in painter's order.
        if (!layer.getVisible() || (layer.getOpacity() <= 0.0) || this.baseLayers.includes(layer)) continue;
        const source = layer.getSource();
        if (source instanceof TileWMS) {
          const view = this.map.getView();
          let alpha = 1.0;
          if ((source as any).crossOrigin) { // if the source allows inspecting color ...
            const color = layer.getData(pixel)?.buffer;
            alpha = color ? new Uint8Array(color)[3] : 0;
          }
          const url = source.getFeatureInfoUrl(location, view.getResolution() || 10_000, view.getProjection(), { 'INFO_FORMAT': 'application/json' });
          if (url && alpha > 0) {
            const result = await firstValueFrom<any>(this.http.get(url));
            if (result && result.features && result.features.length > 0 && result.features[0].properties && Object.keys(result.features[0].properties).length > 0) {
              const resultFeatures = new GeoJSON().readFeatures(result);
              clickedFeature = resultFeatures[0];
              compositeId = layer.get("compositeId");
              break;
            }
          }
        }
      }
    }

    // popup
    let madePopup = false;
    if (clickedFeature && compositeId) {
      for (const composite of mapState.layerComposites) {
        if (composite.visible && composite.id === compositeId) {
          const popup = composite.popup(location, [clickedFeature]);
          if (!popup) break;
          else madePopup = true;
          const { component, args } = popup;
          this.popupContainer.clear();
          const componentRef = this.popupContainer.createComponent(component, { index: 0 });
          for (const key in args) {
            componentRef.instance[key] = args[key];
          }
          this.changeDetector.detectChanges();
          break;
        }
      }
    }

    // if (!madePopup) this.closePopup();
    // <-- not going over state-mgmt here. otherwise no popup showing up in `compare-two-scenarios` if second not already there.
    if (!madePopup) this.overlay.setPosition(undefined);
    else {
      const [pixelX, pixelY] = this.map.getPixelFromCoordinate(location);
      const mapSize = this.map.getSize(); console.log(pixel, mapSize)
      if (mapSize) {
        const [mapX, mapY] = mapSize;
        const horizontalPositioning = pixelX < (mapX/2) ? "left" : "right";
        const verticalPositioning   = pixelY < (mapY/2) ? "top" : "bottom";
        const positioning: Positioning = `${verticalPositioning}-${horizontalPositioning}`;
        this.overlay.setPositioning(positioning);
      }
      this.overlay.setPosition(location);
    }

    // further click handling
    // but check if last click was already in same location to prevent loop
    if (clickedFeature && !maybeArraysEqual(location, this._lastClickLocation)) {
      for (const composite of mapState.layerComposites) {
        if (composite.visible) {
          composite.onClick(location, [clickedFeature]);
        }
      }
    }

    this._lastClickLocation = location;
  }

}


function getBaseLayers() {
  const osmBase = new TileLayer({
    source: new OSM(),
    className: 'gray',
  });
  osmBase.set("compositeId", "baseLayer");

  // const waterStyle = new Style({
  //   fill: new Fill({
  //     color: '#9db9e8',
  //   }),
  // });

  // const buildingStyle = new Style({
  //   fill: new Fill({
  //     color: '#666',
  //   }),
  //   stroke: new Stroke({
  //     color: '#444',
  //     width: 1,
  //   }),
  // });

  // const tileBase = new VectorTileLayer({
  //   source: new VectorTile({
  //     url: "https://tiles.geoservice.dlr.de/service/tms/1.0.0/eoc:basemap@EPSG:4326@pbf/{z}/{x}/{y}.pbf?flipy=true",
  //     format: new MVT(),
  //     projection: "EPSG:4326"
  //   }),
  //   style: (feature, resolution) => {
  //     console.log(feature.get('layer'))
  //     const layer = feature.get('layer');
  //     if (layer.includes('water') || layer.includes('ocean')) return waterStyle;
  //     if (layer.includes('building') || layer.includes('urban')) return buildingStyle;
  //     return undefined;
  //   }
  // });

  return [osmBase];
}
