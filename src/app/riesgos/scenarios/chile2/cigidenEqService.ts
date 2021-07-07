import { WpsProcess, ProcessStateAvailable, ProductTransformingProcess, Product, ProcessStateUnavailable } from '../../riesgos.datatypes';
import { HttpClient } from '@angular/common/http';
import { Cache, WpsData } from '@dlr-eoc/utils-ogc';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { FeatureSelectUconfProduct, StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { Observable, of } from 'rxjs';
import { VectorLayerProduct } from '../../riesgos.datatypes.mappable';
import { FeatureLike } from 'ol';
import { Style, Circle, Fill } from 'ol/style';
import { color } from 'd3-color';
import { greenRedRange } from 'src/app/helpers/colorhelpers';



export const availableEarthquakes: WpsData & VectorLayerProduct = {
    uid: 'availableEarthquakes',
    description: {
        id: 'availableEarthquakes',
        name: 'Available Earthquakes',
        title: 'Available Earthquakes',
        reference: false,
        description: 'Earthquake data',
        type: 'complex',
        format: 'application/vnd.geo+json',
        vectorLayerAttributes: {
            style: (feature: FeatureLike) => {
                const magnitude = feature.getProperties()['magnitude'];

                return new Style({
                    image: new Circle({
                        fill: new Fill({
                            color: 'rgba(125, 125, 0, 1)'
                        }),
                        radius: magnitude * 2
                    })
                });
            }
        }
    },
    value: null
};

export const eqSelectionList: StringSelectUconfProduct = {
    uid: 'eqSelectionList',
    description: {
        defaultValue: null,
        options: [],
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'Select an eq',
        }
    },
    value: null
};


export class CigidenEqCatalogue extends WpsProcess implements WizardableProcess, ProductTransformingProcess {

    wizardProperties: WizardProperties;

    constructor(http: HttpClient, cache: Cache) {
        super(
            'cigidenEqCatalogue',
            'Earthquake catalogue',
            [],
            ['availableEarthquakes', 'eqSelectionList'],
            'serverProcessId',
            'Process description',
            'https://cigiden.org/wps',
            '1.0.0',
            http,
            new ProcessStateAvailable(),
            cache
        );

        this.wizardProperties = {
            providerName: 'CIGIDEN',
            providerUrl: 'https://cigiden.org',
            shape: 'earthquake'
        };
    }

    /**
     * Overwriting the original execute method just for demonstration's sake.
     */
    execute(inputProducts: Product[], outputProducts?: Product[], doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {
        const eqShapes = {
            ...availableEarthquakes,
            value: [{
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 0,
                            "magnitude": 7
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                -71.90277099609375,
                                -32.79881885529199
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 1,
                            "magnitude": 6
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                -72.0648193359375,
                                -33.03629817885957
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "id": 2,
                            "magnitude": 8
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                -71.80389404296875,
                                -33.05011227184965
                            ]
                        }
                    }
                ]
            }]
        };

        const options = eqShapes.value[0].features.map(f => 'EQ-ID ' + f.properties['id']);
        const newEqSelectionList = {
            ...eqSelectionList,
            value: options[0]
        };

        return of([eqShapes, newEqSelectionList]);
    }

    /**
     * For the eqSelectionList, we not only change the value, but also the options.
     * This needs to be done as a side-effect in `onProductAdded`
     */
    onProductAdded = (newProduct: Product, allProducts: Product[]): Product[] => {
        if (newProduct.uid === availableEarthquakes.uid) {
            const selectionOptions = newProduct.value[0].features.map(f => 'EQ-ID ' + f.properties['id']);

            const newEqSelectionList = {
                ...eqSelectionList,
                description: {
                    ...eqSelectionList.description,
                    options: selectionOptions
                }
            };

            return [newEqSelectionList];
        }
        return [];
    }

}


