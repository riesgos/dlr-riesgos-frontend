import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { Partition } from 'src/app/state/state';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @Input() partition!: Partition;
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

  constructor(private mapSvc: MapService) {}

  ngAfterViewInit(): void {
    if (this.mapContainer) {
      this.mapSvc.init(this.mapContainer.nativeElement);
    }
  }

}
