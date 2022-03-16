import { Observable, of } from 'rxjs';
import { ExecutableProcess, RiesgosProduct } from '../riesgos.datatypes';
import { FeatureCollection } from 'geojson';

export class FeatureSelector implements ExecutableProcess {
    execute(
        inputs: {[slot: string]: RiesgosProduct},
        outputs: {[slot: string]: RiesgosProduct})
        : Observable<{[slot: string]: RiesgosProduct}> {
        
        const features = inputs['featureCollection'].value;
        const id = inputs['id'].value;
        const outputData = outputs['selectedFeature'];

        if (!features || !id || !outputData) {
            throw Error();
        }
        
        const selectedFeature = (features as FeatureCollection).features.find(f => f.id === id);
        outputData.value = selectedFeature;
        return of({selectedFeature: outputData});
    }

}
