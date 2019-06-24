import { EqEventCatalogue } from './EqEventCatalogue/eqEventCatalogue';
import { EqGroundMotion } from './EqGroundMotion/eqGroundMotion';
import { EqTsInteraction } from './EqTsInteraction/eqTsInteraction';
import { TsPhysicalSimulation } from './TsPhysicalSimulation/tsPhysicalSimulation';


export const processes = [
    new EqEventCatalogue(), 
    new EqGroundMotion(), 
    new EqTsInteraction(), 
    new TsPhysicalSimulation()
]