import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { vei } from './lahar';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { HttpClient } from '@angular/common/http';
import { VectorLayerProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import { toDecimalPlaces, linInterpolateXY } from 'src/app/helpers/colorhelpers';
import { StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import olFeature from 'ol/Feature';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FeatureCollection } from '@turf/helpers';
import Geometry from 'ol/geom/Geometry';



const allDepths = [];

export const ashfall: WpsData & Product & VectorLayerProduct = {
    uid: 'ashfall',
    description: {
        id: 'ashfall',
        title: '',
        icon: 'volcanoe',
        reference: false,
        type: 'complex',
        format: 'application/vnd.geo+json',
        name: 'ashfall-depth',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number) => {
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
                        width: 2
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
                text: 'Thickness: 5.0 mm'
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
                text: 'Thickness: 50.0 mm'
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
                text: 'Thickness: 90.0 mm'
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

                    const vol = 1 * 1 * thickness / 1000;   // [m] * [m] * [mm] * [m/mm] = [m^3]
                    const mass = vol * 1000;                // [m^3] * [kg/m^3] = [kg]
                    const weightForce = mass * 9.81;        // [kg] * [m/s^2] = [N]
                    const pressure = weightForce / (1 * 1); // [N] / [m^2] = [Pa]

                    const selectedProperties = {
                        '{{ Thickness }}': thicknessText,
                        '{{ VEI }}': toDecimalPlaces(properties['vei'] as number, 1),
                        '{{ Expected_load }}': `${pressure.toFixed(0)} Pa`,
                        '{{ Probability }}': properties['prob'] + ' %'
                    };
                    return createKeyValueTableHtml('{{ Ashfall }}', selectedProperties, 'medium');
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
        title: '',
        reference: false,
        format: 'application/vnd.geo+json',
        type: 'complex'
    },
    value: null
};


export const probability: StringSelectUserConfigurableProduct & WpsData = {
    uid: 'ashfall_range_prob',
    description: {
        id: 'probability',
        title: '',
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

    constructor(private http: HttpClient) {
        super(
            'ashfall-service',
            'AshfallService',
            [vei.uid, probability.uid],
            [ashfall.uid, ashfallPoint.uid],
            'org.n52.dlr.riesgos.algorithm.CotopaxiAshfall',
            'AshfallServiceDescription',
            'http://riesgos.dlr.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );
        this.wizardProperties = {
            providerName: 'IGN',
            providerUrl: 'https://www.igepn.edu.ec',
            shape: 'volcanoe',
            wikiLink: 'AshfallSimulation'
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

        // service temporarily out of commission
        // const obs1$ = super.execute(newInputProducts, [newOutputProducts], doWhileExecuting);
        const ashfallPolygon$ = this.loadAshfallPolygonFromFile(ashfall, veiV.value, probV.value);
        const ashfallPoints$ = this.loadAshfallPointFromFile(ashfallPoint, veiV.value, probV.value);
        return forkJoin([ashfallPolygon$, ashfallPoints$]).pipe(
            map(([ashfallPolygon, ashfallPoints]) => {
                // ashfallPoints.value[0].features.map(f => f.properties.load = 100 * f.properties.load);
                return [ashfallPolygon, ashfallPoints];
            })
        );
    }

    private loadAshfallPointFromFile(ashfall: Product, vei: string, prob: string): Observable<Product> {
        if (parseInt(prob) === 1) {
            prob = '01';
        }
        const url = `assets/data/geojson/ashfall_points/VEI_${vei}_${prob}percent.geojson`;
        return this.http.get(url).pipe(map((val) => {
            return {
                ... ashfall,
                value: [val]
            };
        }));
    }

    private loadAshfallPolygonFromFile(ashfallPoint: Product, vei: string, prob: string): Observable<Product> {
        const url = `assets/data/geojson/ashfall_polygons/ash_prob${prob}_vei${vei}.geojson`;
        return this.http.get(url).pipe(map((val) => {
            return {
                ... ashfallPoint,
                value: [val]
            };
        }));
    }
}
