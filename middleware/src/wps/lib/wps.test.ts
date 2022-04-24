import format from 'xml-formatter';
import { config } from '../../config';
import { AxiosClient } from '../../web/httpClient';
import { WpsClient } from './wpsclient';

const http = new AxiosClient();
const filePath = config.cacheDir;
const wpsClient100 = new WpsClient('1.0.0', http);
const wpsClient200 = new WpsClient('2.0.0', http);

test('testing that literals are passed without quotation marks', () => {
  const data: any = {
    "version": "2.0.0",
    "inputs": [
      {
        "uid": "schema",
        "description": {
          "id": "schema",
          "title": "schema",
          "reference": false,
          "type": "literal"
        },
        "value": "SARA_v1.0"
      },
      {
        "description": {
          "id": "fragility",
          "title": "selectedRows",
          "format": "application/json",
          "reference": true,
          "type": "complex"
        },
        "value": "https://rz-vm140.gfz-potsdam.de:443/wps/RetrieveResultServlet?id=543444ca-d1c5-48ed-bb0a-3f9e36ea2a27selectedRows.2115595c-af20-4ed9-a9e4-2914313e1d37",
        "uid": "ModelpropProcess_FragilityPeru"
      },
      {
        "uid": "Shakyground_shakemapPeru",
        "description": {
          "id": "intensity",
          "title": "shakeMapFile",
          "type": "complex",
          "reference": true,
          "format": "text/xml"
        },
        "value": "https://rz-vm140.gfz-potsdam.de:443/wps/RetrieveResultServlet?id=fb2a9f43-7a67-403e-92ba-14dff1511067shakeMapFile.7e753ac8-5d9e-4831-b2f0-b6ba7750e642"
      },
      {
        "uid": "AssetmasterProcess_Exposure_Peru_Ref",
        "description": {
          "id": "exposure",
          "reference": true,
          "title": "",
          "type": "complex",
          "format": "application/json"
        },
        "value": "https://rz-vm140.gfz-potsdam.de:443/wps/RetrieveResultServlet?id=0ecd13fd-4a87-4942-b7b1-42e825fc8313selectedRowsGeoJson.1b2faacf-74ee-4ff4-ac7f-68dbf7b51d46"
      }
    ],
    "outputDescriptions": [
      {
        "id": "shapefile_summary",
        "title": "",
        "reference": false,
        "type": "complex",
        "format": "application/WMS"
      },
      {
        "id": "meta_summary",
        "reference": false,
        "title": "",
        "type": "complex",
        "format": "application/json"
      },
      {
        "id": "merged_output",
        "title": "",
        "reference": true,
        "type": "complex",
        "format": "application/json"
      }
    ],
    "processId": "org.n52.gfz.riesgos.algorithm.impl.DeusProcess",
    "url": "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
  };


  const execBody2 = wpsClient200.wpsMarshaller.marshalExecBody(data.processId, data.inputs, data.outputDescriptions, true);
  const xmlExecBody2: string = wpsClient200.xmlMarshaller.marshalString(execBody2);
  const xmlExecBodyPretty2 = format(xmlExecBody2);
  expect(xmlExecBodyPretty2.includes('SARA_v1.0')).toBeTruthy();
  expect(xmlExecBodyPretty2.includes('"SARA_v1.0"')).toBeFalsy();

  const execBody1 = wpsClient100.wpsMarshaller.marshalExecBody(data.processId, data.inputs, data.outputDescriptions, true);
  const xmlExecBody1: string = wpsClient100.xmlMarshaller.marshalString(execBody1);
  const xmlExecBodyPretty1 = format(xmlExecBody1);
  expect(xmlExecBodyPretty1.includes('SARA_v1.0')).toBeTruthy();
  expect(xmlExecBodyPretty1.includes('"SARA_v1.0"')).toBeFalsy();
});

test('testing that references are  html-encoded', () => {
  const data: any = {
    version: "2.0.0",
    inputs: [
      {
        "uid": "LaharHeightShakemap",
        "description": {
          "id": "height",
          "title": "",
          "format": "text/xml",
          "reference": true,
          "type": "complex"
        },
        "value": "https://riesgos.52north.org/geoserver/ows?service=WPS&version=1.0.0&request=GetExecutionResult&executionId=629ee7e8-1249-4e24-9492-b6fb73253a9b&outputId=shakemap.xml&mimetype=application%2Fxml"
      },
      {
        "uid": "LaharVelocityShakemap",
        "description": {
          "id": "velocity",
          "title": "",
          "format": "text/xml",
          "reference": true,
          "type": "complex"
        },
        "value": "https://riesgos.52north.org/geoserver/ows?service=WPS&version=1.0.0&request=GetExecutionResult&executionId=00265b35-cd26-477e-9cc3-600dc221972e&outputId=shakemap.xml&mimetype=application%2Fxml"
      },
      {
        "uid": "systemreliability_country_ecuador",
        "description": {
          "id": "country",
          "title": "",
          "defaultValue": "ecuador",
          "description": "What country are we working in?",
          "reference": false,
          "type": "literal",
          "format": "text/plain"
        },
        "value": "ecuador"
      },
      {
        "uid": "systemreliability_hazard_lahar",
        "description": {
          "id": "hazard",
          "title": "",
          "defaultValue": "lahar",
          "description": "What hazard are we dealing with?",
          "reference": false,
          "type": "literal",
          "format": "text/plain"
        },
        "value": "lahar"
      }
    ],
    outputDescriptions: [
      {
        "id": "damage_consumer_areas",
        "title": "",
        "icon": "router",
        "format": "application/vnd.geo+json",
        "name": "Productname_system_reliability_vector",
        "reference": false,
        "type": "complex",
      }
    ],
    processId: "org.n52.gfz.riesgos.algorithm.impl.SystemReliabilityMultiProcess",
    url: "https://riesgos.52north.org/javaps/service"
  };


  const execBody2 = wpsClient200.wpsMarshaller.marshalExecBody(data.processId, data.inputs, data.outputDescriptions, true);
  const xmlExecBody2: string = wpsClient200.xmlMarshaller.marshalString(execBody2);
  expect(xmlExecBody2.includes('&amp;')).toBeTruthy();
});


