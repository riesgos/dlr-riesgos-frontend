import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paper, Orientation, PaperFormat } from '@dlr-eoc/utils-browser';
import { IDynamicComponent } from '@dlr-eoc/core-ui';
import { Map, Geolocation } from 'ol';



//
export interface PrintLegendImage {
  title: string;
  image: string | IDynamicComponent;
}

/**
 * Input settings
 */
export interface DeclarativeMapParameters {
  title: string;
  description: string;
  map: Map;
  format: PaperFormat;
  resolution: number;
  orientation: Orientation;
  legendImages?: PrintLegendImage[];
  output: 'png' | 'pdf';
  projection: string;
  center: [number, number];
  zoom: number;
}

/**
 * Output settings
 *
 * Defaults:
 * - title = 'Some title';
 * - description = 'Some description';
 * - headerFontSize = 1.0;
 * - fontSize = 0.7;
 * - pageWidth = 600;  // includes margin
 * - pageHeight = 400; // includes margin
 * - innerPageWidth = 480;  // without margin
 * - innerPageHeight = 320; // without margin
 * - totalMapWidth = 480;  //  includes legend
 * - totalMapHeight = 290;  // includes legend
 * - mapWidth = 432;   // without legend
 * - mapHeight = 290;  // without legend
 * - marginWidth = 60;
 * - marginHeight = 40;
 *
 * ```
 *                                                                   pageWidth
 *   +-----------------------------------------------------------------------+
 *   |                                                    innerPageWidth     |
 *   |   +---------------------------------------------------------------+   |
 *   |   | Title                                           totalMapWidth |   |
 *   |   +---------------------------------------------------------------+   |
 *   |   |                                  mapWidth                     |   |
 *   |   +------------------------------------------+--------------------+   |
 *   |   | map                                      | legend             |   |
 *   |   |                                          |                    |   |
 *   |   |                                          |                    |   |
 *   |   |                                          |                    |   |
 *   |   |                                          |                    |   |
 *   |   |                                          |                    |   |
 *   |   |                                          |                    |   |
 *   |   +------------------------------------------+--------------------+  mapHeight
 *   |   |                                                               |   |
 *   |   +------------------------------------------+--------------------+ totalMapHeight
 *   |   |                                          |                    |   |
 *   |   |  Description                             |   Footer           |   |
 *   |   |                                          |                    |   |
 *   |   +------------------------------------------+--------------------+ innerPageHeight
 *   |                                                                       |
 *   +-----------------------------------------------------------------------+pageHeight
 *  ```
 */
export interface ConcreteMapParameters {
  format: PaperFormat;
  orientation: Orientation;
  resolution: number;
  kmPerCmPaper: number;
  /** radians clockwise from north */
  heading: number;

  output: 'png' | 'pdf';
  projection: string;
  center: [number, number];
  zoom: number;
  legendImages?: PrintLegendImage[];

  title: string;
  description: string;

  headerFontSize: number;
  fontSize: number;
  /** includes margin */
  pageWidth: number;
  /** includes margin */
  pageHeight: number;
  /** without margin */
  innerPageWidth: number;
  /** without margin */
  innerPageHeight: number;
  /** without legend */
  mapWidth: number;
  /** without legend */
  mapHeight: number;
  /** includes legend */
  totalMapWidth: number;
  /** includes legend */
  totalMapHeight: number;
  marginWidth: number;
  marginHeight: number;
}

export interface PrintingComponent {
  update(concreteParas: ConcreteMapParameters): Observable<boolean>;
  print(): Observable<boolean>;
}



@Injectable({
  providedIn: 'root'
})
export class PrintService {
  private printer: PrintingComponent;

  constructor() {}

  public registerPrinter(printer: PrintingComponent) {
    this.printer = printer;
  }

  public updateMap(paras: DeclarativeMapParameters): Observable<boolean> {
    const concreteParas = this.calculateConcreteParas(paras);
    return this.printer.update(concreteParas);
  }

  public printMap(): Observable<boolean> {
    return this.printer.print();
  }

  private calculateConcreteParas(paras: DeclarativeMapParameters): ConcreteMapParameters {

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
    headerFontSize = headerFontSize;
    const fontSize = headerFontSize * 0.5;

    const page = new Paper(paras.format, paras.resolution, paras.orientation);
    const pageWidth = page.widthPx;
    const pageHeight = page.heightPx;
    const innerPageWidth = 0.9 * pageWidth;
    const innerPageHeight = 0.9 * pageHeight;
    const totalMapWidth = 1.0 * innerPageWidth;
    const totalMapHeight = 0.7 * innerPageHeight;
    const mapWidth = 0.8 * totalMapWidth;
    const mapHeight = 1.0 * totalMapHeight;
    const marginWidth = (pageWidth - innerPageWidth) / 2.0;
    const marginHeight = (pageHeight - innerPageHeight) / 2.0;

    const mapUnitsPerPixel = paras.map.getView().getResolution();
    const metersPerUnit = paras.map.getView().getProjection().getMetersPerUnit();
    const kilometersPerUnit = metersPerUnit / 1000;
    const inchesPerCentimeter = 0.393701;
    const pixelPerCmPaper = paras.resolution * inchesPerCentimeter;
    const kmPerCmPaper = mapUnitsPerPixel * kilometersPerUnit * pixelPerCmPaper;

    const gl = new Geolocation({
      projection: paras.map.getView().getProjection()
    });
    const heading = gl.getHeading();


    return {
      format: paras.format,
      resolution: paras.resolution,
      orientation: paras.orientation,
      kmPerCmPaper,
      heading,
      output: paras.output,
      projection: paras.projection,
      center: paras.center,
      zoom: paras.zoom,

      legendImages: paras.legendImages,

      title: paras.title,
      description: paras.description,
      headerFontSize,
      fontSize,

      pageWidth,
      pageHeight,
      innerPageWidth,
      innerPageHeight,
      totalMapWidth,
      totalMapHeight,
      mapWidth,
      mapHeight,
      marginWidth,
      marginHeight
    };
  }

}
