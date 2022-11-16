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
            featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
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
                    "properties": {'thickness': 25},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Thickness25'
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
                text: 'Thickness50'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'thickness': 75},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Thickness75'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'thickness': 100},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Thickness100'
            }],
            detailPopupHtml: (properties) => {
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
                        '{{ Probability_of_exceedence }}': properties['prob'] + ' %'
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
        id: 'ashfall',
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
            name: 'Probability_of_exceedence',
            description: 'probability of range',
        }
    },
    value: null
};


export class AshfallService extends WpsProcess implements WizardableProcess {

    wizardProperties: WizardProperties;

    constructor(private http: HttpClient, middleWareUrl: string) {
        super(
            'ashfall-service',
            'AshfallService',
            [vei.uid, probability.uid],
            [ashfall.uid, ashfallPoint.uid],
            'ashfall-service',
            'AshfallServiceDescription',
            // 'http://riesgos.dlr.de/wps',
            'http://localhost:5000/wps',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            middleWareUrl
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
                            id: 'intensity'
                        },
                        value: (prod.value as string).replace('VEI', '')
                    };
                case probability.uid:
                    return prod;
            }
        });
        const asPolygonFlag: WpsData & Product = {
            uid: 'ashfallPolygonFlag',
            description: {
                id: 'outputType',
                reference: false,
                type: 'literal',
                title: 'Output'
            },
            value: 'polygons'
        };
        const asPointsFlag: WpsData & Product = {
            uid: 'ashfallPointFlag',
            description: {
                id: 'outputType',
                reference: false,
                type: 'literal',
                title: 'Output'
            },
            value: 'points'
        };

        const ashfallPolygon$ = super.execute([...newInputProducts, asPolygonFlag], [outputProducts.find(p => p.uid === ashfall.uid)], doWhileExecuting);
        const ashfallPoints$ = super.execute([...newInputProducts, asPointsFlag], [outputProducts.find(p => p.uid === ashfallPoint.uid)], doWhileExecuting);
        return forkJoin([ashfallPolygon$, ashfallPoints$]).pipe(map(
                ([products1, products2]) => {
                    console.log('returning: ', [...products1, ...products2])
                    return [...products1, ...products2];
        }));
    }

}
