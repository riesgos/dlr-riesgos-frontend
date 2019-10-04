import { TestBed } from '@angular/core/testing';
import { WpsClient } from './wpsclient';
import { HttpClient, HttpXhrBackend, XhrFactory } from '@angular/common/http';
import { WpsData, WpsDataDescription } from '../public-api';
import { pollEveryUntil } from './utils/polling';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { tap, map, delay, expand, takeUntil, take } from 'rxjs/operators';
import { forkJoin, of, Observable, empty, interval, timer } from 'rxjs';
import { Injectable } from '@angular/core';

class MyXhrFactory extends XhrFactory {
    build(): XMLHttpRequest {
        return new XMLHttpRequest();
    }
}

describe(`Testing wps-client version 1 functionality`, () => {

    const httpClient = new HttpClient(new HttpXhrBackend(new MyXhrFactory()));

    it('Wps-client should init correctly', () => {
        const c = new WpsClient('1.0.0', httpClient);
        expect(c).toBeTruthy();
    });


    // it('GetCapabilites should work', (done) => {

    //     const url = 'http://tsunami-wps.awi.de/wps';

    //     const c = new WpsClient('1.0.0', httpClient);

    //     c.getCapabilities(url).subscribe(capabilites => {
    //         console.log('capabilites: ', capabilites)
    //         expect(capabilites.length).toBeGreaterThan(0);
    //         done();
    //     })

    // }, 30000);


    // it('executeAsync should work', (done) => {

    //     const url = 'http://tsunami-wps.awi.de/wps';

    //     const processId = 'get_scenario';

    //     const lat: WpsData = {
    //         description: {
    //             id: 'lat',
    //             reference: false,
    //             type: 'literal'
    //         },
    //         value: -32.6045
    //     };

    //     const lon: WpsData = {
    //         description: {
    //             id: 'lon',
    //             reference: false,
    //             type: 'literal'
    //         },
    //         value: -72.4619
    //     };

    //     const mag: WpsData = {
    //         description: {
    //             id: 'mag',
    //             reference: false,
    //             type: 'literal'
    //         },
    //         value: 6.95
    //     };

    //     const inputs = [lat, lon, mag];


    //     const outputDescription: WpsDataDescription = {
    //         id: 'epiCenter',
    //         reference: false,
    //         format: 'application/WMS',
    //         type: 'literal',
    //     };


    //     const c = new WpsClient('1.0.0', httpClient);

    //     c.executeAsync(url, processId, inputs, outputDescription, 500).subscribe(resultList => {
    //         console.log('output tsunamp:', resultList);
    //         expect(resultList.length).toBeGreaterThan(0);
    //         done();
    //     });

    // }, 30000);



    // it('executeAsync: 2nd test', (done) => {

    //     const url = 'https://riesgos.52north.org/wps/WebProcessingService';

    //     const processId = 'org.n52.wps.python.algorithm.ShakemapProcess';

    //     const selectedEq: WpsData = {
    //         description: {
    //             id: 'quakeml-input',
    //             format: 'application/vnd.geo+json',
    //             reference: false,
    //             type: 'complex',
    //         },
    //         value: `{'type':'Feature','geometry':{'type':'Point','coordinates':[-72.4619,-32.6045]},'properties':{'preferredOriginID':'34053','preferredMagnitudeID':'34053','type':'earthquake','description.text':'stochastic','origin.publicID':'34053','origin.time.value':'0761-01-01T00:00:00.000000Z','origin.time.uncertainty':'nan','origin.depth.value':'21.77998','origin.depth.uncertainty':'nan','origin.creationInfo.value':'GFZ','originUncertainty.horizontalUncertainty':'nan','originUncertainty.minHorizontalUncertainty':'nan','originUncertainty.maxHorizontalUncertainty':'nan','originUncertainty.azimuthMaxHorizontalUncertainty':'nan','magnitude.publicID':'34053','magnitude.mag.value':'6.95','magnitude.mag.uncertainty':'nan','magnitude.type':'MW','magnitude.creationInfo.value':'GFZ','focalMechanism.publicID':'34053','focalMechanism.nodalPlanes.nodalPlane1.strike.value':'8.735077','focalMechanism.nodalPlanes.nodalPlane1.strike.uncertainty':'nan','focalMechanism.nodalPlanes.nodalPlane1.dip.value':'27.27001','focalMechanism.nodalPlanes.nodalPlane1.dip.uncertainty':'nan','focalMechanism.nodalPlanes.nodalPlane1.rake.value':'90.0','focalMechanism.nodalPlanes.nodalPlane1.rake.uncertainty':'nan','focalMechanism.nodalPlanes.preferredPlane':'nodalPlane1'},'id':'34053'}`
    //     }
        
        
    //     const outputDescription: WpsDataDescription = {
    //         id: 'shakemap-output',
    //         type: 'complex',
    //         reference: false,
    //         format: 'application/WMS'
    //     }

    //     let c = new WpsClient('1.0.0', httpClient);

    //     c.executeAsync(url, processId, [selectedEq], outputDescription, 500).subscribe(resultList => {
    //         console.log('output shakemap: ', resultList);
    //         expect(resultList.length).toBeGreaterThan(0);
    //         done();
    //     });

    // }, 30000);

});



