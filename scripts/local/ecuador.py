from pythonclient import WpsServer
from owslib.wps import ComplexDataInput



flooddamageService = WpsServer(
    'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    'org.n52.gfz.riesgos.algorithm.impl.FlooddamageProcess',
    [
        ('duration-h', ComplexDataInput('https://www.sd-kama.de/geoserver/rain_cotopaxi/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=rain_cotopaxi:duration_latacunga_city&format=image/geotiff')),
        ('vsmax-ms',   ComplexDataInput('https://www.sd-kama.de/geoserver/rain_cotopaxi/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=rain_cotopaxi:v_at_wdmax_latacunga_city&format=image/geotiff')),
        ('wdmax-cm',   ComplexDataInput('https://www.sd-kama.de/geoserver/rain_cotopaxi/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=rain_cotopaxi:wd_max_latacunga_city&format=image/geotiff'))
    ],
    [
        ('damage_manzanas', False, 'application/json'),
        ('damage_buildings', False, 'application/json')
    ]
)

floodOutputs = flooddamageService.execute()
print(floodOutputs)
