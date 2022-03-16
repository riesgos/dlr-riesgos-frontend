import { unlinkSync } from 'fs';
import { Server } from 'http';
import { of } from 'rxjs';
import { pipeFromArray } from 'rxjs/internal/util/pipe';
import { mergeMap } from 'rxjs/operators';
import { RiesgosDatabase } from "../database/db";
import { FileDb } from '../database/file/fileDb';
import { HttpClient } from '../http_client/http_client';
import { RiesgosProduct, RiesgosScenarioData } from '../model/datatypes/riesgos.datatypes';
import { setUpServer } from '../server/server';
import { RiesgosClient } from './riesgosClient';



let db: RiesgosDatabase;
let app: Server;


beforeAll(async () => {
    db = new FileDb('data/test_db.json');
    await db.init();
    app = setUpServer(3000, db);

    db.addProduct({
        uid: 'Tomato',
        value: 'tomato'
    });

    db.addProduct({
        uid: 'Zucchini',
        value: 'zucchini'
    });

    db.addProduct({
        uid: 'ChoppedZucchini',
        value: null
    });

    db.addProduct({
        uid: 'ChoppedTomato',
        value: null
    });

    db.addProduct({
        uid: 'Broth',
        options: ['vegetable broth', 'chicken broth'],
        value: null
    });

    db.addProduct({
        uid: 'Sauce',
        value: null
    });

    db.addProduct({
        uid: 'Soup',
        value: null
    });

    db.addProcess({
        uid: 'Cooking',
        inputSlots: ['ingredient1', 'ingredient2'],
        outputSlots: ['cookedStuff'],
    });

    db.addProcess({
        uid: 'Chopping',
        inputSlots: ['ingredient'],
        outputSlots: ['choppedIngredient']
    });

    db.addProcess({
        uid: 'Blending',
        inputSlots: ['ingredient1', 'ingredient2'],
        outputSlots: ['blendedIngredients']
    });

    db.addScenario({
        id: 'Soup',
        calls: [
            {
                process: 'Chopping',
                inputs: [{
                    product: 'Zucchini',
                    slot: 'ingredient',
                }],
                outputs: [{
                    slot: 'choppedIngredient',
                    product: 'ChoppedZucchini'
                }]
            },
            {
                process: 'Chopping',
                inputs: [{
                    product: 'Tomato',
                    slot: 'ingredient'
                }],
                outputs: [{
                    slot: 'choppedIngredient',
                    product: 'ChoppedTomato'
                }]
            },
            {
                process: 'Blending',
                inputs: [{
                    product: 'ChoppedTomato',
                    slot: 'ingredient1'
                }, {
                    product: 'Broth',
                    slot: 'ingredient2'
                }],
                outputs: [{
                    slot: 'blendedIngredients',
                    product: 'Sauce'
                }]
            },
            {
                process: 'Cooking',
                inputs: [{
                    product: 'ChoppedZucchini',
                    slot: 'ingredient1'
                }, {
                    product: 'Sauce',
                    slot: 'ingredient2'
                }],
                outputs: [{
                    slot: 'cookedStuff',
                    product: 'Soup'
                }]
            },
        ]


    });

});

afterAll(() => {
    unlinkSync('data/test_db.json');
});

describe('Demo-Scenario Test-Suite', () => {

    it('Running all demo-scenarios and processes with default values', (done) => {

        const client = new RiesgosClient('localhost:3000', new HttpClient());
        client.getScenarios().subscribe(scenarios => {
            expect(scenarios).toBeTruthy();

            for (const scenario of scenarios) {
                client.getScenario(scenario.id).subscribe(scenario => {
                    expect(scenario).toBeTruthy();

                    const ops = scenario.metaData.calls.map(call =>
                        mergeMap((scenario: RiesgosScenarioData) => {
                            const inputs = scenario.products.filter(p => call.inputs.map(i => i.product).includes(p.uid));
                            // If no value set, use default value. This is something that usually the user has to do.
                            inputs.map(i => {
                                if (i.value === null && i.options?.length) {
                                    i.value = i.options[0];
                                }
                            });
                            return client.executeCall(call, scenario);
                        })
                    );

                    pipeFromArray(ops)(of(scenario)).subscribe((val: RiesgosScenarioData) => {
                       const unsetData = val.products.filter(p => p.value === null);
                       expect(unsetData.length).toEqual(0);
                       const soupData = val.products.find(p => p.uid === 'Soup') as RiesgosProduct;
                       expect(soupData.value).toEqual('cooked chopped zucchini, blended chopped tomato, vegetable broth');
                       console.log(`Completed scenario ${scenario.metaData.id}`);
                   });

                });
            }

            setTimeout(() => {
                done();
            }, 9500);

        });

    }, 10000);

});

