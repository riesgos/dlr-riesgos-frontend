import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Partition, ScenarioName } from 'src/app/state/state';
import { MapService, MapState } from 'src/app/services/dataToUi/dataToMap';
import { Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('popup') popupContainer?: ElementRef<HTMLDivElement>;

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
      this.overlay.setElement(this.popupContainer.nativeElement);

      this.map.on('moveend', (evt) => {
        const zoom = this.map.getView().getZoom()!;
        const centerCoord = this.map.getView().getCenter()!;
        const center = [centerCoord[0], centerCoord[1]];
        this.mapSvc.mapMove(this.scenario, this.partition, zoom, center);
      });

      this.map.on('click', (evt) => {
        const location = evt.coordinate;
        this.mapSvc.mapClick(this.scenario, this.partition, location);
      })

      this.mapSvc.getMapData(this.scenario, this.partition).pipe(
        tap(mapState => {
          this.updatePosition(mapState);
        }),
        tap(mapState => {
          this.map.setLayers([...this.baseLayers, ...mapState.layers]);
        }),
        switchMap(mapState => {
          return this.handleClick(mapState);
        })
      ).subscribe(success => {});
    }
  }

  private handleClick(state: MapState): Observable<boolean> {
    this.overlay.setPosition(state.clickLocation);
    this.popupContainer!.nativeElement.innerHTML = "Pariatur nulla cillum commodo eu sit proident et tempor occaecat.";
    return of(true);
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

}
