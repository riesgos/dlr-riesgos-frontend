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
