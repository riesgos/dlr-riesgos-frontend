import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { simpleMapToCanvas } from '@dlr-eoc/utils-maps';
import { Paper, Orientation, PaperFormat } from '@dlr-eoc/utils-browser';
import { Map } from 'ol';

export interface MapParameters {
  title: string;
  description: string;
  map: Map;
  format: PaperFormat;
  resolution: number;
  orientation: Orientation;
}

// export interface MapMeasures {
//   title: string;
//   description: string;
//   headerFontSize: number;
//   fontSize: number;
//   pageWidth: number;
//   pageHeight: number;
//   innerPageWidth: number;
//   innerPageHeight: number;
//   mapWidth: number;
//   mapHeight: number;
// }

export type PrintInstruction = 'init' | 'print';


@Injectable({
  providedIn: 'root'
})
export class PrintService {

  private mapParameters$: BehaviorSubject<MapParameters>;
  // private mapMeasures$: BehaviorSubject<MapMeasures>;
  private instructions$: BehaviorSubject<PrintInstruction>;

  constructor() {
    this.mapParameters$ = new BehaviorSubject<MapParameters>({
      title: 'Title',
      description: 'Description',
      format: 'A3',
      resolution: 75,
      orientation: 'portrait',
      map: null
    });
    this.instructions$ = new BehaviorSubject<PrintInstruction>('init');
  }

  public getParameters(): Observable<MapParameters> {
    return this.mapParameters$;
  }

  // public getMeasures(): Observable<MapMeasures> {
  //   return this.mapMeasures$;
  // }

  public getInstructions(): Observable<PrintInstruction> {
    return this.instructions$;
  }

  public setParameters(paras: MapParameters): void {
    this.mapParameters$.next(paras);
    // const measures = this.measuresFromParas(paras);
    // this.mapMeasures$.next(measures);
  }

  public instruct(instruction: PrintInstruction): void {
    this.instructions$.next(instruction);
  }

  // private measuresFromParas(paras: MapParameters): MapMeasures {

  //   let headerFontSize = paras.resolution / 72;
  //   switch (paras.format) {
  //     case 'A3':
  //       headerFontSize *= 1.414;
  //       break;
  //     case 'A4':
  //       headerFontSize = headerFontSize;
  //       break;
  //     case 'A5':
  //       headerFontSize *= 1.0 / 1.414;
  //       break;
  //     default:
  //       throw new Error(`Unexpected format ${paras.format}.`);
  //   }
  //   headerFontSize = headerFontSize;
  //   const fontSize = headerFontSize * 0.72;

  //   const page = new Paper(paras.format, paras.resolution, paras.orientation);
  //   const pageWidth = page.widthPx;
  //   const pageHeight = page.heightPx;
  //   const innerPageWidth = 0.8 * pageWidth;
  //   const innerPageHeight = 0.8 * pageHeight;
  //   const mapWidth = 1.0 * innerPageWidth;
  //   const mapHeight = 0.8 * innerPageHeight;

  //   return {
  //     title: paras.title,
  //     description: paras.description,
  //     headerFontSize: headerFontSize,
  //     fontSize: fontSize,
  //     pageWidth: pageWidth,
  //     pageHeight: pageHeight,
  //     innerPageWidth: innerPageWidth,
  //     innerPageHeight: innerPageHeight,
  //     mapWidth: mapWidth,
  //     mapHeight: mapHeight
  //   };
  // }

}
