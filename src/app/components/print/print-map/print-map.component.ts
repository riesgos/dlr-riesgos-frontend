import { Component, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { simpleMapToCanvas } from '@dlr-eoc/utils-maps';
import { Paper, Orientation, PaperFormat } from '@dlr-eoc/utils-browser';
import { PrintService, MapParameters, PrintInstruction } from '../print-service/print.service';
import { Subscription } from 'rxjs';

// NOTE: jsPDF has an 'optional' dependency on `html2canvas`. This dependency is required for `html`. We need to npm-install this manually.
// And it gets worse: since jsPDF tries to load that dependency per UML dynamically, it must be attached to `window`. Ugh.
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
// @ts-ignore
window.html2canvas = html2canvas;


@Component({
  selector: 'ukis-print-map',
  templateUrl: './print-map.component.html',
  styleUrls: ['./print-map.component.scss']
})
export class PrintMapComponent implements OnDestroy {

  public title = 'Some title';
  public description = 'Some description';
  public headerFontSize = 1.0;
  public fontSize = 0.7;
  public pageWidth = 600;
  public pageHeight = 400;
  public innerPageWidth = 480;
  public innerPageHeight = 320;
  public mapWidth = 480;
  public mapHeight = 290;
  public marginWidth = 60;
  public marginHeight = 40;

  @ViewChild('fullPage', { static: true }) fullPageEl: ElementRef<HTMLCanvasElement>;
  @ViewChild('innerPage', { static: true }) innerPageEl: ElementRef<HTMLCanvasElement>;
  @ViewChild('printCanvas', { static: true }) printCanvasEl: ElementRef<HTMLCanvasElement>;

  @Output() mapRendered = new EventEmitter<any>();

  private orientation: Orientation = 'landscape';
  private resolution = 72;
  private format: PaperFormat = 'A4';
  private subscriptions: Subscription[] = [];

  constructor(
    private printSvc: PrintService
  ) {
    const s1 = this.printSvc.getParameters().subscribe((paras: MapParameters) => {
      this.updateProperties(paras);
    });
    this.subscriptions.push(s1);

    const s2 = this.printSvc.getInstructions().subscribe((instruction: PrintInstruction) => {
      switch (instruction) {
        case 'init':
          break;
        case 'print':
          this.printPage();
          break;
        default:
          throw new Error(`Unexpected instruction: ${instruction}`);
      }
    });
    this.subscriptions.push(s2);
  }

  private updateProperties(paras: MapParameters): void {
    // @TODO: move this calculation to PrintService. In: MapAbstractParas, Out: MapConcreteParas
    this.title = paras.title;
    this.description = paras.description;
    this.orientation = paras.orientation;
    this.resolution = paras.resolution;
    this.format = paras.format;

    let headerFontSize = paras.resolution / 72;
    switch (paras.format) {
      case 'A3':
        headerFontSize *= 1.414;
        break;
      case 'A4':
        headerFontSize = headerFontSize;
        break;
      case 'A5':
        headerFontSize *= 1.0 / 1.414;
        break;
      default:
        throw new Error(`Unexpected format ${paras.format}.`);
    }
    this.headerFontSize = headerFontSize;
    this.fontSize = this.headerFontSize * 0.72;

    const page = new Paper(paras.format, paras.resolution, paras.orientation);
    this.pageWidth = page.widthPx;
    this.pageHeight = page.heightPx;
    this.innerPageWidth = 0.9 * this.pageWidth;
    this.innerPageHeight = 0.9 * this.pageHeight;
    this.mapWidth = 1.0 * this.innerPageWidth;
    this.mapHeight = 0.9 * this.innerPageHeight;
    this.marginWidth = (this.pageWidth - this.innerPageWidth) / 2.0;
    this.marginHeight = (this.pageHeight - this.innerPageHeight) / 2.0;

    if (this.printCanvasEl && this.printCanvasEl.nativeElement) {
      simpleMapToCanvas(paras.map, this.printCanvasEl.nativeElement, this.mapWidth, this.mapHeight, (newCanvas) => {
        this.mapRendered.emit(newCanvas);
      });
    }
  }

  private printPage(): void {
    const page = new Paper(this.format, this.resolution, this.orientation);
    const doc = new jsPDF({
      orientation: page.orientation,
      format: [page.widthPx, page.heightPx],
      unit: 'px'
    });


    const padding = 25;
    const fontSize = 18 * (this.resolution / 72);
    doc.setFontSize(fontSize);

    const marginRight = (page.widthPx - this.mapWidth) / 2;
    const marginTop = padding * (this.resolution / 72);
    doc.text(this.title, marginRight, marginTop);

    const marginTopMap = marginTop + padding;
    doc.addImage(this.printCanvasEl.nativeElement, 'JPEG', marginRight, marginTopMap, this.mapWidth, this.mapHeight);
    doc.saveGraphicsState();

    if (this.description !== '') {
      const descriptionheight = ((this.description.length * fontSize) / (page.widthPx - 2 * marginRight)) * fontSize;
      console.log(descriptionheight);
      const fromTopBelowMap = (marginTopMap + this.mapHeight + padding);
      const placeBelowMap = page.heightPx - fromTopBelowMap;

      if (placeBelowMap > descriptionheight) {
        const marginTopDescription = fromTopBelowMap;
        doc.text(this.description, marginRight, marginTopDescription, { maxWidth: this.mapWidth });
      } else {
        doc.addPage([page.widthPx, page.heightPx], page.orientation);
        doc.text(this.description, marginRight, marginTop, { maxWidth: this.mapWidth });
        // add new Page
      }
    }
    doc.save(`${this.title2Filename(`${this.title}-${this.resolution}dpi`)}.pdf`);

    /** @types/jspdf is outdated! */
    /* doc.html(this.fullPageEl.nativeElement, {
      callback: (d) => {
        d.save(`${this.title2Filename(`${this.title}-${this.resolution}dpi`)}.pdf`);
      },
      // html2canvas options
      html2canvas: {
        allowTaint: true, // @TODO: I don't think this option can really allow a tainted canvas ...
        svgRendering: true,
        width: this.pageWidth,
        height: this.pageHeight
      },
      // number | array	<optional> Array of margins [left, bottom, right, top]
      margin: [50, 50],
      // string	<optional>  name of the file
      filename: this.title,
      // HTMLOptionImage	<optional> image settings when converting HTML to image
      image: {
        type: 'jpeg',
        quality: this.resolution
      },
      // number<optional> x position on the PDF document
      x: 0,
      // y position on the PDF document
      y: 0
    } as any); */
  }

  title2Filename(title: string) {
    return title.toLowerCase().replace(/\s/g, '-').replace(/[,.()_#$%&{}§"]/g, '');
  }

  ngOnDestroy(): void {
    this.subscriptions.map(s => s.unsubscribe());
  }
}
