import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as eqs } from "./1_veiselection/veiselection";
import { step as ash } from "./2_ashfallsim/ashfallsim";
import { step as ashExposure } from './3_ashfall_exposure/exposure';
import { step as laharExposure } from './6_lahar_exposure/exposure';


export const ecuadorFactory = new ScenarioFactory(
    'Ecuador',
    'Ecuador Scenario Description',
);

ecuadorFactory.registerStep(eqs);
ecuadorFactory.registerStep(ash);
ecuadorFactory.registerStep(ashExposure);
ecuadorFactory.registerStep(laharExposure);
