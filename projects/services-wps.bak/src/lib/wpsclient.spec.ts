import { WpsClient } from "./wpsclient";
import { HttpClient, HttpXhrBackend, XhrFactory } from "@angular/common/http";
import { WpsData, WpsDataDescription } from '../public_api';

class MyXhrFactory extends XhrFactory {
    build(): XMLHttpRequest {
        return new XMLHttpRequest();
    }
}

describe(`Testing wps-client version 1 functionality`, () => {

    let httpClient = new HttpClient(new HttpXhrBackend(new MyXhrFactory()));

    it("Wps-client should init correctly", () => {
        let c = new WpsClient("1.0.0", httpClient);
        expect(c).toBeTruthy();
    });


    it("executeAsync should work", (done) => {

        const url = "http://tsunami-wps.awi.de/wps";

        const processId = "get_scenario";

        const lat: WpsData = {
            description: {
                id: "lat",
                reference: false,
                type: "literal"
            },
            value: null
        };
        
        const lon: WpsData = {
            description: {
                id: "lon",
                reference: false,
                type: "literal"
            },
            value: null
        };
        
        const mag: WpsData = {
            description: {
                id: "mag",
                reference: false,
                type: "literal"
            },
            value: null
        };

        const inputs = [lat, lon, mag];

        
        const outputDescription: WpsDataDescription = {
            id: "epiCenter",
            reference: false,
            format: "application/WMS",
            type: "literal",
        };


        let c = new WpsClient("1.0.0", httpClient);
        c.executeAsync(url, processId, inputs, outputDescription, 500).subscribe(resultList => {
            console.log(resultList);
            expect(resultList.length).toBeGreaterThan(0);
            done();
        });
    }, 30000);




});