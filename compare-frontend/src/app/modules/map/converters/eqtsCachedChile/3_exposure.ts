import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import { FeatureLike } from "ol/Feature";
import { BarchartComponent } from "../../popups/barchart/barchart.component";
import { BarDatum } from "src/app/helpers/d3charts";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { TranslationService } from "src/app/services/translation.service";
import { Injectable } from "@angular/core";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";


@Injectable()
export class CachedExposureChile implements Converter {

    constructor(private translator: TranslationService) {}

    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "PeruCached" &&  step === "ExposureChile";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const resolvedData = data.find(p => p.id === "exposureChile");
        if (!resolvedData || !resolvedData.value) return of([]);

        const fullUrl = new URL(resolvedData.value);
        const baseUrl = fullUrl.origin + fullUrl.pathname;
        const layers = fullUrl.searchParams.get("LAYERS");
        const style = fullUrl.searchParams.get("STYLE");

        return of([{
            id: "exposureLayer",
            stepId: "ExposureChile",
            visible: true,
            layer: new TileLayer({
                source: new TileWMS({
                    url: baseUrl,
                    params: {
                        'LAYERS': layers,
                        'STYLE': style
                    }
                })
            }),
            onClick: () => {},
            onHover: () => {},
            popup: (location: number[], features: FeatureLike[]) => {

                if (features.length === 0) return undefined;

                const props = features[0].getProperties();
                const buildings = parseInt(props["buildings"]);

                if (buildings <= 0) {
                    return {
                        component: StringPopupComponent,
                        args: {
                            body: 'no_residential_buildings'
                        }
                    }
                }
                return {
                    component: StringPopupComponent,
                    args: {
                        body: this.translator.translate('ResidentialBuildings') + `: ` + buildings
                    }
                }
             }
        }]);
    }

}