import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import { Vector } from "ol/source";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Style from "ol/style/Style";
import { greenYellowRedRange } from "src/app/helpers/colorhelpers";
import { createKeyValueTableHtml } from "src/app/helpers/others";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { TranslationService } from "src/app/services/translation.service";
import { Injectable } from "@angular/core";


@Injectable()
export class SysRel implements Converter {

    constructor(private translate: TranslationService) {}

    applies(scenario: ScenarioName, step: string): boolean {
        return step === "SysRel";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const datum = data.find(d => d.id === "sysRel");
        if (!datum) return of([]);

        const layer: LayerComposite = {
            id: "Productname_system_reliability_vector",
            stepId: "SysRel",
            layer: new VectorLayer({
                source: new Vector({
                    features: new GeoJSON().readFeatures(datum.value)
                }),
                style: (feature) => {
                    const props = feature.getProperties();
                    let probDisr = 0;
                    if (props['Prob_Disruption']) {
                        probDisr = props['Prob_Disruption'];
                    }
    
                    const [r, g, b] = greenYellowRedRange(0, 1, probDisr);
    
                    return new Style({
                      fill: new Fill({
                        color: [r, g, b, 0.5],
                      }),
                      stroke: new Stroke({
                        color: [r, g, b, 1],
                        width: 2
                      })
                    });
                }
            }),
            popup: (location, features) => {
                const feature = features[0];
                const props = feature.getProperties();
                const selectedProps: any = {};
                // selectedProps[this.translate.translate('Area')] = (+props['Area']).toFixed(2);
                selectedProps[this.translate.translate('Prob_Interuption')] = (+props['Prob_Disruption'] * 100).toFixed(2) + "%";
                const table = createKeyValueTableHtml(selectedProps);

                return {
                    component: StringPopupComponent,
                    args: {
                        title: 'PowerGrid',
                        body: table
                    }
                }
            },
            onClick: () => undefined,
            onHover: () => undefined,
            visible: true
        };

        return of([layer]);
    }

}