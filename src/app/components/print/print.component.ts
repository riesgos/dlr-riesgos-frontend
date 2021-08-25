import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MapOlService } from '@dlr-eoc/map-ol';
import { LayersService, Layer } from '@dlr-eoc/services-layers';
import { PrintService, DeclarativeMapParameters, PrintLegendImage } from './print-service/print.service';
import { combineLatest } from 'rxjs';



/**
 * The container, in which ...
 *  - render-parameters are being set
 *  - PrintMapComponent is being rendered
 */
@Component({
  selector: 'ukis-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent {

  @Input() set show(value: boolean) {
    this.modalVisible = value;
    if (this.modalVisible) {
      this.updateMap();
    }
    this.showChange.emit(value);
  }
  get show() {
    return this.modalVisible;
  }
  @Output() showChange = new EventEmitter<boolean>();


  public previewWidth: number = screen.width * 0.4;
  public previewHeight: number = screen.height * 0.4;

  public modalVisible = false;
  public pdfParametersForm: FormGroup;
  public formatOptions = ['A4', 'A3'];
  public orientationOptions = ['landscape', 'portrait'];
  public resolutionOptions = [72, 150, 300];
  public outputOptions = ['png', 'pdf'];
  private legends: PrintLegendImage[];

  public isRendering = false;
  public maxDescriptionLength = 500;

  constructor(
    private mapSvc: MapOlService,
    private layerSvc: LayersService,
    private printSvc: PrintService
  ) {
    this.pdfParametersForm = new FormGroup({
      title: new FormControl('DLR MARISS'),
      description: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', [Validators.maxLength(this.maxDescriptionLength)]),
      format: new FormControl(this.formatOptions[0]),
      orientation: new FormControl(this.orientationOptions[0]),
      resolution: new FormControl(this.resolutionOptions[1]),
      output: new FormControl(this.outputOptions[0])
    });

    const layers$ = this.layerSvc.getLayers();
    const overlays$ = this.layerSvc.getOverlays();
    const all$ = combineLatest([layers$, overlays$]);

    all$.subscribe(([layers, overlays]: [Layer[], Layer[]]) => {
      const legends: PrintLegendImage[] = [];
      const allLayers = Array.prototype.concat(layers, overlays).reverse();
      for (const layer of allLayers) {
        if (layer.legendImg && layer.visible) {
          legends.push({
            title: layer.name,
            image: layer.legendImg
          });
        }
      }
      this.legends = legends;
    });
  }

  public updateMap() {
    if (this.pdfParametersForm.valid) {
      this.isRendering = true;
      const formValues = this.pdfParametersForm.value;
      const mapParas: DeclarativeMapParameters = {
        ...formValues,
        map: this.mapSvc.map,
        legendImages: this.legends,
        zoom: this.mapSvc.getZoom(),
        center: this.mapSvc.getCenter(),
        projection: this.mapSvc.getProjection().getCode()
      };
      this.printSvc.updateMap(mapParas).subscribe(done => {
        this.isRendering = false;
      });
    }
  }

  public onSubmit() {

  }

  public exportToPdf() {
    this.isRendering = true;
    this.printSvc.printMap().subscribe(done => {
      this.isRendering = false;
    });
  }
}
