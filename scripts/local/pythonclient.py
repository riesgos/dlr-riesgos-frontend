from owslib.wps import WebProcessingService, printInputOutput, monitorExecution, ComplexDataInput, BoundingBoxDataInput
from owslib.ows import BoundingBox
from owslib.etree import etree



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
        request = execution.buildRequest(self.id, inputs, outputs)
        reqString = etree.tostring(request)
        print(reqString)
        return execution.processOutputs




catalogueService = WpsServer(
    'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
    [
        ('tlat', '-35.00'),
        ('tlon', '5.00'),
        ('etype', 'expert'),
        ('p', '0.1'),
        ('zmax', '100'),
        ('zmin', '0'),
        ('mmax', '9.0'),
        ('mmin', '6.0'),
        ('input-boundingbox', BoundingBoxDataInput([-73.5, -34, -70.5, -29.0]))
    ],
    [('selectedRows', False, 'application/vnd.geo+json')]
)

catOutputs = catalogueService.execute()
selectedRows = catOutputs[0].data
selectedRow = selectedRows.features[0]

print(f"catalogue returned the data {selectedRow}")





eqsimService = WpsServer(
    'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess',
    [('quakeMLFile'), ComplexDataInput(selectedRow)],
    [('shakeMapFile', True, 'text/xml')],
)

eqOutputs = eqsimService.execute()
shakemapXmlRef = eqOutputs[0].data

print(f"shakyground returned the data {shakemapXmlRef}")





reliabilityService = WpsServer(
    'http://91.250.85.221/wps/WebProcessingService',
    'org.n52.gfz.riesgos.algorithm.impl.SystemReliabilityProcess',
    [
        ('intensity', 
        ComplexDataInput(shakemapXmlRef)),
        ('country', 'chile'),
        ('hazard', 'earthquake')
    ],
    [
        ('damage_consumer_areas', False, 'application/vnd.geo+json')
    ]
)

relOutputs = reliabilityService.execute()

print(f"reliability returned the value {relOutputs[0]}")