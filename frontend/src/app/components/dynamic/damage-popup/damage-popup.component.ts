import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getBuildingClassColor } from 'src/app/helpers/colorhelpers';
import { Grouping } from '../../grouped-bar-chart/grouped-bar-chart.component';
import { GroupedBarChartData, GroupingFunction, SubGroupData } from '../../grouped-bar-chart/groupedChart';
import { createGrouping, randomColoring, simpleGrouping } from '../../grouped-bar-chart/helpers';



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
    id: number;
    loss_value: number;
    m_tran: number;
    w_damage: number;
    buildings: number;
    cum_loss: number;

    // c1: "{\"0\": 0.02442021380081097, \"3\": 2.381905801865897, \"4\": 0.10929930984616784, \"5\": 0.03522856886055951, \"6\": 0.14500959438330494, \"1\": 0.6775074755532385, \"2\": 1.1766290356022646}"
    // c2: "{\"1\": 7.700393077972102, \"3\": 8.806060495293702, \"4\": 1.992898379397825, \"5\": 0.27236831057255384, \"6\": 1.6996141567980563, \"2\": 3.693767908595236, \"0\": 0.03489767128868227}"
    // c3: "{\"1\": 0.4153901661408888, \"3\": 0.7532231248516054, \"4\": 0.14929400496884115, \"5\": 0.013462331077462088, \"6\": 0.11904088975335061, \"2\": 0.5158708433288897, \"0\": 0.01371863985666362}"
    // c4: "{\"0\": 0.023695955320487686, \"3\": 1.9458996836488325, \"4\": 0.08243970906501943, \"5\": 0.025020449861622156, \"6\": 0.10143146713112028, \"1\": 0.6268320214390444, \"2\": 1.0446807134736436}"
    // c5: "{\"1\": 0.3118755323129045, \"2\": 1.7682649961934733, \"3\": 2.546810283245389, \"4\": 0.5840119686576659, \"5\": 0.017866991577783597, \"6\": 1.300182141691001, \"0\": 0.1359880861245707}"
    // c6: "{\"1\": 0.3245962107930212, \"2\": 4.43293492716497, \"3\": 5.0076656248917395, \"4\": 1.03716541337284, \"5\": 0.02120955674982148, \"6\": 2.4252200223734133, \"0\": 0.4162082437543237}"
    // c7: "{\"0\": 0.012237365474786375, \"1\": 0.058887565879565486, \"2\": 0.3780194982396806, \"3\": 0.16325744312174145, \"4\": 0.016394635364265924, \"5\": 0.0003756192375781044, \"6\": 0.01582787267939359}"
    // c8: "{\"0\": 0.0857857999576482, \"1\": 0.14607966041248288, \"2\": 1.2950295489531523, \"3\": 2.4362950836292256, \"4\": 0.5916908678289967, \"5\": 0.0105224303741546, \"6\": 1.4295966088409946}"
    // c9: "{\"1\": 0.13432788846620078, \"2\": 0.3991684551144061, \"3\": 0.25947378573955016, \"4\": 0.030232210768035606, \"5\": 0.00218819845114434, \"6\": 0.012335360869984966, \"0\": 0.012274100592684757}"
    // c10: "{\"0\": 0.012070822741213296, \"1\": 0.055518391006922296, \"2\": 0.3729407352954095, \"3\": 0.14741722033827243, \"4\": 0.00956789941042361, \"5\": 6.22255054449312e-05, \"6\": 0.0024227057023104267}"
    // c11: ""
    // c12: ""
    // c13: ""
    // c14: ""
    // c15: ""
    // c16: ""
    // [key: string]: string;
}



function saraGroupingMaterial(inputGroups: SubGroupData[]): SubGroupData[] {
  return createGrouping(0)(inputGroups);
}

function createSubstringGrouping(labels: string[]): GroupingFunction {
  return (oldGroups: SubGroupData[]): SubGroupData[] => {
    
    const newGroups: SubGroupData[] = [];
    for (const newGroupKey of labels) {
      const newGroup: SubGroupData = {
        key: newGroupKey,
        val: 0
      };
      for (const oldGroup of oldGroups) {
        if (oldGroup.key.includes(newGroupKey)) {
          newGroup.val += oldGroup.val;
        }
      }
      newGroups.push(newGroup);
    }
    return newGroups;
  }
}

const saraGroupingSubtype = createSubstringGrouping(['UNK', 'LDUAL', 'LFINF', 'LWAL', 'ETR', 'STDRE', 'STRUB', 'WBB', 'WHE', 'WLI', 'WS', 'WWD']);

const saraGroupingHeight = createSubstringGrouping(['UNK', 'H1', 'H1-2', 'H1-3', 'H4-7', 'H8-19']);

const groupings = {
  'SARA_v1.0': [{
    label: 'material',
    coloringFunction: getBuildingClassColor,
    groupingFunction: saraGroupingMaterial
  }, {
    label: 'subtype',
    coloringFunction: getBuildingClassColor,
    groupingFunction: saraGroupingSubtype
  }, {
    label: 'height',
    coloringFunction: getBuildingClassColor,
    groupingFunction: saraGroupingHeight
  }],

  'SUPPASRI2013_v2.0': [{
    label: 'type',
    coloringFunction: getBuildingClassColor,
    groupingFunction: simpleGrouping
  }],

  'Medina_2019': [{
    label: 'type',
    coloringFunction: getBuildingClassColor,
    groupingFunction: simpleGrouping
  }]
};


export type knownSchemas = 'SARA_v1.0' | 'SUPPASRI2013_v2.0' | 'Medina_2019';

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
  @Input() schema: knownSchemas;
  @Input() additionalText?: string;
  public width = 400;
  public height = 400;
  public groupings: Grouping[];
  public baseData$: Observable<GroupedBarChartData[]>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.groupings = groupings[this.schema];

    const url = this.layer.getSource().getFeatureInfoUrl(
      this.event.coordinate,
      this.event.frameState.viewState.resolution,
      this.event.frameState.viewState.projection.getCode(),
      { 'INFO_FORMAT': 'application/json' }
    );

    this.baseData$ = this.http.get(url).pipe(
      map((getFeatureInfoData: any) => {
        const data = getFeatureInfoData.features[0];
        const props: DeusGetFeatureInfo = data.properties;

        const parsedData: GroupedBarChartData[] = [];
        for (const key in props) {
          if (key.match(/c\d+/)) {
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
