import { Observable, of } from "rxjs";
import { ExecutableProcess, RiesgosProduct } from "../riesgos.datatypes";


export class CookingSvc implements ExecutableProcess {
    execute(
        inputs: {[slot: string]: RiesgosProduct},
        outputs: {[slot: string]: RiesgosProduct})
        : Observable<{[slot: string]: RiesgosProduct}> {
        
        const cookedStuffOutput = outputs['cookedStuff'];
        const ingredients = Object.values(inputs).map(i => i.value);
        const outputValue = 'cooked ' + ingredients.join(', ');
        cookedStuffOutput.value = outputValue;
        return of({'cookedStuff': cookedStuffOutput});
    }

}

export class ChoppingSvc implements ExecutableProcess {
    execute(
        inputs: {[slot: string]: RiesgosProduct},
        outputs: {[slot: string]: RiesgosProduct})
        : Observable<{[slot: string]: RiesgosProduct}> {
        
        const choppableIngredientInput = inputs['ingredient'];
        const choppedIngredientOutput = outputs['choppedIngredient'];
        const value = 'chopped ' + choppableIngredientInput.value;
        choppedIngredientOutput.value = value;
        return of({'choppedIngredient': choppedIngredientOutput});
    }

}

export class BlendingSvc implements ExecutableProcess {
    execute(
        inputs: {[slot: string]: RiesgosProduct},
        outputs: {[slot: string]: RiesgosProduct})
        : Observable<{[slot: string]: RiesgosProduct}> {

        const blendedIngredientsOutput = outputs['blendedIngredients'];
        const value = 'blended ' + Object.values(inputs).map(i => i.value).join(', ');
        blendedIngredientsOutput.value = value;
        return of({ 'blendedIngredients': blendedIngredientsOutput });
    }

}