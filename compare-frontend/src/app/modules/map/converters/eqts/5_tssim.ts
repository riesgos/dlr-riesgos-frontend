import { Observable, map, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter, LayerComposite } from "../../converter.service";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable()
export class TsSim implements Converter {

    constructor(private http: HttpClient) {}

    applies(scenario: ScenarioName, step: string): boolean {
        return step === 'Tsunami';
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const wmsProduct = data.find(d => d.id === 'tsWms');
        if (!wmsProduct) return of([]);

        const capabiltiesUrl = wmsProduct.value;
        const url = new URL(capabiltiesUrl);
        const baseUrl = `${url.origin}${url.pathname}?service=wms&version=${url.searchParams.get("version")}`;
        const layerNumber = +url.pathname.replace("/tsuna_geoserver/", "").replace("/ows", "");

        const layers: LayerComposite[] = [{
            id: "mwh",
            layer: new TileLayer({
                source: new TileWMS({
                    url: baseUrl,
                    params: {
                        "LAYERS": `${layerNumber}_mwh`,
                    }
                })
            }),
            onClick: (location, features) => undefined,
            onHover: (location, features) => undefined,
            popup: (location, features) => undefined,
            opacity: 1.0,
        }, {
            id: "mwhLand_global",
            layer: new TileLayer({
                source: new TileWMS({
                    url: baseUrl,
                    params: {
                        "LAYERS": `${layerNumber}_mwhLand_global`,
                    }
                })
            }),
            onClick: (location, features) => undefined,
            onHover: (location, features) => undefined,
            popup: (location, features) => undefined,
            opacity: 1.0,
        }, {
            id: "mwhLand_local",
            layer: new TileLayer({
                source: new TileWMS({
                    url: baseUrl,
                    params: {
                        "LAYERS": `${layerNumber}_mwhLand_local`,
                    }
                })
            }),
            onClick: (location, features) => undefined,
            onHover: (location, features) => undefined,
            popup: (location, features) => undefined,
            opacity: 1.0,
        }, {
            id: "arrivalTimes",
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
            opacity: 1.0,
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
                    opacity: 1.0,
                })
            }

            return layers;
        }));

        return layers$;
    }
}