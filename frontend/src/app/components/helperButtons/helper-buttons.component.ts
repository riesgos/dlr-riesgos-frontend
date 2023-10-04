import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getCurrentScenarioRiesgosState } from 'src/app/riesgos/riesgos.selectors';
import { RiesgosScenarioState } from 'src/app/riesgos/riesgos.state';
import * as RiesgosActions from 'src/app/riesgos/riesgos.actions';
import { MapOlService } from '@dlr-eoc/map-ol';
import { simpleMapToCanvas } from '../print/print';
import { Layer, LayersService } from '@dlr-eoc/services-layers';
import { BehaviorSubject } from 'rxjs';
import { LegendItemComponent } from '../print/legend-item/legend-item.component';




@Component({
    selector: 'ukis-helper-buttons',
    templateUrl: './helper-buttons.component.html',
    styleUrls: ['./helper-buttons.component.scss']
})
export class HelperButtonsComponent implements OnInit {

    showResetModal = false;
    showPrintModal = false;
    @ViewChild('previewCanvas') previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('sideBar', {read: ViewContainerRef}) sideBar: ViewContainerRef;
    private currentState: RiesgosScenarioState;
    private currentLayers$ = new BehaviorSubject<Layer[]>([]);

    constructor(
        private store: Store<State>,
        private mapSvc: MapOlService,
        private layerSvc: LayersService
    ) {
        this.layerSvc.getOverlays().subscribe(this.currentLayers$);
    }

    ngOnInit() {
        this.store.pipe(select(getCurrentScenarioRiesgosState)).subscribe((state: RiesgosScenarioState) => {
            this.currentState = state;
        });
    }

    onResetClicked(): void {
        const currentScenario = this.currentState.scenario;
        this.store.dispatch(RiesgosActions.restartingScenario({scenario: currentScenario}));
        this.showResetModal = false;
    }

    onPrintClicked(): void {
        // https://www.npmjs.com/package/html-to-image
    }

    onUpdateClicked(): void {
        simpleMapToCanvas(this.mapSvc.map, this.previewCanvas.nativeElement, 600, 800);
        for (const layer of this.currentLayers$.value) {
            if (layer.visible && layer.opacity > 0.0) {
                const component = this.sideBar.createComponent(LegendItemComponent);
                component.instance.layer = layer;
            }
        }
    }

}

