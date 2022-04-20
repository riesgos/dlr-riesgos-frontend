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
      map((getFeatureInfoData: any) => {
        const props = getFeatureInfoData.features[0].properties;
        console.log(props)

        const parsedData: GroupedBarChartData[] = [];
        for (const key in props) {
          if (key[0] === 'c') {
            const taxonomy = key;
            const damageCounts = props[key] === '' ? {} : JSON.parse(props[key]);
            for (const damageClass in damageCounts) {
              const count = damageCounts[damageClass];

              let groupData = parsedData.find(p => p.groupName === damageClass);
              if (!groupData) {
                groupData = { groupName: damageClass, subGroups: [] };
                parsedData.push(groupData);
              }
              let subGroup = groupData.subGroups.find(sg => sg.key === taxonomy);
              if (!subGroup) {
                subGroup = { key: taxonomy, val: 0 };
                groupData.subGroups.push(subGroup);
              }
              subGroup.val += count;
            }
          }
        }

        return parsedData;
      }
      ));
  }

  public containsData(parsedData: GroupedBarChartData[]) {
    let count = 0;
    for (const groupData of parsedData) {
      for (const subGroupData of groupData.subGroups) {
        count += subGroupData.val;
      }
    }
    return count > 0.0;
  }

}
