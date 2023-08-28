#%%
import requests as r
import json
import xml.etree.ElementTree as ET

#%% 

def getEqParas():
    fh1 = open("data/expert.geo.json", "r")
    data1 = json.load(fh1)
    fh2 = open("data/observed.geo.json", "r")
    data2 = json.load(fh2)
    return data1["features"] + data2["features"]


def getExposure():
    url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?service=WPS"

    payload = """
<wps:Execute xmlns:wps="http://www.opengis.net/wps/2.0" service="WPS" version="2.0.0" mode="sync"
    response="raw">
    <p0:Identifier xmlns:p0="http://www.opengis.net/ows/2.0">org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess</p0:Identifier>
    <wps:Input id="model">
        <wps:Data>LimaBlocks</wps:Data>
    </wps:Input>
    <wps:Input id="schema">
        <wps:Data>SARA_v1.0</wps:Data>
    </wps:Input>
    <wps:Input id="lonmin">
        <wps:Data>-80.8</wps:Data>
    </wps:Input>
    <wps:Input id="lonmax">
        <wps:Data>-71.4</wps:Data>
    </wps:Input>
    <wps:Input id="latmin">
        <wps:Data>-20.2</wps:Data>
    </wps:Input>
    <wps:Input id="latmax">
        <wps:Data>-10</wps:Data>
    </wps:Input>
    <wps:Input id="assettype">
        <wps:Data>res</wps:Data>
    </wps:Input>
    <wps:Input id="querymode">
        <wps:Data>intersects</wps:Data>
    </wps:Input>
    <wps:Output id="selectedRowsGeoJson" transmission="value" mimeType="application/json" />
</wps:Execute>
    """
    
    headers = {
        'Content-Type': 'application/xml'
    }

    response = r.request("POST", url, headers=headers, data=payload)
    data = response.json()

    return data


def getExposureReference():
    url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?service=WPS"

    payload = """
<wps:Execute xmlns:wps="http://www.opengis.net/wps/2.0" service="WPS" version="2.0.0" mode="sync"
    response="document">
    <p0:Identifier xmlns:p0="http://www.opengis.net/ows/2.0">org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess</p0:Identifier>
    <wps:Input id="model">
        <wps:Data>LimaBlocks</wps:Data>
    </wps:Input>
    <wps:Input id="schema">
        <wps:Data>SARA_v1.0</wps:Data>
    </wps:Input>
    <wps:Input id="lonmin">
        <wps:Data>-80.8</wps:Data>
    </wps:Input>
    <wps:Input id="lonmax">
        <wps:Data>-71.4</wps:Data>
    </wps:Input>
    <wps:Input id="latmin">
        <wps:Data>-20.2</wps:Data>
    </wps:Input>
    <wps:Input id="latmax">
        <wps:Data>-10</wps:Data>
    </wps:Input>
    <wps:Input id="assettype">
        <wps:Data>res</wps:Data>
    </wps:Input>
    <wps:Input id="querymode">
        <wps:Data>intersects</wps:Data>
    </wps:Input>
    <wps:Output id="selectedRowsGeoJson" transmission="reference" mimeType="application/json" />
</wps:Execute>
    """
    
    headers = {
        'Content-Type': 'application/xml'
    }

    response = r.request("POST", url, headers=headers, data=payload)
    responseText = response.text
    tree = ET.fromstring(responseText)

    return tree[1][0].attrib['{http://www.w3.org/1999/xlink}href']


def getEqRef(eqPara: dict):
    url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?service=WPS"

    payload = """
<wps:Execute xmlns:wps="http://www.opengis.net/wps/2.0" service="WPS" version="2.0.0" mode="sync"
    response="document">
    <p0:Identifier xmlns:p0="http://www.opengis.net/ows/2.0">org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess</p0:Identifier>
    <wps:Input id="quakeMLFile">
        <wps:Data mimeType="application/vnd.geo+json">{eqPara}</wps:Data>
    </wps:Input>
    <wps:Input id="gmpe">
        <wps:Data>MontalvaEtAl2016SInter</wps:Data>
    </wps:Input>
    <wps:Input id="vsgrid">
        <wps:Data>USGSSlopeBasedTopographyProxy</wps:Data>
    </wps:Input>
    <wps:Output id="shakeMapFile" transmission="reference" mimeType="text/xml" />
</wps:Execute>
    """.format(eqPara=json.dumps(eqPara))
    
    headers = {
        'Content-Type': 'application/xml'
    }

    response = r.request("POST", url, headers=headers, data=payload)
    responseText = response.text
    tree = ET.fromstring(responseText)

    return tree[1][0].attrib['{http://www.w3.org/1999/xlink}href']