class PollableServer {

    private callCount = 0;

    constructor(private maxCallCount: number, private waitResponse: string, private finalResponse: string) {}

    public call(): Observable<string> {
        return of('1').pipe(
            map(_ => {
                console.log(`server queried. current call count: ${this.callCount}`);
                let out;
                if (this.callCount <= this.maxCallCount) {
                    out = this.waitResponse;
                } else {
                    out = this.finalResponse;
                }
                this.callCount += 1;
                return out;
            })
        );
    }
}


fdescribe(`Testing polling funcitonality`, () => {


    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          providers: [HttpClient]
        });
    });

    it('#pollEveryUntil should work fine with multiple poll-requests', (done) => {
        const server = new PollableServer(2, 'ongoing...', 'finished!');

        const baseRequest$ = server.call();

        const polledRequest$ = pollEveryUntil(baseRequest$,
            (response) => response === 'finished!',
            (response) => console.log(`polling server. response: ${response} ...`),
            1000).pipe(
                tap((response) => console.log(`request received ${response}`))
            );

        polledRequest$.subscribe(response => {
            expect(response === 'finished!').toBeTruthy();
            done();
        });


    }, 5000);

    it('#pollEveryUntil should handle multithreading', (done) => {
        // prepare basic requests
        const server1 = new PollableServer(2, 'srv1: ongoing...', 'srv1: finished!');
        const server2 = new PollableServer(1, 'srv2: ongoing...', 'srv2: finished!');
        const firstRequest$ = server1.call();
        const secondRequest$ = server2.call();

        // wrap requests in a poll
        const polledFirstRequest$ = pollEveryUntil(firstRequest$,
            (response) => response === 'srv1: finished!',
            (response) => console.log(`polling server 1. response: ${response} ...`),
            1000).pipe(
                tap((response) => console.log(`first request received ${response}`))
            );
        const polledSecondRequest$ = pollEveryUntil(secondRequest$,
            (response) => response  === 'srv2: finished!',
            (response) => console.log(`polling server 2. response: ${response} ...`),
            1200).pipe(
                tap((response) => console.log(`second request received ${response}`))
            );

        // execute polled requests in parallel
        forkJoin({
            first: polledFirstRequest$,
            second: polledSecondRequest$
        }).subscribe((responses) => {
            expect(responses.first  === 'srv1: finished!').toBeTruthy();
            expect(responses.second  === 'srv2: finished!').toBeTruthy();
            done();
        });

    }, 10000);

    fit('#execAsync should work with multiple requests in parallel', (done) => {
        const mockHttpClient = TestBed.get(HttpClient);
        const wpsClient: WpsClient = new WpsClient('1.0.0', mockHttpClient, false);
        const httpMockServer: HttpTestingController = TestBed.get(HttpTestingController);

        const url1 = 'wpsserver1.com';
        const pId1 = 'p1';
        const inputs1 = [];
        const outputs1 = [];

        const url2 = 'wpsserver2.com';
        const pId2 = 'p2';
        const inputs2 = [];
        const outputs2 = [];

        const poll1$ = wpsClient.executeAsync(url1, pId1, inputs1, outputs1);
        // const poll2$ = wpsClient.executeAsync(url2, pId2, inputs2, outputs2);

        forkJoin({
            p1: poll1$,
            // p2: poll2$
        }).subscribe(r => {
            expect(r.p1).toBeTruthy();
            // expect(r.p2).toBeTruthy();
            done();
        });

        const currentStateUrl1 = `${url1}?retrieveState1`;
        const resultUrl1 = `${url1}?retrieveResult1`;
        const accept1 = `
        <?xml version="1.0" encoding="UTF-8"?>
        <wps:ExecuteResponse
            xmlns:wps="http://www.opengis.net/wps/1.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:ows="http://www.opengis.net/ows/1.1"
            xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsExecute_response.xsd"
            serviceInstance="${url1}?REQUEST=GetCapabilities&amp;SERVICE=WPS"
            xml:lang="en-US"
            service="WPS"
            version="1.0.0"
            statusLocation="${currentStateUrl1}">
        <wps:Process wps:processVersion="1.0.0">
            <ows:Identifier>${pId1}</ows:Identifier>
        </wps:Process>
        <wps:Status creationTime="2019-10-04T13:23:43.830Z">
            <wps:ProcessAccepted>Process Accepted</wps:ProcessAccepted>
        </wps:Status>
        </wps:ExecuteResponse>
        `;
        const wait1 = `
        <?xml version='1.0' encoding='UTF-8'?>
        <wps:ExecuteResponse
            xmlns:wps="http://www.opengis.net/wps/1.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:ows="http://www.opengis.net/ows/1.1"
            xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsExecute_response.xsd"
            serviceInstance="${url1}?REQUEST=GetCapabilities&amp;SERVICE=WPS"
            xml:lang="en-US"
            service="WPS"
            version="1.0.0"
            statusLocation="${currentStateUrl1}">
            <wps:Process wps:processVersion="1.0.0">
                <ows:Identifier>${pId1}</ows:Identifier>
            </wps:Process>
            <wps:Status creationTime="2019-10-04T13:23:43.830Z">
                <wps:ProcessStarted percentCompleted="0"/>
            </wps:Status>
        </wps:ExecuteResponse>
        `;
        const result1 = `
            <?xml version='1.0' encoding='UTF-8'?>
            <wps:ExecuteResponse
                xmlns:wps="http://www.opengis.net/wps/1.0.0"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns:ows="http://www.opengis.net/ows/1.1"
                xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsExecute_response.xsd"
                serviceInstance="${url1}?REQUEST=GetCapabilities&amp;SERVICE=WPS"
                xml:lang="en-US"
                service="WPS"
                version="1.0.0"
                statusLocation="${currentStateUrl1}">
                <wps:Process wps:processVersion="1.0.0">
                    <ows:Identifier>${pId1}</ows:Identifier>
                </wps:Process>
                <wps:Status creationTime="2019-10-04T13:23:43.830Z">
                    <wps:ProcessSucceeded>Process successful</wps:ProcessSucceeded>
                </wps:Status>
                <wps:ProcessOutputs>
                    <wps:Output>
                        <ows:Identifier>shakeMapFile</ows:Identifier>
                        <ows:Title>shakeMapFile</ows:Title>
                        <wps:Reference
                            schema="http://earthquake.usgs.gov/eqcenter/shakemap"
                            encoding="UTF-8" mimeType="text/xml"
                            href="${resultUrl1}"/>
                    </wps:Output>
                </wps:ProcessOutputs>
            </wps:ExecuteResponse>
        `;

        const post1 = httpMockServer.expectOne(url1 + '?service=WPS&request=Execute&version=1.0.0&identifier=' + pId1);
        post1.flush(accept1);
        const get1 = httpMockServer.expectOne(currentStateUrl1);
        get1.flush(wait1);
        const get12 = httpMockServer.expectOne(currentStateUrl1);
        get12.flush(result1);

        const accept2 = ``;
        const resultRefUrl2 = ``;
        const wait2 = ``;
        const result2 = ``;

        const post2 = httpMockServer.expectOne(url2);
        post2.flush(accept2);
        const get2 = httpMockServer.expectOne(resultRefUrl2);
        get2.flush(wait2);
        const get22 = httpMockServer.expectOne(resultRefUrl2);
        get22.flush(wait2);
        const get23 = httpMockServer.expectOne(resultRefUrl2);
        get23.flush(result2);


        httpMockServer.verify();

    }, 10000);
});
