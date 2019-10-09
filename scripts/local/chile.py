from pythonclient import WpsServer
from owslib.wps import WebProcessingService, printInputOutput, monitorExecution, ComplexDataInput, BoundingBoxDataInput
import json


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
        ('input-boundingbox', BoundingBoxDataInput([-35,-80,   -25,-70]))
    ],
    [('selectedRows', False, 'application/vnd.geo+json')]
)

catOutputs = catalogueService.execute()
selectedRows = json.loads(catOutputs[0].data[0])
selectedRow = selectedRows['features'][0]

print(f"catalogue returned the data {selectedRow}")





eqsimService = WpsServer(
    'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess',
    [('quakeMLFile', ComplexDataInput(str([selectedRow])))],
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