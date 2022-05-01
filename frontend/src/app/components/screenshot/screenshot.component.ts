import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ScreenshotService } from './screenshot.service';

@Component({
  selector: 'ukis-screenshot',
  templateUrl: './screenshot.component.html',
  styleUrls: ['./screenshot.component.scss']
})
export class ScreenshotComponent implements OnInit {

    public showScreenshotModal: boolean = false;
    public image: Subject<string> = new Subject<string>();
  
    constructor(
      private screenshotService: ScreenshotService
    ) { }
  
    ngOnInit() {
    }
  
    onClick() {
      this.screenshotService.makeScreenshot().pipe().subscribe(canvas => {
        this.image.next(canvas.toDataURL("image/png"));
        this.showScreenshotModal = true;
      })
    }
  
    download() {
  
    }
  
  }