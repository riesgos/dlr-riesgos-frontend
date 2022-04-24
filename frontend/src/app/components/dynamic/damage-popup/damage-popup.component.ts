import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Grouping } from '../../grouped-bar-chart/grouped-bar-chart.component';
import { GroupedBarChartData } from '../../grouped-bar-chart/groupedChart';
import { createGrouping, randomColoring } from '../../grouped-bar-chart/helpers';



export interface DeusMetaData {
  custom_columns: {[key: string]: string},
  loss_unit: string;
  total: {
    loss_value: number,
    transition_matrix_from_damage_state: {
      [from_state: string]: {
        [to_state: string]: number
      }
    },
    buildings_by_damage_state: {
      [state: string]: number
    }
  }
}

export interface DeusGetFeatureInfo {
    id: string;
    loss_value: number;
    m_tran: number;
    w_damage: number;
    // [key: string]: string;
}


@Component({
  selector: 'app-damage-popup',
  templateUrl: './damage-popup.component.html',
  styleUrls: ['./damage-popup.component.scss']
})
export class DamagePopupComponent implements OnInit {

  @Input() metaData: DeusMetaData;
  @Input() layer: TileLayer<TileWMS>;
  @Input() event: MapBrowserEvent<any>;
  @Input() xLabel: string;
  @Input() yLabel: string;
  public width = 400;
  public height = 400;
  public groupings: Grouping[] = [{
    label: 'material',
    coloringFunction: randomColoring,
    groupingFunction: createGrouping(0)
  }, {
    label: 'other',
    coloringFunction: randomColoring,
    groupingFunction: createGrouping(1)
  }, {
    label: 'yet other',
    coloringFunction: randomColoring,
    groupingFunction: createGrouping(2)
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
        const props: DeusGetFeatureInfo = getFeatureInfoData.features[0].properties;

        const parsedData: GroupedBarChartData[] = [];
        for (const key in props) {
          if (key[0] === 'c') {
            const translation = this.metaData.custom_columns[key];
            const taxonomyMatch = translation.match(/Buildings in (\S*) per damage state/);
            if (taxonomyMatch && taxonomyMatch[1]) {
              const taxonomy = taxonomyMatch[1];
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
