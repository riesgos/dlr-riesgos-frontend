import { FileDb } from '../database/file/fileDb';
import { RiesgosProcess } from '../model/datatypes/riesgos.datatypes';
import * as path from 'path';


async function run() {

    const db = new FileDb(path.join(__dirname, '../../data/db.json'));
    await db.init();

    const featureSelector: RiesgosProcess = {
        inputSlots: ['featureCollection', 'id'],
        outputSlots: ['selectedFeature'],
        uid: 'featureSelector',
        concreteClassName: 'FeatureSelector'
    };
    db.addProcess(featureSelector);

    db.addScenario({
        id: 'Chile',
        calls: [{
            inputs: [{
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_input-boundingbox',
                slot: 'input-boundingbox'
            }, {
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_mmin',
                slot: 'mmin'
            }, {
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_mmax',
                slot: 'mmax'
            }, {
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_zmin',
                slot: 'zmin'
            }, {
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_zmax',
                slot: 'zmax'
            }, {
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_p',
                slot: 'p'
            }, {
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_etype',
                slot: 'etype'
            }, {
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_tlon',
                slot: 'tlon'
            }, {
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_tlat',
                slot: 'tlat'
            }],
            outputs: [{
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_selectedRows',
                slot: 'selectedRows'
            }],
            process: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess'
        }, {
            inputs: [{
                product: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_selectedRows',
                slot: 'featureCollection'
            }],
            outputs: [{
                product: 'selectedEq',
                slot: 'selectedEq'
            }],
            process: 'FeatureSelector',
        }]
    });
}

run();