test('making sure that encoding and schema are present', () => {
  const incorrect = `
    <wps:Execute xmlns:wps="http://www.opengis.net/wps/2.0" service="WPS" version="2.0.0" mode="async" response="document">
      <p0:Identifier xmlns:p0="http://www.opengis.net/ows/2.0">org.n52.gfz.riesgos.algorithm.impl.SystemReliabilitySingleProcess</p0:Identifier>
      <wps:Input id="intensity">
          <wps:Reference p1:href="https://rz-vm140.gfz-potsdam.de:443/wps/RetrieveResultServlet?id=64c56a10-a59a-41ab-8b3e-fd9eca202ad1shakeMapFile.1b0d53a0-ccf2-4dda-9b91-ff74ca0c9aa2" xmlns:p1="http://www.w3.org/1999/xlink" mimeType="text/xml"/>
      </wps:Input>
      <wps:Input id="country">
          <wps:Data mimeType="text/plain">chile</wps:Data>
      </wps:Input>
      <wps:Input id="hazard">
          <wps:Data mimeType="text/plain">earthquake</wps:Data>
      </wps:Input>
      <wps:Output id="damage_consumer_areas" transmission="value" mimeType="application/vnd.geo+json" />
    </wps:Execute>
  `;
  const correct = `
    <wps:Execute xmlns:wps="http://www.opengis.net/wps/2.0" service="WPS" version="2.0.0" mode="async" response="document">
      <p0:Identifier xmlns:p0="http://www.opengis.net/ows/2.0">org.n52.gfz.riesgos.algorithm.impl.SystemReliabilitySingleProcess</p0:Identifier>
      <wps:Input id="intensity">
          <wps:Reference p1:href="https://rz-vm140.gfz-potsdam.de:443/wps/RetrieveResultServlet?id=aa622ad8-1c4e-42f3-a870-fdd6b0af0838shakeMapFile.6ee8efc5-bf08-4577-8fa0-77efe9101c7f" xmlns:p1="http://www.w3.org/1999/xlink" mimeType="text/xml" encoding="UTF-8" schema="http://earthquake.usgs.gov/eqcenter/shakemap" />
      </wps:Input>
      <wps:Input id="country">
          <wps:Data mimeType="text/plain">chile</wps:Data>
      </wps:Input>
      <wps:Input id="hazard">
          <wps:Data mimeType="text/plain">earthquake</wps:Data>
      </wps:Input>
      <wps:Output id="damage_consumer_areas" transmission="value" mimeType="application/vnd.geo+json" />
    </wps:Execute>
  `;

  const requestData = {
    "version": "2.0.0",
    "inputs": [
      {
        "uid": "Shakyground_shakemap",
        "description": {
          "id": "intensity",
          "title": "shakeMapFile",
          "type": "complex",
          "reference": true,
          "format": "text/xml",
          "schema": "http://earthquake.usgs.gov/eqcenter/shakemap",
          "encoding": "UTF-8"
        },
        "value": "https://rz-vm140.gfz-potsdam.de:443/wps/RetrieveResultServlet?id=8a70fb1f-3319-4372-b506-341139387229shakeMapFile.6692b1c7-6acf-4d71-93fa-2a1ad7ff4e99"
      },
      {
        "uid": "systemreliability_country_chile",
        "description": {
          "id": "country",
          "title": "country",
          "defaultValue": "chile",
          "description": "What country are we working in?",
          "reference": false,
          "type": "literal",
          "format": "text/plain"
        },
        "value": "chile"
      },
      {
        "uid": "systemreliability_hazard_eq",
        "description": {
          "id": "hazard",
          "title": "hazard",
          "defaultValue": "earthquake",
          "description": "What hazard are we dealing with?",
          "reference": false,
          "type": "literal",
          "format": "text/plain"
        },
        "value": "earthquake"
      }
    ],
    "outputDescriptions": [
      {
        "id": "damage_consumer_areas",
        "title": "damage_consumer_areas",
        "format": "application/vnd.geo+json",
        "name": "Productname_system_reliability_vector",
        "icon": "router",
        "reference": false,
        "type": "complex",
      }
    ],
    "processId": "org.n52.gfz.riesgos.algorithm.impl.SystemReliabilitySingleProcess",
    "url": "https://riesgos.52north.org/javaps/service"
  };


})