from owslib.wps import WebProcessingService, printInputOutput, monitorExecution, ComplexDataInput, BoundingBoxDataInput
from owslib.ows import BoundingBox
from owslib.etree import etree
import json


class WpsServer:
    def __init__(self, url, id, inputs, outputs):
        self.url = url
        self.id = id
        self.inputs = inputs
        self.outputs = outputs
        self.server = WebProcessingService(url, verbose=True)

    def execute(self):
        print(f"now executing {self.id} ...")
        execution = self.server.execute(self.id, self.inputs, self.outputs)
        monitorExecution(execution)
        print("printing request ...")
        request = execution.buildRequest(self.id, self.inputs, self.outputs)
        reqString = etree.tostring(request)
        print(reqString)
        return execution.processOutputs