export const damage: WpsData & VectorLayerProduct = {
    uid: 'eqDamage',
    description: {
        id: 'damage',
        name: 'Damage',
        format: 'application/vnd.geo+json',
        reference: false,
        title: 'Damage',
        type: 'complex',
        vectorLayerAttributes: {
            style: (feature: FeatureLike) => {
                const damageValue = feature.getProperties()['damage'];
                const c = greenRedRange(2, 11, damageValue);

                return new Style({
                    fill: new Fill({
                        color: `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.9)`
                    })
                });
            }
        },
    },
    value: null
};

export class CigidenEqSimulation extends WpsProcess implements WizardableProcess {
    public wizardProperties: WizardProperties;

    constructor(http: HttpClient, cache: Cache) {
        super(
            'cigidenEqSimulation',
            'Earthquake Simulation',
            ['eqSelectionList'],
            ['eqDamage'],
            'serverSideProcessId',
            'Some description',
            'https://cigiden.org/wps',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );

        this.wizardProperties = {
            shape: 'earthquake',
            providerName: 'CIGIDEN',
            providerUrl: 'https://cigiden.org',
        };
    }

    /**
     * Overwriting the original execute method just for demonstration's sake.
     */
    execute(inputProducts: Product[], outputProducts?: Product[], doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        const newData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "damage": 5
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    -72.16644287109374,
                                    -32.810361684869
                                ],
                                [
                                    -72.32574462890625,
                                    -32.9141796617935
                                ],
                                [
                                    -72.34771728515625,
                                    -33.02248191961359
                                ],
                                [
                                    -72.19940185546875,
                                    -33.09154154865519
                                ],
                                [
                                    -72.19390869140625,
                                    -33.23409295522519
                                ],
                                [
                                    -71.87805175781249,
                                    -33.25476662931654
                                ],
                                [
                                    -71.54296874999999,
                                    -33.32823340910777
                                ],
                                [
                                    -71.224365234375,
                                    -33.273139123013465
                                ],
                                [
                                    -71.12823486328125,
                                    -33.15364887320582
                                ],
                                [
                                    -71.3067626953125,
                                    -33.008663494575565
                                ],
                                [
                                    -71.3287353515625,
                                    -32.80343616698927
                                ],
                                [
                                    -71.56494140625,
                                    -32.611616403170316
                                ],
                                [
                                    -71.95220947265625,
                                    -32.61624341272737
                                ],
                                [
                                    -72.16644287109374,
                                    -32.810361684869
                                ]
                            ]
                        ]
                    }
                },

                {
                    "type": "Feature",
                    "properties": {
                        "damage": 8
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    -71.8505859375,
                                    -32.72259860404406
                                ],
                                [
                                    -72.09503173828125,
                                    -32.8080532388675
                                ],
                                [
                                    -72.279052734375,
                                    -32.953368145799324
                                ],
                                [
                                    -71.993408203125,
                                    -33.06162236089505
                                ],
                                [
                                    -71.72698974609375,
                                    -33.18353672893613
                                ],
                                [
                                    -71.33148193359375,
                                    -33.162846221811414
                                ],
                                [
                                    -71.41937255859375,
                                    -33.05011227184965
                                ],
                                [
                                    -71.52923583984375,
                                    -32.79651010951668
                                ],
                                [
                                    -71.8505859375,
                                    -32.72259860404406
                                ]
                            ]
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "damage": 10
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    -71.7901611328125,
                                    -32.83805835927704
                                ],
                                [
                                    -72.02911376953125,
                                    -32.930318199070534
                                ],
                                [
                                    -71.91650390625,
                                    -33.02248191961359
                                ],
                                [
                                    -71.6748046875,
                                    -32.99023555965107
                                ],
                                [
                                    -71.69677734375,
                                    -32.85882519646385
                                ],
                                [
                                    -71.7901611328125,
                                    -32.83805835927704
                                ]
                            ]
                        ]
                    }
                }

            ]
        };

        const newDamage = {
            ...damage,
            value: [newData]
        };

        return of([newDamage]);
    }
}
