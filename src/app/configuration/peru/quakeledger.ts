import { WpsProcess, ProcessStateUnavailable, WatchingProcess, Product, CustomProcess } from '../../wps/wps.datatypes';
import { UserconfigurableProduct, StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerData, BboxLayerData } from 'src/app/components/map/mappable_wpsdata';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable, of } from 'rxjs';
import { WpsData } from 'projects/services-wps/src/public-api';
import { selectedEqs, mmin, mmax, zmin, zmax, p, etype, tlon, tlat } from '../chile/quakeledger';


export const inputBoundingboxPeru: UserconfigurableProduct & BboxLayerData & WpsData = {
    uid: 'user_input-boundingbox',
    description: {
        id: 'input-boundingbox',
        name: 'eq-selection: boundingbox',
        type: 'bbox',
        reference: false,
        description: 'Please select an area of interest',
        defaultValue: {
            crs: 'EPSG:4326',
            lllon: -86.5, lllat: -20.5,
            urlon: -68.5, urlat: -0.6
        },
        wizardProperties: {
            name: 'AOI',
            fieldtype: 'bbox',
        },
    },
    value: null
};


export const etypePeru = {
    uid: 'user_etype',
    description: {
        id: 'etype',
        description: 'etype',
        defaultValue: 'observed', // 'deaggregation',
        reference: false,
        type: 'literal',
        wizardProperties: {
            name: 'Catalogue type',
            fieldtype: 'stringselect'
        },
        options: ['observed', 'stochastic']
    },
    value: null
};


export const QuakeLedgerPeru: WizardableProcess & WpsProcess = {
    state: new ProcessStateUnavailable(),
    uid: 'Quakeledger Peru',
    name: 'Earthquake Catalogue',
    requiredProducts: [inputBoundingboxPeru, mmin, mmax, zmin, zmax, p, etypePeru, tlon, tlat].map(prd => prd.uid),
    providedProducts: [selectedEqs.uid],
    wizardProperties: {
        shape: 'earthquake',
        providerName: 'Helmholtz Centre Potsdam',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    },
    description: '',
    id: 'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
    url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?',
    wpsVersion: '1.0.0'

};
