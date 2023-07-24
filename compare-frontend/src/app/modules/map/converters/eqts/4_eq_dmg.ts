import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { DamagePopupComponent } from "../../popups/damage-popup/damage-popup.component";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { createTableHtml } from "src/app/helpers/others";

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
            stepId: "EqDamage",
            layer: new TileLayer({
                source: new TileWMS({
                    url: `${wms.origin}/${wms.pathname}`,
                    params: {
                        "LAYERS": wms.searchParams.get('layers'),
                        "FORMAT": wms.searchParams.get('format'),
                        "VERSION": wms.searchParams.get('Version'),
                        "STYLES": "style-damagestate-sara-plasma",
                    }
                })
            }),
            onClick: (location, features) => undefined,
            onHover: (location, features) => undefined,
            popup: (location, features) => {
                if (features.length <= 0) {
                    return {
                        component: StringPopupComponent,
                        args: {
                            title: "earthquake_damage_classification",
                            body: 'no_residential_buildings'
                        }
                    }
                } else {
                    return {
                        component: DamagePopupComponent,
                        args: {
                            feature: features[0],
                            metaData: summaryProduct.value,
                            xLabel: 'damage',
                            yLabel: 'Nr_buildings',
                            schema: 'SARA_v1.0',
                            heading: 'earthquake_damage_classification',
                            additionalText: 'DamageStatesSara'
                        }
                    };
                }
            },
            visible: true,
        };

        const econLayer: LayerComposite = {
            id: "EqDamage-WMS-econ",
            stepId: "EqDamage",
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
                        title: "eq-economic-loss-title",
                        body: createTableHtml([[loss]])
                    }
                };
            },
            opacity: 1.0,
            visible: true
        };

        return of([dmgLayer, econLayer]);
    }

}