import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Grouping } from '../../grouped-bar-chart/grouped-bar-chart.component';
import { GroupedBarChartData } from '../../grouped-bar-chart/groupedChart';
import { randomColoring } from '../../grouped-bar-chart/helpers';

@Component({
  selector: 'app-damage-popup',
  templateUrl: './damage-popup.component.html',
  styleUrls: ['./damage-popup.component.scss']
})
export class DamagePopupComponent implements OnInit {

  @Input() layer: TileLayer<TileWMS>;
  @Input() event: MapBrowserEvent<any>;
  @Input() xLabel: string;
  @Input() yLabel: string;
  public width = 400;
  public height = 400;
  public groupings: Grouping[] = [{
    label: 'default',
    coloringFunction: randomColoring,
    groupingFunction: v => v
  }];
  public baseData$: Observable<GroupedBarChartData[]>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const url = this.layer.getSource().getFeatureInfoUrl(
      this.event.coordinate,
      this.event.frameState.viewState.resolution,
      this.event.frameState.viewState.projection.getCode(),
      { 'INFO_FORMAT': 'application/json' }
    );

    this.baseData$ = this.http.get(url).pipe(
      map((data: any) => {
        const props = data.features[0].properties;
        const classes = Object.keys(props).filter(k => k[0] === 'c');
        const states = Object.keys(JSON.parse(props[classes[0]]));
        const parsedData: GroupedBarChartData[] = [];
        for (const state in states) {
          parsedData.push({
            groupName: state,
            subGroups: []
          })
        }
        for (const cls of classes) {
          const dt = JSON.parse(props[cls]);
          if (dt) {
            for (const state in dt) {
              const count = dt[state];
              const pd = parsedData.find(pd => pd.groupName === state);
              if (pd) {
                pd.subGroups.push({ key: cls, val: count });
              }
            }
          }
        }
        return parsedData;
      }
      ));
  }

}
