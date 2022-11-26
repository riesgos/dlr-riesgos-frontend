import { sleep, toPromise } from '../utils/async';
import { Datum, ScenarioFactory } from './scenarios';


export const italyScenarioFactory = new ScenarioFactory('Italy', 'An example scenario');

italyScenarioFactory.registerStep({
    id: 'EqSim',
    title: 'Eq Simulation',
    description: 'Simulate an earthquake',
    inputs: [{
        id: 'selectedEq',
        options: ['eq1', 'eq2', 'eq3']
    }],
    outputs: [{
        id: 'eqSimulation'
    }],
    function: async function (args: Datum[]) {
        const eq = args.find(a => a.id === 'selectedEq');

        await sleep(100);

        return toPromise([{
            id: 'eqSimulation',
            value: `simulation based on ${eq!.value}`
        }]);
    }
});

italyScenarioFactory.registerStep({
    id: 'EqDmg',
    title: 'Eq-damage',
    description: '',
    inputs: [{
        id: 'eqSimulation'
    }],
    outputs: [{
        id: 'eqDamage'
    }],
    function: async function (args: Datum[]) {
        const eqSim = args.find(a => a.id === 'eqSimulation');

        await sleep(100);
        
        return toPromise([{
            id: 'eqDamage',
            value: `eqDamage based on ${eqSim!.value}`
        }]);
    }
});

italyScenarioFactory.registerStep({
    id: 'EqStats',
    title: 'Eq-statistics',
    description: '',
    inputs: [{
        id: 'eqSimulation'
    }],
    outputs: [{
        id: 'eqStats'
    }],
    function: async function (args: Datum[]) {
        const eqSim = args.find(a => a.id === 'eqSimulation');

        await sleep(100);
        
        return toPromise([{
            id: 'eqStats',
            value: `eqStats based on ${eqSim!.value}`
        }]);
    }
});