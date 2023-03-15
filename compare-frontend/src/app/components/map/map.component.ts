import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Partition, RiesgosScenarioState, RiesgosState, ScenarioName } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';
import { DataService } from 'src/app/services/data.service';
import { toOlLayers } from './helpers';
import { forkJoin, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import Layer from 'ol/layer/Layer';

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
  private map: Map = new Map({
    layers: this.baseLayers,
    view: new View({
      projection: 'EPSG:4326', // 'EPSG:900913',
      center: [-50, -20],
      zoom: 4
    }),
    controls: []
  });
  private overlay = new Overlay({});

  constructor(
    private store: Store<{ riesgos: RiesgosState }>,
    private resolver: DataService
  ) {}

  ngAfterViewInit(): void {
    if (this.mapContainer && this.popupContainer) {
  
      this.map.setTarget(this.mapContainer.nativeElement);
      this.overlay.setElement(this.popupContainer.nativeElement);

      this.map.on('moveend', (evt) => {
        const zoom = this.map.getView().getZoom()!;
        const centerCoord = this.map.getView().getCenter()!;
        const center = [centerCoord[0], centerCoord[1]];
        this.store.dispatch(AppActions.mapMove({ scenario: this.scenario, partition: this.partition, zoom, center }))
      });

      this.map.on('click', (evt) => {
        const location = evt.coordinate;
        this.store.dispatch(AppActions.mapClick({ scenario: this.scenario, partition: this.partition, location: location }));
      })

      this.store.select(state => state.riesgos).pipe(
        tap(state => {
          const scenarioState = state.scenarioData[this.scenario]![this.partition];
          this.updatePosition(scenarioState);
        }),
        switchMap(state => {
          const focussedStep = state.focusState.focusedStep;
          const scenarioState = state.scenarioData[this.scenario]![this.partition];
          return forkJoin([of(state), this.updateLayers(focussedStep, scenarioState)]);
        }),
        map(([state, layers]) => {
          this.map.setLayers([...this.baseLayers, ...layers]);
          return state;
        }),
        switchMap(state => {
          const scenarioState = state.scenarioData[this.scenario]![this.partition];
          return this.handleClick(scenarioState);
        })
      ).subscribe(success => {});
    }
  }

  private handleClick(state: RiesgosScenarioState): Observable<boolean> {
    this.overlay.setPosition(state.map.clickLocation);
    this.popupContainer!.nativeElement.innerHTML = "Pariatur nulla cillum commodo eu sit proident et tempor occaecat.";
    return of(true);
  }

  private updateLayers(step: string, state: RiesgosScenarioState): Observable<Layer[]> {
    const currentStep = state.steps.find(s => s.step.id === step);
    if (!currentStep) return of([]);
    const outputIds = currentStep.step.outputs.map(o => o.id);
    const outputProducts = state.products.filter(p => outputIds.includes(p.id)).filter(p => p.value || p.reference);
    return this.resolver.resolveReferences(outputProducts).pipe(
      mergeMap(resolved => {
        const newLayers$ = resolved.map(p => toOlLayers(this.scenario, step, p));
        return forkJoin(newLayers$);
      }),
      map(newLayers => newLayers.flat())
    );
  }

  private updatePosition(state: RiesgosScenarioState) {
    if (
      this.map.getView().getZoom() !== state.map.zoom ||
      this.map.getView().getCenter()![0] !== state.map.center[0] ||
      this.map.getView().getCenter()![1] !== state.map.center[1]
    ) {
      this.map.getView().animate({
        center: state.map.center,
        zoom: state.map.zoom,
        duration: 100
      })
    }
  }

}
