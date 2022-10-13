import { Step } from "../../../scenarios/scenarios";
import { sleep } from "../../../utils/async";
import { WpsClient } from "../../../utils/wps/public-api";
import axios from "axios";


const wpsClient = new WpsClient('2.0.0', axios);

async function loadEqs() {

    const results = await wpsClient.executeAsync().toPromise();

    await sleep();
    return [{
        id: 'cheese',
        value: 'some good cheese'
    }];
}



export const step: Step = {
    step: 1,
    title: 'Eqs',
    description: 'Fetch eq data from database',
    inputs: [{ id: 'cheese' }],
    outputs: [{
        id: 'tomatoes'
    }],
    function: loadEqs
};