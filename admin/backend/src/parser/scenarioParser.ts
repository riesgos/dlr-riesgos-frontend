import { ScenarioFactory, Step } from '../scenarios/scenarios';
import { pathGetLast, getPathTo, listDirsInDir, matchFileRecursive, readTextFile } from '../utils/files'




export async function parseCode(baseDirString: string) {
    // resolving potentially relative path to absolute
    const baseDir = getPathTo(baseDirString); 

    const factories: ScenarioFactory[] = [];
    
    const scenarioPaths = await listDirsInDir(baseDir);
    for (const scenarioPath of scenarioPaths) {
        const scenarioName = pathGetLast(scenarioPath);
        const description = await findDescription(scenarioPath);
        const image = await findImage(scenarioPath);

        const factory = new ScenarioFactory(scenarioName, description, image);

        const stepPaths = await listDirsInDir(scenarioPath);
        for (const stepPath of stepPaths) {
            const stepName = pathGetLast(stepPath);
            const logicFile = await matchFileRecursive(stepPath, /\.logic\.js$/);
            if (logicFile) {
                // console.log('Importing script ', logicFile);
                const logic = await import(logicFile);
                const step: Step = logic.step;
                try {
                    factory.registerStep(step);
                } catch (e: any) {
                    const message = `Scenario ${scenarioName}, step ${stepName}: Error when matching to a step: ${step}`;
                    e.message = message + `\n` + e.message;
                    throw e;
                }
            }
        }

        factories.push(factory);
    }

    return factories;
}


async function findDescription(scenarioPath: string) {
    let description = '';
    const descriptionFile = await matchFileRecursive(scenarioPath, /\.description\.html$/);
    if (descriptionFile) {
        const content = await readTextFile(descriptionFile);
        description = content;
    }
    return description;
}

async function findImage(scenarioPath: string) {
    let image = '';
    const imageFile = await matchFileRecursive(scenarioPath, /\.$(png|jpg)/);
    if (imageFile) {
        image = imageFile;
    }
    return image;
}
