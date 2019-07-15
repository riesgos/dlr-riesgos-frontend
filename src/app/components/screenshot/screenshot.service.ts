import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenshotService {

  constructor() { }

  makeScreenshot() {
    return from(html2canvas(document.body));
  }
}
