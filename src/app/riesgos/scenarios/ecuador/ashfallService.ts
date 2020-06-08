import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { vei } from './lahar';
import { WpsData, Cache } from '@dlr-eoc/services-ogc';
import { HttpClient } from '@angular/common/http';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { toDecimalPlaces, linInterpolateXY } from 'src/app/helpers/colorhelpers';
import { StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FeatureCollection } from '@turf/helpers';



const allDepths = [];

export const ashfall: WpsData & Product & VectorLayerProduct = {
    uid: 'ashfall',
    description: {
        id: 'ashfall',
        icon: 'volcanoe',
        reference: false,
        type: 'complex',
        format: 'application/vnd.geo+json',
        name: 'ashfall-depth',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();
                const thickness = props.thickness;
                allDepths.push(thickness);

                const hue = linInterpolateXY(0, 170, 100, 280, thickness);
                const colorString = `hsl(${hue}, 50%, 50%)`;

                // we can also repeat labels along each polygon-segment, roughly like this:
                // https://stackoverflow.com/questions/38391780/multiple-text-labels-along-a-linestring-feature

                return new olStyle({
                    fill: new olFill({
                        color: colorString,
                    }),
                    stroke: new olStroke({
                        color: [0, 0, 0, 1],
                        witdh: 2
                    }),
                    text: new olText({
                        font: 'bold 14px Calibri,sans-serif',
                        text: toDecimalPlaces(thickness as number, 1) + ' mm',
                        fill: new olFill({ color: [0, 0, 0, 1] }),
                        stroke: new olStroke({ color: colorString, width: 1 }),
                        placement: 'line',
                        textAlign: 'left'
                        // maxAngle: maxAngle,
                        // overflow: true,
                    }),
                    zIndex: thickness * 100
                });
            },
            legendEntries: [{
                feature: {
                    "type": "Feature",
                    "properties": {'thickness': 0.05},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'thickness: 5 mm'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'thickness': 50},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'thickness: 50 mm'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'thickness': 90},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'thickness: 90 mm'
            }],
            text: (properties) => {
                const thickness = properties['thickness'];
                if (thickness) {
                    allDepths.sort();
                    const nextBiggerThickness = allDepths.find(d => +d > +thickness);
                    let thicknessText: string;
                    if (nextBiggerThickness) {
                        thicknessText = `${toDecimalPlaces(thickness as number, 1)} - ${toDecimalPlaces(nextBiggerThickness as number, 1)} mm`;
                    } else {
                        thicknessText = `> ${toDecimalPlaces(thickness as number, 1)} mm`;
                    }

                    const load = thickness * (1250 / 1250);

                    const selectedProperties = {
                        Profundidad: thicknessText,
                        VEI: toDecimalPlaces(properties['vei'] as number, 1),
                        'Expected load ': `${load} kPa`,
                        Probabilidad: properties['prob'] + ' %'
                    };
                    return createKeyValueTableHtml('Ceniza', selectedProperties, 'medium');
                }
            }
        }
    },
    value: null
};

export const ashfallPoint: WpsData & Product = {
    uid: 'ashfallPoint',
    description: {
        id: 'intensity',
        reference: false,
        format: 'application/vnd.geo+json',
        type: 'complex'
    },
    value: null
};


export const probability: StringSelectUconfProduct & WpsData = {
    uid: 'ashfall_range_prob',
    description: {
        id: 'probability',
        type: 'literal',
        reference: false,
        options: ['1', '50', '99'],
        defaultValue: '50',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'probability',
            description: 'probability of range',
        }
    },
    value: null
};


export class AshfallService extends WpsProcess implements WizardableProcess {

    wizardProperties: WizardProperties;

    constructor(private http: HttpClient, cache: Cache) {
        super(
            'ashfall-service',
            'Ashfall Service',
            [vei.uid, probability.uid],
            [ashfall.uid, ashfallPoint.uid],
            'org.n52.dlr.riesgos.algorithm.CotopaxiAshfall',
            '',
            'http://riesgos.dlr.de/wps/WebProcessingService?',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
        this.wizardProperties = {
            providerName: 'Instituto Geofísico EPN',
            providerUrl: 'https://www.igepn.edu.ec',
            shape: 'volcanoe'
        };
    }

    execute(inputProducts: Product[], outputProducts: Product[], doWhileExecuting): Observable<Product[]> {

        const newInputProducts = inputProducts.map(prod => {
            switch (prod.uid) {
                case vei.uid:
                    return {
                        ...prod,
                        description: {
                            ...prod.description,
                            id: 'vei'
                        },
                        value: (prod.value as string).replace('VEI', '')
                    };
                case probability.uid:
                    return prod;
            }
        });

        const veiV = newInputProducts.find(p => p.uid === vei.uid);
        const probV = newInputProducts.find(p => p.uid === probability.uid);

        const newOutputProducts = outputProducts.find(p => p.uid === ashfall.uid);

        const obs1$ = super.execute(newInputProducts, [newOutputProducts], doWhileExecuting);
        const obs2$ = this.loadAshfallPointFromFile(ashfallPoint, veiV.value, probV.value);
        return forkJoin(obs1$, obs2$).pipe(
            map((results: Product[][]) => {
                const flattened: Product[] = [];
                for (const result of results) {
                    for (const data of result) {
                        flattened.push(data);
                    }
                }
                return flattened;
            })
        );
    }

    private loadAshfallPointFromFile(ashfallPoint: Product, vei: string, prob: string): Observable<Product[]> {
        if (parseInt(prob) === 1) {
            prob = '01';
        }
        const url = `assets/data/geojson/VEI_${vei}_${prob}percent.geojson`;
        return this.http.get(url).pipe(map((val) => {
            return [{
                ... ashfallPoint,
                value: [val]
            }];
        }));
    }
}
