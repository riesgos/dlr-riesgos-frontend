import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as veiSelection } from "./1_veiselection/veiselection";
import { step as ashfall } from "./2_ashfallsim/ashfallsim";
import { step as ashExposure } from './3_ashfall_exposure/exposure';
import { step as ashDamage } from './4_ashfall_damage/damage';
import { step as laharExposure } from './6_lahar_exposure/exposure';


export const ecuadorFactory = new ScenarioFactory(
    'Ecuador',
    'Ecuador Scenario Description',
);

ecuadorFactory.registerStep(veiSelection);
ecuadorFactory.registerStep(ashfall);
ecuadorFactory.registerStep(ashExposure);
ecuadorFactory.registerStep(ashDamage);
ecuadorFactory.registerStep(laharExposure);
