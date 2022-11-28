import { ScenarioFactory } from "../../scenarios/scenarios";
import { step as veiSelection } from "./1_veiselection/veiselection";
import { step as ashfall } from "./2_ashfallsim/ashfallsim";
import { step as ashExposure } from './3_ashfall_exposure/exposure';
import { step as ashDamage } from './4_ashfall_damage/ashfall_damage';
import { step as lahar } from './5_laharsim/laharsim';
import { step as laharExposure } from './6_lahar_exposure/exposure';
import { step as laharDamage } from './7_lahar_damage/lahar_damage';


export const ecuadorFactory = new ScenarioFactory(
    'Ecuador',
    'Ecuador Scenario Description',
);

ecuadorFactory.registerStep(veiSelection);
ecuadorFactory.registerStep(ashfall);
ecuadorFactory.registerStep(ashExposure);
ecuadorFactory.registerStep(ashDamage);
ecuadorFactory.registerStep(lahar);
ecuadorFactory.registerStep(laharExposure);
ecuadorFactory.registerStep(laharDamage);
