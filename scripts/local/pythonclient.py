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
        request = execution.buildRequest(processId, inputs, outputs)
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


eqsimService = WpsServer(

)

eqOutputs = eqsimService.execute()


reliabilityService = WpsServer(
    'http://91.250.85.221/wps/WebProcessingService',
    'org.n52.gfz.riesgos.algorithm.impl.SystemReliabilityProcess',
    [
        ('intensity', 
        ComplexDataInput('http://rz-vm140.gfz-potsdam.de:80/wps/RetrieveResultServlet?id=b508dc79-6171-4b96-b2a1-f3896aec43f7shakeMapFile.3a944430-eaa2-4c9e-93c6-c8e11415bb08')),
        ('country', 'chile'),
        ('hazard', 'earthquake')
    ],
    [
        ('damage_consumer_areas', False, 'application/vnd.geo+json')
    ]
)

relOutputs = reliabilityService.execute()