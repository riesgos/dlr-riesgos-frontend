import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import { FeatureLike } from "ol/Feature";


export class Exposure implements Converter {

    applies(scenario: ScenarioName, step: string): boolean {
        return step === "Exposure";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const resolvedData = data.find(p => p.id === "exposure");
        if (!resolvedData || !resolvedData.value) return of([]);

        const featureStyle = (feature: FeatureLike, resolution: number) => {

            const props = feature.getProperties();
            const expo = props['expo'];
            let total = 0;
            for (let i = 0; i < expo.Damage.length; i++) {
                const nrBuildings = expo.Buildings[i];
                total += nrBuildings;
            }

            let r = 160;
            let g = 160;
            let b = 160;
            let a = 0.05;
            if (total === 0) {
                a = 0.9;
            }
      
            return new Style({
              fill: new Fill({
                color: [r, g, b, a],
      
              }),
              stroke: new Stroke({
                color: [r, g, b, 1],
                width: 2
              })
            });
          }

        return of([{
            id: "exposureLayer",
            visible: true,
            layer: new VectorLayer({
                source: new VectorSource({
                    features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(resolvedData.value)
                }),
                style: featureStyle
            }),
            onClick: () => {},
            onHover: () => {},
            popup: (location, features) => { return undefined }
        }]);
    }

}