import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Partition, RiesgosScenarioState, RiesgosState, ScenarioName } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';
import { DataService } from 'src/app/services/data.service';
import { toOlLayers } from './helpers';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

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
  });;

  constructor(
    private store: Store<{ riesgos: RiesgosState }>,
    private resolver: DataService
  ) {}

  ngAfterViewInit(): void {
    if (this.mapContainer) {
  
      this.map.setTarget(this.mapContainer.nativeElement);

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

      this.store.select(state => state.riesgos).subscribe(state => {
        const focussedStep = state.focusState.focusedStep;
        const scenarioState = state.scenarioData[this.scenario]![this.partition];
        this.updatePosition(scenarioState);
        this.updateLayers(focussedStep, scenarioState);
      });
    }
  }

  private updateLayers(step: string, state: RiesgosScenarioState) {
    const currentStep = state.steps.find(s => s.step.id === step);
    if (!currentStep) return;
    const outputIds = currentStep.step.outputs.map(o => o.id);
    const outputProducts = state.products.filter(p => outputIds.includes(p.id)).filter(p => p.value || p.reference);
    this.resolver.resolveReferences(outputProducts).subscribe(resolved => {
      const newLayers = resolved.map(p => toOlLayers(this.scenario, step, p)).flat();
      this.map.setLayers([...this.baseLayers, ...newLayers]);
    });
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
