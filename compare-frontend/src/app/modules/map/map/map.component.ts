import { Map as OlMap, Overlay, View } from 'ol';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { LayerDescription, PartitionName, RiesgosState, ScenarioName } from 'src/app/state/state';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import BaseEvent from 'ol/events/Event';
import { Observable, Subscription, firstValueFrom, map } from 'rxjs';
import { FeatureLike } from 'ol/Feature';
import { TileWMS } from 'ol/source';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as Actions from '../../../state/actions';
import { RiesgosScenarioMapState as MapState } from '../../../state/state';
import { ResolverService } from 'src/app/services/resolver.service';
import { OlLayerFactory, findOlLayerFactory } from 'src/app/state/augmenters';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  encapsulation: ViewEncapsulation.None
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
    private zone: NgZone,
    private http: HttpClient,
    private store: Store<{riesgos: RiesgosState}>,
    private resolver: ResolverService
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

      const clickHandler = async (evt: any) => {

        const location = evt.coordinate;
        const result = await this.getFeatureAt(location);
        if (!result) return;
        const {clickedFeature, compositeId} = result;

        this.zone.run(() => this.store.dispatch(Actions.mapClick({scenario: this.scenario, partition: this.partition, location, clickedFeature, compositeId })));
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
          this.updateLocation(mapState);
          this.updateLayers(mapState);
          this.updatePopup(mapState);
      });
      this.subs.push(mapStateSub);
    }
  }

  public closePopup() {
    this.zone.run(() => this.store.dispatch(Actions.popupClose({scenario: this.scenario, partition: this.partition})));
  }


  private updateLocation(state: MapState) {
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

  private updateLayers(mapState: MapState) {

    const oldLayerIds = this.map.getAllLayers().map(l => l.get("description").layerCompositeId);
    const newLayerIds = mapState.layers.map(l => l.layerCompositeId);
    newLayerIds.push("baseLayer");

    const toRemove = oldLayerIds.filter(ol => !newLayerIds.includes(ol));
    const toUpdate = newLayerIds.filter(nl =>  oldLayerIds.includes(nl));
    const toAdd    = newLayerIds.filter(nl => !oldLayerIds.includes(nl));

    // 1. remove 
    for (const layerId of toRemove) {
      const layer = this.map.getAllLayers().find(l => l.get('compositeId') === layerId);
      if (layer) this.map.removeLayer(layer);
    }

    // 2. update
    for (const layerId of toUpdate) {
      const oldLayer = this.map.getAllLayers().find(l => l.get("description").layerCompositeId === layerId);
      const newLayerDescription = mapState.layers.find(l => l.layerCompositeId === layerId);
      if (!oldLayer || !newLayerDescription) continue;
      const oldLayerDescription = oldLayer.get("description");
      const layerF = findOlLayerFactory(this.scenario, this.partition, layerId);
      if (layerF && different(oldLayerDescription, newLayerDescription)) {
        this.toOlLayer(newLayerDescription, layerF).subscribe(newLayer => {
          this.map.removeLayer(oldLayer);
          this.map.addLayer(newLayer);
        });
      }
    }

    // 3. add
    for (const layerId of toAdd) {
      const layerDescription = mapState.layers.find(l => l.layerCompositeId === layerId);
      const layerF = findOlLayerFactory(this.scenario, this.partition, layerId);
      if (layerF && layerDescription) {
        this.toOlLayer(layerDescription, layerF).subscribe(layer => {
          this.map.addLayer(layer);
        });
      }
    }


  }

  private toOlLayer(layerDescription: LayerDescription, layerFactory: OlLayerFactory): Observable<Layer> {
    const data$ = this.resolver.resolveReference(layerDescription.data);
    const layer$ = data$.pipe(
      map(data => layerFactory.toOlLayer(data, layerDescription)),
      map(layer => {
        layer.set("description", layerDescription);
        return layer;
      })
    );
    return layer$;
  }


  private async updatePopup(mapState: MapState) {
    const location = mapState.clickLocation;
    this.overlay.setPosition(location);

    if (!location) {
      return;
    }

   

  }

  private async getFeatureAt(location: number[]) {
    const pixel = this.map.getPixelFromCoordinate(location);
    let clickedFeature: FeatureLike | undefined;
    let compositeId: string | undefined;

    // trying to get clicked feature from vector-layers ...
    this.map.forEachFeatureAtPixel(pixel, (feature, layer) => {
      if (this.baseLayers.includes(layer)) return false;
      clickedFeature = feature;
      compositeId = layer.get("description").layerCompositeId;
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
              compositeId = layer.get("description").layerCompositeId;
              break;
            }
          }
        }
      }
    }

    if (clickedFeature) return {clickedFeature, compositeId};
    return undefined;
  }

}




function different(oldLayer: LayerDescription, newLayer: LayerDescription): boolean {
  if (oldLayer.layerCompositeId !== newLayer.layerCompositeId) return true;
  if (JSON.stringify(oldLayer.data) !== JSON.stringify(newLayer.data)) return true;
  return false;
}

function getBaseLayers() {
  const osmBase = new TileLayer({
    source: new OSM(),
    className: 'gray'
  });
  osmBase.set("compositeId", "baseLayer");

  return [osmBase];
}


