import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MapOlService } from '@dlr-eoc/map-ol';
import { TranslateService } from '@ngx-translate/core';
import { MapParameters, PrintService } from './print-service/print.service';

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

  public isRendering = false;

  constructor(
    private mapSvc: MapOlService,
    private printSvc: PrintService,
    private translator: TranslateService
  ) {
    this.pdfParametersForm = new FormGroup({
      title: new FormControl(this.translator.instant('Title')),
      description: new FormControl(this.translator.instant('Description')),
      format: new FormControl(this.formatOptions[0]),
      orientation: new FormControl(this.orientationOptions[0]),
      resolution: new FormControl(this.resolutionOptions[0])
    });
  }

  onMapRendered() {
    this.isRendering = false;
  }

  public updateMap() {
    if (this.pdfParametersForm.valid) {
      this.isRendering = true;
      const formValues = this.pdfParametersForm.value;
      const mapParas: MapParameters = {
        ...formValues,
        map: this.mapSvc.map
      };
      this.printSvc.setParameters(mapParas);
    }
  }

  public onSubmit() {

  }

  public exportToPdf() {
    this.printSvc.instruct('print');
  }
}
