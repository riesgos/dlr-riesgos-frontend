import { Map as OlMap, Overlay, View } from 'ol';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { PartitionName, RiesgosState, ScenarioName } from 'src/app/state/state';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import BaseEvent from 'ol/events/Event';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { maybeArraysEqual } from 'src/app/state/helpers';
import { FeatureLike } from 'ol/Feature';
import { TileWMS } from 'ol/source';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as Actions from '../../../state/actions';
import { RiesgosScenarioMapState as MapState, Layer as StateLayer } from '../../../state/state';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy {

  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('popup') popup!: ElementRef<HTMLDivElement>;
  @ViewChild('popupBody', { read: ViewContainerRef, static: true }) popupContainer!: ViewContainerRef;

  private baseLayers: Layer[] = getBaseLayers();
  private overlay = new Overlay({});
  private map!: OlMap;

  private olSubs: Map<'moveend' | 'click', (event: BaseEvent | Event) => unknown> = new Map();
  private subs: Subscription[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private zone: NgZone,
    private http: HttpClient,
    private store: Store<{riesgos: RiesgosState}>
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

        // explicitly inside zone - otherwise issues with ngrx(-devtools) ... wouldn't update selected eq.
        this.zone.run(() => this.store.dispatch(Actions.mapMove({scenario: this.scenario, partition: this.partition, zoom, center})));
      };

      const clickHandler = (evt: any) => {

        const location = evt.coordinate;
        const pixel = this.map.getPixelFromCoordinate(location);
        let clickedFeature: { compositeId: string, feature: any } | undefined = undefined;
        this.map.forEachFeatureAtPixel(pixel, (feature, layer, geometry) => {
          clickedFeature = { compositeId: layer.get("compositeId"), feature };
          return true;
        });

        this.zone.run(() => this.store.dispatch(Actions.mapClick({scenario: this.scenario, partition: this.partition, location, clickedFeature})));
      }

      // no need to run this outside of zone
      this.map.on('moveend', moveHandler);
      this.map.on('click', clickHandler);

      this.olSubs.set('moveend', moveHandler);
      this.olSubs.set('click', clickHandler);

      /*********************************************************************
       *   HANDLING EVENTS FROM STATE-MGMT
       *********************************************************************/

      const mapStateSub = this.store.select(s => s.riesgos.scenarioData[this.scenario]![this.partition]!.map).subscribe(async mapState => {
          this.handleMove(mapState);
          this.handleLayers(mapState);
          // await this.handleClick(mapState);
      });
      this.subs.push(mapStateSub);
    }
  }

  public closePopup() {
    this.zone.run(() => this.store.dispatch(Actions.popupClose({scenario: this.scenario, partition: this.partition})));
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

    const newLayers = mapState.layers.map(c => {
      const id = c.layerCompositeId;
      const layer = getOlLayer(c);
      layer.set("compositeId", id);
      layer.setOpacity(c.opacity);
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
          if (oldLayer) this.map.removeLayer(oldLayer);
          this.map.addLayer(layer);
        }
      }
    }
    for (const layer of toAdd) {
      this.map.addLayer(layer);
    }

    // @TODO: set visibility from last time
  }

  private different(oldLayer: Layer, newLayer: Layer): boolean {
    if (oldLayer.getOpacity() !== newLayer.getOpacity()) return true;
    // @TODO: compare features if VectorLayer, rasterSource if TileLayer
    // style if VectorLayer, GET-params if TileLayer
    return false;
  }


  private _lastClickLocation: number[] | undefined;
  private async handleClick(mapState: MapState) {
    const location = mapState.clickLocation;
    this.overlay.setPosition(location);

    if (!location) {
      this._lastClickLocation = location;
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
          const url = source.getFeatureInfoUrl(location, view.getResolution() || 10_000, view.getProjection(), { 'INFO_FORMAT': 'application/json' });
          if (url) {
            const result = await firstValueFrom(this.http.get(url));
            if (result) {
              const resultFeatures = new GeoJSON().readFeatures(result);
              clickedFeature = resultFeatures[0];
              compositeId = layer.get("compositeId");
              break;
            }
          }
        }
      }
    }

    this._lastClickLocation = location;
  }

}


function getBaseLayers() {
  const osmBase = new TileLayer({
    source: new OSM(),
    className: 'gray'
  });
  osmBase.set("compositeId", "baseLayer");

  return [osmBase];
}


function getOlLayer(layer: StateLayer): Layer {
  throw new Error(`undefined`)
}
