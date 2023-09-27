#%%
from geo.Geoserver import Geoserver, GeoserverException
import os
import json
import geopandas as gpd
import zipfile as zp
import shutil as sh

#%%
class MyGeoserver(Geoserver):
    def registerStylesWithLayer(self, layerName, styleNames, workspace, firstStyleDefault=False):

        for styleName in styleNames:
            style = self.get_style(styleName, workspace)
            if style is None:
                raise GeoserverException(f"No such style `{styleName}` in workspace `{workspace}`")
            
        layer = self.get_layer(layerName, workspace)
        if firstStyleDefault:
            layer["layer"]["defaultStyle"] = {
                "name": styleNames[0],
                "href": f"{self.service_url}/rest/workspaces/{workspace}/styles/{styleNames[0]}"
            }
        if not "styles" in layer["layer"]:
            layer["layer"]["styles"] = {
                "@class": "linked-hash-set",
                "style": []
            }
        for styleName in styleNames:
            layer["layer"]["styles"]["style"].append({
                "name": styleName,
                "workspace": workspace,
                "href": f"{self.service_url}/rest/workspaces/{workspace}/styles/{styleName}"
            })

        headers = {"content-type": "text/json"}
        url = "{}/rest/layers/{}:{}".format(self.service_url, workspace, layerName)

        r = self._requests(
            "put",
            url,
            data=json.dumps(layer),
            headers=headers,
        )
        if r.status_code == 200:
            return r.status_code
        else:
            raise GeoserverException(r.status_code, r.content)


#%%

def uploadAwiShapeFile(localPath, eqNr, name, workSpaceName):
    path = f"{localPath}/{eqNr}_{name}/"
    fileName = f"{eqNr}_{name}"
    dictToSubfiles = {
        "dbf": f"{path}/{fileName}.dbf",
        "prj": f"{path}/{fileName}.prj",
        "shp": f"{path}/{fileName}.shp",
        "shx": f"{path}/{fileName}.shx"
    }
    geo.create_shp_datastore(store_name=f"{name}", path=dictToSubfiles, workspace=workSpaceName)


def uploadZipedShapeFile(localPath, eqNr, name, workSpaceName):
    fullPath = f"{localPath}/{name}.shp.zip"
    targetPath = f"{localPath}/{name}"
    z = zp.ZipFile(fullPath)
    z.extractall(targetPath)
    extractedFileNames = os.listdir(targetPath)
    for extractedName in extractedFileNames:
        fullPath = f"{targetPath}/{extractedName}"
        extension = fullPath.split(".")[-1]
        renamedFullPath = f"{targetPath}/{name}.{extension}"
        sh.move(fullPath, renamedFullPath)
    dictToSubfiles = {
        "dbf": f"{targetPath}/{name}.dbf",
        "prj": f"{targetPath}/{name}.prj",
        "shp": f"{targetPath}/{name}.shp",
        "shx": f"{targetPath}/{name}.shx"
    }
    geo.create_shp_datastore(store_name=f"{name}", path=dictToSubfiles, workspace=workSpaceName)


