import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import { TileWMS, Vector } from "ol/source";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Style from "ol/style/Style";
import { greenYellowRedRange } from "src/app/helpers/colorhelpers";
import { createKeyValueTableHtml } from "src/app/helpers/others";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { TranslationService } from "src/app/services/translation.service";
import { Injectable } from "@angular/core";
import TileLayer from "ol/layer/Tile";


@Injectable()
export class CachedSysRel implements Converter {

    constructor(private translate: TranslationService) {}

    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "PeruCached" &&  step === "SysRel";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const datum = data.find(d => d.id === "sysRel");
        if (!datum) return of([]);

        const url = new URL(datum.value);
        const baseUrl = `${url.origin}${url.pathname}?service=wms&version=${url.searchParams.get("VERSION")}`;


        const layer: LayerComposite = {
            id: "Productname_system_reliability_vector",
            stepId: "SysRel",
            layer: new TileLayer({
                source: new TileWMS({
                    url: baseUrl,
                    params: {
                        "LAYERS": url.searchParams.get('LAYERS'),
                    }
                }),
            }),
            popup: (location, features) => {
                const feature = features[0];
                const props = feature.getProperties();
                const selectedProps: any = {};
                selectedProps[this.translate.translate('Prob_Interuption')] = Math.round(+props['Prob_Disru'] * 100) + " %";
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