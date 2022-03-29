import { ExecutableProcess, Product, ProcessState, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable, forkJoin } from 'rxjs';
import { LaharWps, direction, vei, parameter, laharWms, laharShakemap } from './lahar';
import { WpsData, Cache } from '../../../../../../proxy/src/wps/public-api';
import { WmsLayerProduct, VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FeatureCollection } from '@turf/helpers';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';



export const laharHeightWms: WmsLayerProduct & Product = {
    ...laharWms,
    description: {
        ...laharWms.description,
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features.length > 0) {
                return createKeyValueTableHtml('', { '{{ laharMaxDepth }}': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m' }, 'medium');
            } else {
                return '';
            }
        }
    },
    uid: 'LaharHeightWms'
};

export const laharHeightShakemapRef: WpsData & Product = {
    ...laharShakemap,
    uid: 'LaharHeightShakemap'
};

export const laharVelocityWms: WmsLayerProduct & Product = {
    ...laharWms,
    description: {
        ...laharWms.description,
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features.length > 0) {
                return createKeyValueTableHtml('', { '{{ laharVelocity }}': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m/s' }, 'medium');
            } else {
                return '';
            }
        }
    },
    uid: 'LaharVelocityWms'
};

export const laharVelocityShakemapRef: WpsData & Product = {
    ...laharShakemap,
    uid: 'LaharVelocityShakemap'
};

export const laharPressureWms: WmsLayerProduct & Product = {
    ...laharWms,
    description: {
        ...laharWms.description,
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features.length > 0) {
                return createKeyValueTableHtml('', { '{{ laharPressure }}': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' kPa' }, 'medium');
            } else {
                return '';
            }
        }
    },
    uid: 'LaharPressureWms'
};

export const laharErosionWms: WmsLayerProduct & Product = {
    ...laharWms,
    description: {
        ...laharWms.description,
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features.length > 0) {
                return createKeyValueTableHtml('', { '{{ laharErosion }}': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m' }, 'medium');
            } else {
                return '';
            }
        }
    },
    uid: 'LaharErosionWms'
};

export const laharDepositionWms: WmsLayerProduct & Product = {
    ...laharWms,
    description: {
        ...laharWms.description,
        featureInfoRenderer: (fi: FeatureCollection) => {
            if (fi.features && fi.features.length > 0) {
                return createKeyValueTableHtml('', { '{{ laharDeposition }}': toDecimalPlaces(fi.features[0].properties['GRAY_INDEX'], 2) + ' m' }, 'medium');
            } else {
                return '';
            }
        }
    },
    uid: 'LaharDepositionWms'
};


export const laharContoursWms: WmsLayerProduct & Product = {
    description: {
        id: 'LaharContourLines',
        icon: 'avalanche',
        name: 'Lahar contour lines',
        format: 'application/WMS',
        type: 'complex',
    },
    value: null,
    uid: 'LaharContourLines'
};

export class LaharWrapper implements ExecutableProcess, WizardableProcess {

    state: ProcessState;
    uid = 'LaharWrapper';
    name = 'LaharService';
    requiredProducts = [direction, vei].map(prd => prd.uid);
    providedProducts = [laharHeightWms, laharHeightShakemapRef, laharVelocityWms, laharVelocityShakemapRef,
        laharPressureWms, laharErosionWms, laharDepositionWms, laharContoursWms].map(prd => prd.uid);
    description?: string;
    private laharWps: LaharWps;

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        this.laharWps = new LaharWps(http);
        this.wizardProperties = this.laharWps.wizardProperties;
        this.description = this.laharWps.description;
        this.state = new ProcessStateUnavailable();
    }

    execute(inputs: Product[], outputs?: Product[], doWhile?): Observable<Product[]> {

        const directionV = inputs.find(prd => prd.uid === direction.uid);
        const veiV = inputs.find(prd => prd.uid === vei.uid);

        const heightProc$ = this.laharWps.execute(
            [directionV, veiV, { ...parameter, value: 'MaxHeight' }], [laharHeightWms, laharHeightShakemapRef], doWhile);
        const velProc$ = this.laharWps.execute(
            [directionV, veiV, { ...parameter, value: 'MaxVelocity' }], [laharVelocityWms, laharVelocityShakemapRef], doWhile);
        const pressureProc$ = this.laharWps.execute(
            [directionV, veiV, { ...parameter, value: 'MaxPressure' }], [laharPressureWms], doWhile);
        const erosionProc$ = this.laharWps.execute(
            [directionV, veiV, { ...parameter, value: 'MaxErosion' }], [laharErosionWms], doWhile);
        const depositionProc$ = this.laharWps.execute(
            [directionV, veiV, { ...parameter, value: 'Deposition' }], [laharDepositionWms], doWhile);

        // merge
        return forkJoin([heightProc$, velProc$, pressureProc$, erosionProc$, depositionProc$]).pipe(
            map((results: Product[][]) => {
                const flattened: Product[] = [];
                for (const result of results) {
                    for (const data of result) {
                        flattened.push(data);
                    }
                }

                const vals = [];
                if (directionV.value === 'South') {
                    vals.push(
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiV.value}_time_min10&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiV.value}_time_min20&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiV.value}_time_min40&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiV.value}_time_min60&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiV.value}_time_min80&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiV.value}_time_min100&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                    );
                    if (veiV.value !== 'VEI4') {
                        vals.push(`https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiV.value}_time_min120&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`);
                    }
                } else {
                    vals.push(
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiV.value}_time_min10&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiV.value}_time_min20&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiV.value}_time_min40&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiV.value}_time_min60&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiV.value}_time_min80&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiV.value}_time_min100&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                        `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiV.value}_time_min120&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
                    );
                    if (veiV.value !== 'VEI4') {
                        vals.push(`https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiV.value}_time_min140&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`);
                        if (veiV.value !== 'VEI3') {
                            vals.push(`https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiV.value}_time_min160&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`);
                            if (veiV.value !== 'VEI2') {
                                vals.push(`https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiV.value}_time_min180&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`);
                            }
                        }
                    }
                }
                flattened.push({
                    ...laharContoursWms,
                    value: vals
                });

                return flattened;
            })
        );
    }
}