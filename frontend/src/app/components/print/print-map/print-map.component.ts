import { Component, ViewChild, ElementRef, OnDestroy, ViewEncapsulation, OnInit } from '@angular/core';

import { MapOlService } from '@dlr-eoc/map-ol';
import { simpleMapToCanvas } from '@dlr-eoc/utils-maps';
import { Paper, Orientation, PaperFormat, downloadUrl } from '@dlr-eoc/utils-browser';

import { PrintService, PrintLegendImage, ConcreteMapParameters, PrintingComponent } from '../print-service/print.service';

import { Observable, Subscription } from 'rxjs';
// NOTE: jsPDF has an 'optional' dependency on `html2canvas`. This dependency is required for `html`. We need to npm-install this manually.
// And it gets worse: since jsPDF tries to load that dependency per UML dynamically, it must be attached to `window`. Ugh.
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';





/**
 * A printable map.
 * Printing happens after instructions from print-service.
 * Configuration of print-parameters and print-preview happen in PrintComponent.
 */
@Component({
  selector: 'ukis-print-map',
  templateUrl: './print-map.component.html',
  styleUrls: ['./print-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PrintMapComponent implements OnDestroy, PrintingComponent, OnInit {

  public title = 'Some title';
  public description = 'Some description';
  public headerFontSize = 1.0;
  public fontSize = 0.4;
  public pageWidth = 600;  // includes margin
  public pageHeight = 400; // includes margin
  public innerPageWidth = 480;  // without margin
  public innerPageHeight = 320; // without margin
  public totalMapWidth = 480;  //  includes legend
  public totalMapHeight = 290;  // includes legend
  public mapWidth = 432;   // without legend
  public mapHeight = 290;  // without legend
  public marginWidth = 60;
  public marginHeight = 40;
  public legendEntries: PrintLegendImage[] = [];
  public resolution = 72;
  public kmPerCmPaper: number;
  public rotationDegrees = 0;

  @ViewChild('fullPage', { static: true }) fullPageEl: ElementRef<HTMLDivElement>;
  @ViewChild('innerPage', { static: true }) innerPageEl: ElementRef<HTMLDivElement>;
  @ViewChild('legend', { static: true }) legendEl: ElementRef<HTMLDivElement>;
  @ViewChild('mapCanvas', { static: true }) mapCanvasEl: ElementRef<HTMLCanvasElement>;

  private orientation: Orientation = 'landscape';
  private format: PaperFormat = 'A4';
  private subscriptions: Subscription[] = [];
  private outputFormat: 'pdf' | 'png';

  constructor(
    private printSvc: PrintService,
    private mapSvc: MapOlService
  ) {
    this.printSvc.registerPrinter(this);
  }

  ngOnInit(): void { }

  update(measures: ConcreteMapParameters): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {

      const requiresRedraw = this.mapWidth !== measures.mapWidth || this.mapHeight !== measures.mapHeight;

      this.title = measures.title;
      this.description = measures.description;

      this.pageWidth = measures.pageWidth;
      this.pageHeight = measures.pageHeight;
      this.innerPageWidth = measures.innerPageWidth;
      this.innerPageHeight = measures.innerPageHeight;
      this.totalMapWidth = measures.totalMapWidth;
      this.totalMapHeight = measures.totalMapHeight;
      this.mapWidth = measures.mapWidth;
      this.mapHeight = measures.mapHeight;
      this.marginWidth = measures.marginWidth;
      this.marginHeight = measures.marginHeight;
      this.orientation = measures.orientation;
      this.format = measures.format;
      this.resolution = measures.resolution;
      this.kmPerCmPaper = measures.kmPerCmPaper;
      this.rotationDegrees = measures.heading * 360 / (2 * Math.PI);

      this.headerFontSize = 0.04 * Math.max(this.pageWidth, this.pageHeight);
      this.fontSize = 0.012 * Math.max(this.pageWidth, this.pageHeight);

      this.outputFormat = measures.output;

      if (this.legendEl && this.legendEl.nativeElement && measures.legendImages) {
        this.legendEntries = measures.legendImages;
      }

      if (requiresRedraw) {
        simpleMapToCanvas(this.mapSvc.map, this.mapCanvasEl.nativeElement, this.mapWidth, this.mapHeight, (canvas) => {
          subscriber.next(true);
          subscriber.complete();
        });
      } else {
        subscriber.next(true);
        subscriber.complete();
      }


    });
  }


  print(): Observable<boolean> {

    /**
     * I've tried a few libraries to get this to work.
     *  - html2canvas messes up flexboxes
     *  - html2pdf is just a wrapper around html2canvas + jspdf
     *  - domtoimage seems to be doing best (but somehow duplicates svgs?)
     *
     * If you want to try another library, here are some factors to consider:
     *   - do flexboxes work?
     *   - does Cors cause problems? Can you proxy images?
     *   - is font & fontsize correctly transformed?
     *   - do svgs work?
     *   - do WebGl canvases work?
     *   - do VectorTiles work?
     *   - do transparent images work?
     *   - do legend-images work?
     *
     * But long term it might be better to do server-side rendering with something like puppeteer.
     */

    return new Observable<boolean>((subscriber) => {

      // This code below does not help printing webgl, either....
      // const canvas = document.createElement('canvas');
      // simpleMapToCanvas(this.map, canvas, this.pageWidth, this.pageHeight, (canvas: HTMLCanvasElement) => {
      //   canvas.toBlob((blob) => {
      //     downloadBlob(blob, this.title2Filename(this.title) + '.png');
      //   }, 'image/png');
      // });

      domtoimage.toPng(this.fullPageEl.nativeElement).then((dataUrl) => {
        if (this.outputFormat === 'png') {
          downloadUrl(dataUrl, this.title2Filename(this.title) + '.png');
        } else {
          const image = document.createElement('img');
          image.src = dataUrl;
          const page = new Paper(this.format, this.resolution, this.orientation);
          const doc = new jsPDF({
            orientation: page.orientation,
            format: [page.widthPx, page.heightPx],
            unit: 'px',
          });
          doc.addImage(image, 'png', 0, 0, page.widthPx, page.heightPx);
          doc.save(this.title2Filename(this.title) + '.pdf');
        }
        subscriber.next(true);
        subscriber.complete();
      });
    });
  }

  title2Filename(title: string) {
    return title.toLowerCase().replace(/\s/g, '-').replace(/[,.()_#$%&{}§"]/g, '');
  }

  ngOnDestroy(): void {
    this.subscriptions.map(s => s.unsubscribe());
  }


  /**
   * obj: {any| IDynamicComponent}
   */
  checkIsComponentItem(obj: any) {
    let isComp = false;
    if (obj && typeof obj === 'object') {
      if ('component' in obj) {
        isComp = true;
      }
    }
    return isComp;
  }

}
