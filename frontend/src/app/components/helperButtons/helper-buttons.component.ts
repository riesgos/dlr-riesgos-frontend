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
import { toPng } from 'html-to-image';



@Component({
    selector: 'ukis-helper-buttons',
    templateUrl: './helper-buttons.component.html',
    styleUrls: ['./helper-buttons.component.scss']
})
export class HelperButtonsComponent implements OnInit {

    showResetModal = false;
    showPrintModal = false;
    @ViewChild('previewHtml', {read: ElementRef}) previewHtml: ElementRef<HTMLDivElement>;
    @ViewChild('previewCanvas', {read: ElementRef}) previewCanvas: ElementRef<HTMLCanvasElement>;
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

    async onPrintClicked() {
        const container = document.getElementById('previewHtml');

        const BROKEN_IMAGE_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhGQAZAPQAAISChKWipcbT7+fr/8bf51KuOdbf93vDc87b9/f3997n/2u2Y9bf/5SSlJzHtcbT9////+/z/1KyOdbj94zHjNbb9/f3/2u6Y9bj/5yenLXP1sbX9wAAAAAAAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgPD94cGFja2V0IGVuZD0idyI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACwAAAAAGQAZAAAF/2DgWGRpmlkTaIkFvWIkzzSdZY42JS8UBIqJcEicKBSZAGSSIfB8AaHBMBlYB5OpMAlJaAhOyy+LKLsgljKCyn1pMruxATGI9CARxZqZ0fgDKg5yCHZ3EAN7KQ2LjA1JVWeGiGVCV1aAjwOGPZN0dTNijlFzaqWlWlQKA5hRCBuvsLGnWgqsEwgCsLmxurAIE7a4rwLEucW7u78EGmO4x8/QAr8uj87PfhrRCmfV0djRmi/dxA4OC+foF34CE4bjAuUFBRL05zkICj0JCd0a5vQAAx4wZEuAPwoLAgYs18NCBFsEHBxQqPDJCyyAfiw7kJCiBAcE9H0BpiJARI8AQyL2IKCOZIAMFCZ6dLDvRYKYEig4SPHywAWUGu4kAHiAwqIQADs=';

        const result = await toPng(container, {
            width: container.clientWidth,
            height: container.clientHeight,
            backgroundColor: 'white',
            // cacheBust: true,
            imagePlaceholder: BROKEN_IMAGE_PLACEHOLDER
        });
        downloadURI(result, "map.png");
    }

    activatePrintModal(): void {
        this.showPrintModal = true;
        setTimeout(() => {
            simpleMapToCanvas(this.mapSvc.map, this.previewCanvas.nativeElement, 600, 800);
            // simpleMapToCanvas(this.mapSvc.map, this.previewCanvas.nativeElement, 600, 800);
            for (const layer of this.currentLayers$.value) {
                if (layer.visible && layer.opacity > 0.0) {
                    const component = this.sideBar.createComponent(LegendItemComponent);
                    component.instance.layer = layer;
                }
            }
        }, 500);
    }

}



function downloadURI(uri: string, name: string) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }