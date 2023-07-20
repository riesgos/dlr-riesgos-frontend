import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { DamagePopupComponent } from "../../popups/damage-popup/damage-popup.component";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { createTableHtml } from "src/app/helpers/others";

export class TSDmg implements Converter {

    applies(scenario: ScenarioName, step: string): boolean {
        return step === "TsDamage";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const wmsProduct = data.find(p => p.id === "tsDamageWms");
        if (!wmsProduct) return of([]);
        const summaryProduct = data.find(d => d.id === "tsDamageSummary");
        if (!summaryProduct) return of([]);

        const schema = data.find(d => d.id === "schemaTs")?.value || "Medina_2019";

        const wms = new URL(wmsProduct.value);

        const dmgLayer: LayerComposite = {
            id: "TsDamage-WMS-damage",
            stepId: "TsDamage",
            layer: new TileLayer({
                source: new TileWMS({
                    url: `${wms.origin}/${wms.pathname}`,
                    params: {
                        "LAYERS": wms.searchParams.get('layers'),
                        "FORMAT": wms.searchParams.get('format'),
                        "VERSION": wms.searchParams.get('Version'),
                        "STYLES": `style-damagestate-${schema === "Medina_2019" ? "medina" : "suppasri"}-plasma`,
                    }
                })
            }),
            onClick: (location, features) => undefined,
            onHover: (location, features) => undefined,
            popup: (location, features) => {

                return {
                    component: DamagePopupComponent,
                    args: {
                        feature: features[0],
                        metaData: summaryProduct.value,
                        xLabel: 'damage',
                        yLabel: 'Nr_buildings',
                        schema: schema,
                        heading: 'earthquake_damage_classification',
                        additionalText: schema === "Medina_2019" ? "DamageStatesSara" : "DamageStatesSuppasri"
                    }
                };
            },
            visible: true,
        };

        const econLayer: LayerComposite = {
            id: "TsDamage-WMS-econ",
            stepId: "TsDamage",
            layer: new TileLayer({
                source: new TileWMS({
                    url: `${wms.origin}/${wms.pathname}`,
                    params: {
                        "LAYERS": wms.searchParams.get('layers'),
                        "FORMAT": wms.searchParams.get('format'),
                        "VERSION": wms.searchParams.get('Version'),
                        "STYLES": "style-cum-loss-peru-plasma"
                    }
                })
            }),
            onClick: (location, features) => undefined,
            onHover: (location, features) => undefined,
            popup: (location, features) => {

                let loss = 'no_data';
                if (features.length > 0) {
                    const props = features[0].getProperties();
                    loss = +(props['cum_loss'] / 1_000_000).toFixed(3) + 'MUSD';
                }

                return {
                    component: StringPopupComponent,
                    args: {
                        title: "ts-economic-loss-title",
                        body: createTableHtml([[loss]])
                    }
                };
            },
            visible: true,
        };

        return of([dmgLayer, econLayer]);
    }

}