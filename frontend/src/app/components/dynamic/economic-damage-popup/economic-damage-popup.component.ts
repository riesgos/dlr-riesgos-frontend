import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import TileWMS from 'ol/source/TileWMS';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeusGetFeatureInfo, DeusMetaData } from '../damage-popup/damage-popup.component';

@Component({
  selector: 'app-economic-damage-popup',
  templateUrl: './economic-damage-popup.component.html',
  styleUrls: ['./economic-damage-popup.component.scss']
})
export class EconomicDamagePopupComponent implements OnInit {

  @Input() metaData: DeusMetaData;
  @Input() layer: TileLayer<TileWMS>;
  @Input() event: MapBrowserEvent<any>;
  @Input() title: string;
  public loss$: Observable<number>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const url = this.layer.getSource().getFeatureInfoUrl(
      this.event.coordinate,
      this.event.frameState.viewState.resolution,
      this.event.frameState.viewState.projection.getCode(),
      { 'INFO_FORMAT': 'application/json' }
    );

    this.loss$ = this.http.get(url).pipe(
      map((getFeatureInfoData: any) => {
        const props: DeusGetFeatureInfo = getFeatureInfoData.features[0].properties; 
        return +(props.loss_value).toFixed(0);
      })
    );
  }

}
