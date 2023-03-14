import { Partition, ScenarioName } from "src/app/state/state";

export function getMapPositionForStep(scenario: ScenarioName, partition: Partition, stepId: string): {center: number[], zoom: number} {
    if (scenario === 'PeruShort') {
        switch (stepId) {
            case 'selectEq':
                return { zoom: 8, center: [-77, -12] };
            case 'EqSimulation':
                return { zoom: 7, center: [-77, -12] };
            case 'Exposure':
                return { zoom: 10, center: [-77, -12] };
            case 'EqDamage':
                return { zoom: 10, center: [-77, -12] };
            case 'Tsunami':
                return { zoom: 6, center: [-77, -12] };
            case 'TsDamage':
                return { zoom: 10, center: [-77, -12] };
            case 'Sysrel':
                return { zoom: 9.5, center: [-77, -12] };
        }
    }
    return { zoom: 4, center: [-77, -12] };
}