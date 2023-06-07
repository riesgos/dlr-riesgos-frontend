import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import TileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import TileWMS from "ol/source/TileWMS";

export class EqDmg implements Converter {

    applies(scenario: ScenarioName, step: string): boolean {
        return step === "EqDamage";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const wmsProduct = data.find(p => p.id === "eqDamageWms");
        if (!wmsProduct) return of([]);
        const summaryProduct = data.find(d => d.id === "eqDamageSummary");
        if (!summaryProduct) return of([]);

        const wms = new URL(wmsProduct.value);

        const dmgLayer: LayerComposite = {
            id: "EqDamage-WMS-damage",
            layer: new TileLayer({
                source: new TileWMS({
                    url: `${wms.origin}/${wms.pathname}`,
                    params: {
                        "LAYERS": wms.searchParams.get('layers'),
                        "FORMAT": wms.searchParams.get('format'),
                        "VERSION": wms.searchParams.get('Version'),
                        "STYLE": "style-peru-plasma",
                    }
                })
            }),
            onClick: (location, features) => undefined,
            onHover: (location, features) => undefined,
            popup: (location, features) => {
                return undefined;
            },
            opacity:  1.0,
        };

        const econLayer: LayerComposite = {
            id: "EqDamage-WMS-econ",
            layer: new TileLayer({
                source: new TileWMS({
                    url: `${wms.origin}/${wms.pathname}`,
                    params: {
                        "LAYERS": wms.searchParams.get('layers'),
                        "FORMAT": wms.searchParams.get('format'),
                        "VERSION": wms.searchParams.get('Version'),
                        "STYLE": "style-cum-loss-peru-plasma"
                    }
                })
            }),
            onClick: (location, features) => undefined,
            onHover: (location, features) => undefined,
            popup: (location, features) => {
                return undefined;
            },
            opacity: 1.0,
        };

        return of([dmgLayer, econLayer]);
    }

}