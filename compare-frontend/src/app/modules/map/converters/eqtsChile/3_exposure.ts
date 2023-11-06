import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import { BarDatum } from "src/app/helpers/d3charts";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { TranslationService } from "src/app/services/translation.service";
import { Injectable } from "@angular/core";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";


@Injectable()
export class ExposureChile implements Converter {

    constructor(private translator: TranslationService) {}

    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "ChileShort" &&  step === "ExposureChile";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {

        const wmsProduct = data.find(p => p.id === "exposureWmsChile");
        if (!wmsProduct) return of([]);
        const summaryProduct = data.find(d => d.id === "exposureMetaChile");
        // if (!summaryProduct) return of([]);

        const wms = new URL(wmsProduct.value);

        return of([{
            id: "exposureLayer",
            stepId: "ExposureChile",
            visible: true,
            layer: new TileLayer({
                source: new TileWMS({
                    url: `${wms.origin}/${wms.pathname}`,
                    params: {
                        "LAYERS": wms.searchParams.get('layers'),
                        "FORMAT": wms.searchParams.get('format'),
                        "VERSION": wms.searchParams.get('Version'),
                        "STYLES": "style-exposure",
                    }
                })
            }),
            onClick: () => {},
            onHover: () => {},
            popup: (location, features) => {

                if (features.length === 0) return undefined;
                const customColumns = summaryProduct ? 
                                    summaryProduct.value[0]["custom_columns"] : 
                                    { c1: "MCF-DNO-H1-3",  c2: "MUR-STDRE-H1-2",  c3: "MUR-ADO-H1-2",  c4: "MUR-H1-3",  c5: "UNK",  c6: "MCF-DUC-H1-3",  c7: "CR-LWAL-DNO-H1-3",  c8: "CR-PC-LWAL-H1-3",  c9: "CR-LWAL-DUC-H1-3", c10: "CR-LWAL-DNO-H4-7",  c11: "MR-DNO-H1-3",  c12: "MR-DUC-H1-3",  c13: "CR-LWAL-DUC-H4-7",  c14: "W-WLI-H1-3",  c15: "W-WS-H1-2",  c16: "CR-LWAL-DUC-H8-19" };

                const props = features[0].getProperties();


                const data: BarDatum[] = [];
                for (const [key, value] of Object.entries(props)) {
                    if (key[0] !== "c") continue;

                    const tax = customColumns[key];
                    const bld = value;
                    if (!data.map(dp => dp.label).includes(tax)) {
                        data.push({
                        label: tax,
                        value: bld,
                        hoverText: `${bld} - {{ ${tax} }}`
                        });
                    } else {
                        const datum = data.find(dp => dp.label === tax);
                        if (datum) datum.value += bld;
                    }
                }

                if (data.length <= 0) {
                    return {
                        component: StringPopupComponent,
                        args: {
                            body: 'no_residential_buildings'
                        }
                    }
                }

                // return {
                //     component: BarchartComponent,
                //     args: {
                //         data: data,
                //         width: 350,
                //         height: 300,
                //         xLabel: `Taxonomy`,
                //         yLabel: `Buildings`,
                //         title: `Exposure`,
                //         smallPrint: `popupHoverForInfo`
                //     }
                // }
                return {
                    component: StringPopupComponent,
                    args: {
                        body: this.translator.translate('ResidentialBuildings') + `: ` + Math.round(data.reduce((last, curr) => curr.value + last, 0))
                    }
                }
             }
        }]);
    }

}