import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";


export class Exposure implements Converter {

    applies(scenario: ScenarioName, step: string): boolean {
        return step === "Exposure";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const resolvedData = data.find(p => p.id === "exposure");
        if (!resolvedData || !resolvedData.value) return of([]);

        return of([{
            id: "exposureLayer",
            visible: true,
            layer: new VectorLayer({
                source: new VectorSource({
                    features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(resolvedData.value)
                })
            }),
            popup: (location: number[]) => ({
                component: StringPopupComponent,
                args: {}  
            }),
            onClick: () => {},
            onHover: () => {},
        }]);
    }

}