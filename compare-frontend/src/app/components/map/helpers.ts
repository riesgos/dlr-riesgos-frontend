import Layer from "ol/layer/Layer";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Partition, RiesgosProductResolved, ScenarioName } from "src/app/state/state";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import TileWMS from "ol/source/TileWMS";

export function getMapPositionForStep(scenario: ScenarioName, partition: Partition, stepId: string): {center: number[], zoom: number} {
    if (scenario === 'PeruShort') {
        switch (stepId) {
            case 'selectEq':
                return { zoom: 8, center: [-77.5, -12] };
            case 'EqSimulation':
                return { zoom: 7, center: [-77.5, -12] };
            case 'Exposure':
                return { zoom: 10, center: [-77.5, -12] };
            case 'EqDamage':
                return { zoom: 10, center: [-77.5, -12] };
            case 'Tsunami':
                return { zoom: 6, center: [-77.5, -12] };
            case 'TsDamage':
                return { zoom: 10, center: [-77.5, -12] };
            case 'Sysrel':
                return { zoom: 9.5, center: [-77.5, -12] };
        }
    }
    return { zoom: 4, center: [-77.5, -12] };
}


export function toOlLayers(scenario: ScenarioName, step: string, product: RiesgosProductResolved): Layer[] {
    if (scenario === 'PeruShort') {
        switch (product.id) {
            case 'selectedEq':
                return [new VectorLayer({
                    source: new VectorSource({
                        features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(product.value)
                    }),
                })];

            case 'eqSimXmlRef':
                return [];

            case 'eqSimWms':
                const fullUrl = new URL(product.value);
                const baseUrl = fullUrl.origin + fullUrl.pathname;
                const layers = fullUrl.searchParams.get("layers");
                return [new TileLayer({
                    source: new TileWMS({
                        url: baseUrl,
                        params: {
                            "LAYERS": layers,
                            "STYLES": "shakemap-pga"
                        }
                    }),
                    opacity: 0.4
                })];

            case 'exposureRef':
                return [];
            
            case 'exposure':
                return [new VectorLayer({
                    source: new VectorSource({
                        features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(product.value)
                    })
                })];

            case 'sysRel':
                return [new VectorLayer({
                    source: new VectorSource({
                        features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(product.value)
                    })
                })];
            default:
                console.log(`Don't know how to render product: `, product);
        }
    }
    return [];
}