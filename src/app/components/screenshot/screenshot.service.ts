import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenshotService {

  constructor() { }

  makeScreenshot() {
    let element = document.body;
    return from(html2canvas(element));
  }
}
