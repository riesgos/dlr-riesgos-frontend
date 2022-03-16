import { FileDb } from '../database/file/fileDb';
import { HttpClient } from "../http_client/http_client";
import { WpsServerDescription } from "../wps/public-api";
import { WpsHarvester } from "./harvester";



const servicesToHarvest: WpsServerDescription[] = [{
    serverUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    serverVersion: '1.0.0'
}, {
    serverUrl: 'http://91.250.85.221/wps/WebProcessingService',
    serverVersion: '1.0.0'
}, {
    serverUrl: 'https://riesgos.52north.org/javaps/service',
    serverVersion: '2.0.0'
}, {
    serverUrl: 'http://tsunami-wps.awi.de/wps',
    serverVersion: '1.0.0'
}];


async function run() {
    const db = new FileDb('./data/db.json');
    await db.init();
    const harvester = new WpsHarvester(new HttpClient(), db);
    for (const service of servicesToHarvest) {
        harvester.harvestAllData(service);
    }
}

run();
