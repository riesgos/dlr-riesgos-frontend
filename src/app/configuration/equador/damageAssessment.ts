import { WizardPageComponent } from 'src/app/components/config_wizard/wizard-page/wizard-page.component';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';



export const durationTiff: WpsData & Product = {
    uid: 'FlooddamageProcess_duration',
    description: {
        id: 'duration-h',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        description: 'Tiff file with the duration of the flood in hours'
    },
    value: null
};

export const velocityTiff: WpsData & Product = {
    uid: 'FlooddamageProcess_velocity',
    description: {
        id: 'vsmax-ms',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        description: 'Tiff file with the maximum velocity of the flood in m/s'
    },
    value: null
};

export const depthTiff: WpsData & Product = {
    uid: 'FlooddamageProcess_depth',
    description: {
        id: 'wdmax-cm',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        description: 'Tiff file with the maximum water depth of the flood in cm'
    },
    value: null
};


export const damageManzanas: WpsData & Product = {
    uid: 'FlooddamageProcess_damageManzanas',
    description: {
        id: 'damage_manzanas',
        reference: false,
        type: 'complex',
        format: 'application/json',
        description: 'geojson with the damage of the manzanas'
    },
    value: null
};

export const damageBuildings: WpsData & Product = {
    uid: 'FlooddamageProcess_damageBuildings',
    description: {
        id: 'damage_buildings',
        reference: false,
        type: 'complex',
        format: 'application/json',
        description: 'geojson with the damage on the buildings'
    },
    value: null
};


export const FlooddamageProcess: WpsProcess & WizardableProcess = {
    id: 'org.n52.gfz.riesgos.algorithm.impl.FlooddamageProcess',
    url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    description: 'Process to compute the damage of a flood in ecuador.',
    name: 'Damage Assessment Service',
    wpsVersion: '1.0.0',
    state: new ProcessStateUnavailable(),
    requiredProducts: [durationTiff, velocityTiff, depthTiff].map(p => p.uid),
    providedProducts: [damageManzanas, damageBuildings].map(p => p.uid),
    wizardProperties: {
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        shape: 'dot-circle'
    }
};