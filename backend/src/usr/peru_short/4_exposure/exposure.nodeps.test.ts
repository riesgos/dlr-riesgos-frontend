import { sleep } from "../../../utils/async";


test('Peru-short: calling exposure w/o dependencies', async () => {

    const url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?service=WPS&request=Execute&version=1.0.0&identifier=org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess"
    const xmlBody = `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" service="WPS" version="1.0.0"><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess</p0:Identifier><wps:DataInputs><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">model</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">model</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>LimaCVT1_PD30_TI70_5000</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">schema</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">schema</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>SARA_v1.0</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">lonmin</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">lonmin</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>-80.8</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">lonmax</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">lonmax</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>-71.4</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">latmin</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">latmin</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>-20.2</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">latmax</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">latmax</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>-10</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">assettype</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">assettype</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>res</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">querymode</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">querymode</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>intersects</wps:LiteralData></wps:Data></wps:Input></wps:DataInputs><wps:ResponseForm><wps:ResponseDocument storeExecuteResponse="true" status="true"><wps:Output mimeType="application/json" asReference="false"><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">selectedRowsGeoJson</p0:Identifier></wps:Output><wps:Output mimeType="application/json" asReference="true"><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">selectedRowsGeoJson</p0:Identifier></wps:Output></wps:ResponseDocument></wps:ResponseForm></wps:Execute>`

    console.log("Posting ....")
    const request = fetch(url, {
        body: xmlBody,
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        }
    });

    const response = await request;
    const postResponse = await response.text();
    
    expect(postResponse);
    console.log("... got post.")

    let stateUrl = postResponse.match(/statusLocation=\\*"([a-zA-Z0-9:/\-\.?=]*)\\*"/)![1];
    let results: any = undefined;
    while (!results) {

        console.log("Polling ", stateUrl);
        const pollResponse = await fetch(stateUrl, {
            headers: {
                'Accept': 'text/xml, application/xml'
            },
        });
        const pollResponseData = await pollResponse.text();
        stateUrl = pollResponseData.match(/statusLocation=\\*"([a-zA-Z0-9:/\-\.?=]*)\\*"/)![1];
        if (pollResponseData.includes("ComplexData")) results = pollResponseData;
        else await sleep(100);
    }

    expect(results);
    console.log("...done.")

}, 30_000);