import { Observable, map, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { toDecimalPlaces } from "src/app/helpers/colorhelpers";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { createTableHtml } from "src/app/helpers/others";
import { TranslationService } from "src/app/services/translation.service";


@Injectable()
export class TsSimChile implements Converter {

    constructor(
        private http: HttpClient,
        private translation: TranslationService
    ) {}

    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "ChileShort" &&  step === 'TsunamiChile';
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const wmsProduct = data.find(d => d.id === "tsWmsChile");
        if (!wmsProduct) return of([]);

        const capabiltiesUrl = wmsProduct.value;
        const url = new URL(capabiltiesUrl);
        const baseUrl = `${url.origin}${url.pathname}?service=wms&version=${url.searchParams.get("version")}`;
        const layerNumberRegex = /\/(\d+)\//;
        const matchResult = url.pathname.match(layerNumberRegex);
        let layerNumber = matchResult 
                        ? matchResult[1] 
                        : url.pathname.replace("/tsuna_geoserver/", "").replace("/tsunageoserver/", "").replace("/ows", "");


        const layers: LayerComposite[] = [{
        //     id: "mwh",
        //     stepId: "TsunamiChile",
        //     layer: new TileLayer({
        //         source: new TileWMS({
        //             crossOrigin: 'anonymous', // so that the layer can be checked for alpha when checking if popup should be shown
        //             url: baseUrl,
        //             params: {
        //                 "LAYERS": `${layerNumber}_mwh`,
        //             }
        //         })
        //     }),
        //     onClick: (location, features) => undefined,
        //     onHover: (location, features) => undefined,
        //     popup: (location, features) => {
        //         const props = features[0].getProperties();
        //         let entry = `${toDecimalPlaces(props['GRAY_INDEX'], 2)} m`;
        //         if (props['GRAY_INDEX'] > 1000) entry = this.translation.translate('no_data');
        //         return {
        //             component: StringPopupComponent,
        //             args: {
        //                 title: `mwh`,
        //                 body: createTableHtml([[entry]])
        //             }  
        //         };
        //     },
        //     opacity: 1.0,
        //     visible: true
        // }, {
            id: "mwhLand_local",
            stepId: "TsunamiChile",
            layer: new TileLayer({
                source: new TileWMS({
                    crossOrigin: 'anonymous', // so that the layer can be checked for alpha when checking if popup should be shown
                    url: baseUrl,
                    params: {
                        "LAYERS": `${layerNumber}_mwhLand_local`,
                    }
                })
            }),
            onClick: (location, features) => undefined,
            onHover: (location, features) => undefined,
            popup: (location, features) => {
                const props = features[0].getProperties();
                let entry = `${toDecimalPlaces(props['GRAY_INDEX'], 2)} m`;
                if (props['GRAY_INDEX'] > 1000) entry = this.translation.translate('no_data');
                return {
                    component: StringPopupComponent,
                    args: {
                        title: `mwhLand_local`,
                        body: createTableHtml([[entry]])
                    }  
                };
            },
            opacity: 1.0,
            visible: true
        }, {
            id: "arrivalTimes",
            stepId: "TsunamiChile",
            layer: new TileLayer({
                source: new TileWMS({
                    url: baseUrl,
                    params: {
                        "LAYERS": `${layerNumber}_arrivalTimes`,
                    }
                })
            }),
            onClick: (location, features) => undefined,
            onHover: (location, features) => undefined,
            popup: (location, features) => undefined,
            opacity: 0.5,
            visible: true
        }];


        return of(layers);
    }


    private autoParseLayers(baseUrl: string, capabiltiesUrl: string) {
        const capabilties$ = this.http.get(capabiltiesUrl, { headers: {'Content-Type': 'text/xml', 'Accept': 'text/xml, application/xml' }, responseType: 'text' });


        const layers$ = capabilties$.pipe(map(capabilties => {

            const url = new URL(capabiltiesUrl);
            const baseUrl = `${url.origin}/${url.pathname}?service=wms&version=${url.searchParams.get("version")}`;

            const parser = new DOMParser();
            const xml = parser.parseFromString(capabilties, "text/xml");
            const xmlLayers = xml.getElementsByTagName("Layer")[0].getElementsByTagName("Layer");
            const layerData = [];
            for (const [_, layer] of Object.entries(xmlLayers)) {
                layerData.push({
                    layerName: layer.getElementsByTagName("Name")[0].textContent,
                    legendUrl: layer.getElementsByTagName("Style")[0].getElementsByTagName("LegendURL")[0].getElementsByTagName("OnlineResource")[0].attributes[2].textContent,
                    styleName: layer.getElementsByTagName("Style")[0].getElementsByTagName("Name")[0].textContent
                })
            }
    
            const layers: LayerComposite[] = [];
            for (const layerDatum of layerData) {
                layers.push({
                    id: layerDatum.layerName + "",
                    stepId: "TsunamiChile",
                    layer: new TileLayer({
                        source: new TileWMS({
                            url: baseUrl,
                            params: {
                                "LAYERS": layerDatum.layerName,
                                "STYLES": layerDatum.styleName
                            }
                        })
                    }),
                    onClick: (location, features) => undefined,
                    onHover: (location, features) => undefined,
                    popup: (location, features) => undefined,
                    visible: true,
                })
            }

            return layers;
        }));

        return layers$;
    }
}