def uploadEqData(eqNr):

    if eqNr == 80000011:
        return

    #-------------------------------------------------------------------
    #   WORKSPACE
    #-------------------------------------------------------------------

    print(f"Creating workspace for {eqNr}")
    workSpaceName=f"peru_{eqNr}"
    geo.create_workspace(workspace=workSpaceName)

    #-------------------------------------------------------------------
    #   RAW DATA
    #-------------------------------------------------------------------

    print(f"Uploading data for {eqNr}")
    localPathData = f"./quakeml:quakeledger/peru_{eqNr}/"
    localPathAwiData = f"./awiData/{eqNr}/"

    # eqSim
    eqSimPath = f"{localPathData}/eqSimGeotiffRef.geotiff"
    geo.create_coveragestore(layer_name="pga", path=eqSimPath, workspace=workSpaceName)
    # eqDmg
    uploadZipedShapeFile(localPathData, eqNr, "eqDamageShapefile", workSpaceName)
    # tsDmg
    uploadZipedShapeFile(localPathData, eqNr, "tsDamageShapefile", workSpaceName)
    # sysrel
    df = gpd.read_file(f"{localPathData}/sysRel.json")
    df.to_file(f"{localPathData}/sysRel.shp.zip", driver="ESRI Shapefile")
    geo.create_shp_datastore(store_name=f"sysRel", path=f"{localPathData}/sysRel.shp.zip", workspace=workSpaceName, file_extension="shp")
    # arrivalTimes
    uploadAwiShapeFile(localPathAwiData, eqNr, "arrivalTimes", workSpaceName)
    # epiCenter         
    uploadAwiShapeFile(localPathAwiData, eqNr, "epiCenter", workSpaceName)
    # mwh
    path = f"{localPathAwiData}/{eqNr}_mwh/{eqNr}_mwh.geotiff"
    geo.create_coveragestore(layer_name="mwh", path=path, workspace=workSpaceName)
    # mwhLand_global
    path = f"{localPathAwiData}/{eqNr}_mwhLand_global/{eqNr}_mwhLand_global.geotiff"
    geo.create_coveragestore(layer_name="mwhLand_global", path=path, workspace=workSpaceName)
    # mwhLand_local
    path = f"{localPathAwiData}/{eqNr}_mwhLand_local/{eqNr}_mwhLand_local.geotiff"
    geo.create_coveragestore(layer_name="mwhLand_local", path=path, workspace=workSpaceName)

    #-------------------------------------------------------------------
    #   STYLES
    #-------------------------------------------------------------------

    geo.reset()
    geo.reload()

    print(f"Uploading styles for {eqNr}")

    # eqSim
    geo.upload_style(path=f"./styles/gfz-prod/shakemap-pga.sld", name="shakemap-pga", workspace=workSpaceName, sld_version="1.0.0")
    geo.registerStylesWithLayer("pga", ["shakemap-pga"], workSpaceName, firstStyleDefault=True)

    # eqDmg
    geo.upload_style(path=f"./styles/gfz-prod/style-damagestate-sara-plasma.sld", name="style-damagestate-sara-plasma", workspace=workSpaceName, sld_version="1.0.0")
    geo.upload_style(path=f"./styles/gfz-prod/style-cum-loss-peru-plasma.sld", name="style-cum-loss-peru-plasma", workspace=workSpaceName, sld_version="1.0.0")
    geo.registerStylesWithLayer("eqDamageShapefile", ["style-damagestate-sara-plasma", "style-cum-loss-peru-plasma"], workSpaceName, firstStyleDefault=True)

    # tsDmg
    geo.upload_style(path=f"./styles/gfz-prod/style-damagestate-medina-plasma.sld", name="style-damagestate-medina-plasma", workspace=workSpaceName, sld_version="1.0.0")
    geo.upload_style(path=f"./styles/gfz-prod/style-damagestate-suppasri-plasma.sld", name="style-damagestate-suppasri-plasma", workspace=workSpaceName, sld_version="1.0.0")
    geo.registerStylesWithLayer("tsDamageShapefile", [ "style-damagestate-medina-plasma", "style-damagestate-suppasri-plasma", "style-cum-loss-peru-plasma"], workSpaceName, firstStyleDefault=True)

    # sysrel

    # arrivalTime
    geo.upload_style(path=f"./styles/awi/Arrivaltime.sld", name="arrivalTimes", workspace=workSpaceName, sld_version="1.0.0")
    geo.registerStylesWithLayer("arrivalTimes", ["arrivalTimes"], workSpaceName, True)

    # epiCenter
    geo.upload_style(path=f"./styles/awi/epiCenter.sld", name="epiCenter", workspace=workSpaceName, sld_version="1.0.0")
    geo.registerStylesWithLayer("epiCenter", ["epiCenter"], workSpaceName, True)

    # mwh
    geo.upload_style(path=f"./styles/awi/waveHeight_old.sld", name="mwh", workspace=workSpaceName, sld_version="1.0.0")
    geo.registerStylesWithLayer("mwh", ["mwh"], workSpaceName, True)

    # mwhLand_global
    geo.registerStylesWithLayer("mwhLand_global", ["mwh"], workSpaceName, True)

    # mwhLand_local
    geo.registerStylesWithLayer("mwhLand_local", ["mwh"], workSpaceName, True)



#%%
geo = MyGeoserver("http://localhost:8080/geoserver", username="admin", password="geoserver")
geo.reset()
geo.reload()



eqNrs = [int(x.replace("peru_", "")) for x in os.listdir("./quakeml:quakeledger")]
eqNrs.sort()


#%%
for i, eqNr in enumerate(eqNrs):
    print(f"Working on eq {eqNr}, nr {i+1} of {len(eqNrs)}")
    uploadEqData(eqNr)




# %%
