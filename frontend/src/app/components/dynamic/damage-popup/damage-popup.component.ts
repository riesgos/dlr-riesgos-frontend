import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getBuildingClassColor } from 'src/app/helpers/colorhelpers';
import { DeusGetFeatureInfo, DeusMetaData } from 'src/app/riesgos/scenarios/chile/deus';
import { SimplifiedTranslationService } from 'src/app/services/simplifiedTranslation/simplified-translation.service';
import { Grouping } from '../../grouped-bar-chart/grouped-bar-chart.component';
import { GroupedBarChartData, GroupingFunction, SubGroupData } from '../../grouped-bar-chart/groupedChart';
import { createGrouping, randomColoring, simpleGrouping } from '../../grouped-bar-chart/helpers';






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

function allIntoOneGrouping(oldGroups: SubGroupData[]): SubGroupData[] {
  const newGroups: SubGroupData[] = [{
    key: '',
    val: 0
  }];
  for (const oldGroup of oldGroups) {
    newGroups[0].val += oldGroup.val;
  }
  return newGroups;
}

const saraGroupingSubtype = createSubstringGrouping(['LDUAL', 'LFINF', 'LWAL', 'ETR', 'STDRE', 'STRUB', 'WBB', 'WHE', 'WLI', 'WS', 'WWD']);

const saraGroupingHeight = createSubstringGrouping(['H1', 'H1-2', 'H1-3', 'H4-7', 'H8-19']);




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
  @Input() schema: knownSchemas;
  @Input() additionalText?: string;
  @Input() heading?: string;
  public width = 350;
  public height = 350;
  public groupings: Grouping[];
  public baseData$: Observable<GroupedBarChartData[]>;

  constructor(private http: HttpClient, private translateSvc: SimplifiedTranslationService) { }

  ngOnInit(): void {


    const groupings: {[key: string]: Grouping[]} = {
      'SARA_v1.0': [{
        id: 'SARA_base',
        label: () => this.translateSvc.syncTranslate('bundled'),
        xLabel: () => this.translateSvc.syncTranslate('damage-class'),
        yLabel: () => this.translateSvc.syncTranslate('quantity'),
        coloringFunction: getBuildingClassColor,
        groupingFunction: allIntoOneGrouping
      }, {
        id: 'SARA_material',
        label: () => this.translateSvc.syncTranslate('material'),
        xLabel: () => this.translateSvc.syncTranslate('damage-class'),
        yLabel: () => this.translateSvc.syncTranslate('quantity'),
        coloringFunction: getBuildingClassColor,
        groupingFunction: saraGroupingMaterial
      }, {
        id: 'SARA_height',
        label: () => this.translateSvc.syncTranslate('height'),
        xLabel: () => this.translateSvc.syncTranslate('damage-class'),
        yLabel: () => this.translateSvc.syncTranslate('quantity'),
        coloringFunction: getBuildingClassColor,
        groupingFunction: saraGroupingHeight
      }, {
        id: 'SARA_all',
        label: () => this.translateSvc.syncTranslate('all classes'),
        xLabel: () => this.translateSvc.syncTranslate('damage-class'),
        yLabel: () => this.translateSvc.syncTranslate('quantity'),
        coloringFunction: getBuildingClassColor,
        groupingFunction: data => data
      }],
    
      'SUPPASRI2013_v2.0': [{
        id: 'suppasri_base',
        label: () => this.translateSvc.syncTranslate('type'),
        xLabel: () => this.translateSvc.syncTranslate('category'),
        yLabel: () => this.translateSvc.syncTranslate('quantity'),
        coloringFunction: getBuildingClassColor,
        groupingFunction: simpleGrouping
      }],
    
      'Medina_2019': [{
        id: 'medina_base',
        label: () => this.translateSvc.syncTranslate('type'),
        xLabel: () => this.translateSvc.syncTranslate('category'),
        yLabel: () => this.translateSvc.syncTranslate('quantity'),
        coloringFunction: getBuildingClassColor,
        groupingFunction: simpleGrouping
      }]
    };



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