def getFragilityRef():
    url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?service=WPS"

    payload = """
<wps:Execute xmlns:wps="http://www.opengis.net/wps/2.0" service="WPS" version="2.0.0" mode="sync"
    response="document">
    <p0:Identifier xmlns:p0="http://www.opengis.net/ows/2.0">org.n52.gfz.riesgos.algorithm.impl.ModelpropProcess</p0:Identifier>
    <wps:Input id="schema">
        <wps:Data>SARA_v1.0</wps:Data>
    </wps:Input>
    <wps:Input id="assetcategory">
        <wps:Data>buildings</wps:Data>
    </wps:Input>
    <wps:Input id="losscategory">
        <wps:Data>structural</wps:Data>
    </wps:Input>
    <wps:Input id="taxonomies">
        <wps:Data>none</wps:Data>
    </wps:Input>
    <wps:Output id="selectedRows" transmission="reference" mimeType="application/json" />
</wps:Execute>
    """
    
    headers = {
        'Content-Type': 'application/xml'
    }

    response = r.request("POST", url, headers=headers, data=payload)
    responseText = response.text
    tree = ET.fromstring(responseText)

    return tree[1][0].attrib['{http://www.w3.org/1999/xlink}href']


def getEqDamage(exposureRef: str, fragilityRef: str, eqRef: str):
    url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?service=WPS"

    payload = """
<wps:Execute xmlns:wps="http://www.opengis.net/wps/2.0" service="WPS" version="2.0.0" mode="sync"
    response="document">
    <p0:Identifier xmlns:p0="http://www.opengis.net/ows/2.0">org.n52.gfz.riesgos.algorithm.impl.DeusProcess</p0:Identifier>
    <wps:Input id="intensity">
        <wps:Reference p1:href="{eqRef}" xmlns:p1="http://www.w3.org/1999/xlink"
            mimeType="text/xml" encoding="UTF-8" />
    </wps:Input>
    <wps:Input id="exposure">
        <wps:Reference p2:href="{exposureRef}" xmlns:p2="http://www.w3.org/1999/xlink"
            mimeType="application/json" encoding="UTF-8" />
    </wps:Input>
    <wps:Input id="fragility">
        <wps:Reference p3:href="{fragilityRef}" xmlns:p3="http://www.w3.org/1999/xlink"
            mimeType="application/json" encoding="UTF-8" />
    </wps:Input>
    <wps:Input id="schema">
        <wps:Data>SARA_v1.0</wps:Data>
    </wps:Input>
    <wps:Output id="shapefile_summary" transmission="value" mimeType="application/WMS" />
    <wps:Output id="meta_summary" transmission="value" mimeType="application/json" />
    <wps:Output id="merged_output" transmission="reference" mimeType="application/json" />
</wps:Execute>
    """.format(eqRef=eqRef, exposureRef=exposureRef, fragilityRef=fragilityRef)
    
    headers = {
        'Content-Type': 'application/xml'
    }

    response = r.request("POST", url, headers=headers, data=payload)
    data = response.json()

    return data

# %%
exposureData = getExposure()
with open("data/exposure.json", "w") as fh:
    json.dump(exposureData, fh)


exposureRef = getExposureReference()
fragilityRef = getFragilityRef()
eqParas = getEqParas()


for eqPara in eqParas:

    eqRef = getEqRef(eqPara)

    eqDmgData = getEqDamage(exposureRef, fragilityRef, eqRef)

    with open(f"data/eq_dmg_{eqPara['id']}.json", "w") as fh:
        json.dump(eqDmgData, fh)

    eqDmgRef = getEqDamageRef(exposureRef, fragilityRef, eqRef)

    tsRef = getTsRef(eqPara)

    tsDmgData = getTsDamage(eqDmgRef, fragilityRef, tsRef)

    with open(f"data/ts_dmg_{eqPara['id']}.json", "w") as fh:
        json.dump(eqDmgData, fh)

# %%
