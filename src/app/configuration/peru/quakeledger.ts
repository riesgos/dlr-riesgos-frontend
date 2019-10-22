import { WpsProcess, ProcessStateUnavailable, Product, ExecutableProcess } from '../../wps/wps.datatypes';
import { UserconfigurableProduct, StringSelectUconfProduct, BboxUconfProduct, BboxUconfPD } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { VectorLayerData, BboxLayerData, BboxLayerDescription } from 'src/app/components/map/mappable_wpsdata';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable, of } from 'rxjs';
import { WpsData, WpsDataDescription, WpsBboxValue } from 'projects/services-wps/src/public-api';
import { selectedEqs, mmin, mmax, zmin, zmax, p, etype, tlon, tlat } from '../chile/quakeledger';
import { HttpClient } from '@angular/common/http';



export class InputBoundingboxPeru implements BboxUconfProduct, BboxLayerData, WpsData {
    description: BboxUconfPD & BboxLayerDescription & WpsDataDescription;
    value: WpsBboxValue;
    uid = 'user_input-boundingbox_peru';

    constructor() {
        this.description = {
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
                signpost: 'You can also select a boundingbox by clicking and dragging on the map.'
            },
        },
        this.value = null;
    }
}


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


export const tlonPeru: Product & WpsData = {
    uid: 'user_tlon',
    description: {
        id: 'tlon',
        description: 'longitude [decimal degrees]',
        defaultValue: '-77.00',
        reference: false,
        type: 'literal'
    },
    value: '-77.00'
};


export const tlatPeru: Product & WpsData = {
    uid: 'user_tlat',
    description: {
        id: 'tlat',
        description: 'latitude [decimal degrees]',
        defaultValue: '-12.00',
        reference: false,
        type: 'literal'
    },
    value: '-12.00'
};

export class QuakeLedgerPeru extends WpsProcess implements WizardableProcess {

    wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'Quakeledger Peru',
            'Earthquake Catalogue',
            [mmin, mmax, zmin, zmax, p, etypePeru, tlonPeru, tlatPeru].map(prd => prd.uid).concat(['user_input-boundingbox_peru']),
            [selectedEqs.uid],
            'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
            'Catalogue of earthquakes. Enter here the parameters that determine which earthquakes would be appropriate for your simulation.',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
        );
        this.wizardProperties = {
            shape: 'earthquake',
            providerName: 'Helmholtz Centre Potsdam',
            providerUrl: 'https://www.gfz-potsdam.de/en/'
        };
    }

}
