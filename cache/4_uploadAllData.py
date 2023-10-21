#%%
from geo.Geoserver import Geoserver, GeoserverException
import os
import json
import geopandas as gpd
import rasterio as rio
import zipfile as zp
import shutil as sh
from utils.raster import saveToTif

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
            if type(layer["layer"]["styles"]["style"]) == dict:
                layer["layer"]["styles"]["style"] = [layer["layer"]["styles"]["style"]]
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



def uploadAwiShapeFile(sourcePath, name, workSpaceName):
    """ Accounting for AWI's naming conventions insize shapefile """

    lastDirName = sourcePath.split("/")[-2]
    dictToSubfiles = {
        "dbf": f"{sourcePath}/{lastDirName}.dbf",
        "prj": f"{sourcePath}/{lastDirName}.prj",
        "shp": f"{sourcePath}/{lastDirName}.shp",
        "shx": f"{sourcePath}/{lastDirName}.shx"
    }
    geo.create_shp_datastore(store_name=name, path=dictToSubfiles, workspace=workSpaceName)


def uploadGfzShapeFile(sourcePath, name, workSpaceName):
    """ Takes zipped shapefile from GFZ, renames contents so that geoserver doesn't get confused, uploads that. """

    sourcePathRoot = "/".join(sourcePath.split("/")[:-1])
    targetPath = f"{sourcePathRoot}/{name}_extracted"
    z = zp.ZipFile(sourcePath)
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
    geo.create_shp_datastore(store_name=name, path=dictToSubfiles, workspace=workSpaceName)


def uploadEqSimFile(sourcePath, name, workSpaceName):
    """ Seems that only band 1 may be contained in file for styles to work correctly """

    sourcePathRoot = "/".join(sourcePath.split("/")[:-1])
    eqSimBand1Path = f"{sourcePathRoot}/eqSimGeotiffBand1.geotiff"
    fh = rio.open(sourcePath)
    band1 = fh.read(1)
    saveToTif(eqSimBand1Path, band1, fh.crs, fh.transform, None)
    geo.create_coveragestore(layer_name=name, path=eqSimBand1Path, workspace=workSpaceName)


def uploadSysrelData(sourcePath, name, workSpaceName):
    """ geoserver can't handle geojson, turn to shapefile instead """

    sourcePathRoot = "/".join(sourcePath.split("/")[:-1])
    targetPath = f"{sourcePathRoot}/{name}.shp.zip"
    targetTargetPath = f"{sourcePathRoot}/{name}_extracted"
    df = gpd.read_file(sourcePath)
    df.to_file(targetPath, driver="ESRI Shapefile")
    z = zp.ZipFile(targetPath)
    z.extractall(targetTargetPath)
    extractedFileNames = os.listdir(targetTargetPath)
    for extractedName in extractedFileNames:
        fullPath = f"{targetTargetPath}/{extractedName}"
        extension = fullPath.split(".")[-1]
        renamedFullPath = f"{targetTargetPath}/{name}.{extension}"
        sh.move(fullPath, renamedFullPath)
    dictToSubfiles = {
        "dbf": f"{targetTargetPath}/{name}.dbf",
        "prj": f"{targetTargetPath}/{name}.prj",
        "shp": f"{targetTargetPath}/{name}.shp",
        "shx": f"{targetTargetPath}/{name}.shx"
    }
    geo.create_shp_datastore(store_name=name, path=dictToSubfiles, workspace=workSpaceName)


def uploadExposureData(sourcePath, name, workSpaceName):
    """ geoserver can't handle geojson, turn to shapefile instead """
    sourcePathRoot = "/".join(sourcePath.split("/")[:-1])
    targetPath = f"{sourcePathRoot}/{name}.shp.zip"
    targetTargetPath = f"{sourcePathRoot}/{name}_extracted"
    df = gpd.read_file(sourcePath)
    df["buildings"] = df["expo"].map(lambda o: sum(o["Buildings"]))
    df.to_file(targetPath, driver="ESRI Shapefile")
    z = zp.ZipFile(targetPath)
    z.extractall(targetTargetPath)
    extractedFileNames = os.listdir(targetTargetPath)
    for extractedName in extractedFileNames:
        fullPath = f"{targetTargetPath}/{extractedName}"
        extension = fullPath.split(".")[-1]
        renamedFullPath = f"{targetTargetPath}/{name}.{extension}"
        sh.move(fullPath, renamedFullPath)
    dictToSubfiles = {
        "dbf": f"{targetTargetPath}/{name}.dbf",
        "prj": f"{targetTargetPath}/{name}.prj",
        "shp": f"{targetTargetPath}/{name}.shp",
        "shx": f"{targetTargetPath}/{name}.shx"
    }
    geo.create_shp_datastore(store_name=name, path=dictToSubfiles, workspace=workSpaceName)


def uploadAwiTiff(sourcePath, name, workSpaceName):
    geo.create_coveragestore(layer_name=name, path=sourcePath, workspace=workSpaceName)


def uploadAll():


    #-------------------------------------------------------------------
    #   WORKSPACE
    #-------------------------------------------------------------------    

    print("Creating workspace")
    workSpaceName="riesgos"
    try:
        geo.create_workspace(workspace=workSpaceName)
    except Exception as e:
        print(e)


    #-------------------------------------------------------------------
    #   RAW DATA
    #-------------------------------------------------------------------

    gfzDataPath = "./quakeml:quakeledger/"
    awiDataPath = "./awiData"


    for i, dirName in enumerate(os.listdir(gfzDataPath)):
        #if "peru_" not in dirName: continue

        eqNr = int(dirName.replace("peru_", ""))
        if eqNr == 80000011: continue
        print(f"Uploading data for eq {eqNr}")


        uploadEqSimFile    ( f"{gfzDataPath}/{dirName}/eqSimGeotiffRefChile.geotiff",   f"pga_{eqNr}",          workSpaceName )
        uploadGfzShapeFile ( f"{gfzDataPath}/{dirName}/eqDamageShapefileChile.shp.zip", f"eqDamage_{eqNr}",     workSpaceName )
        uploadGfzShapeFile ( f"{gfzDataPath}/{dirName}/tsDamageShapefileChile.shp.zip", f"tsDamage_{eqNr}",     workSpaceName )
        uploadSysrelData   ( f"{gfzDataPath}/{dirName}/sysRelChile.json",               f"sysrel_{eqNr}",       workSpaceName )

        uploadAwiShapeFile ( f"{awiDataPath}/{eqNr}/{eqNr}_arrivalTimes/",         f"arrivalTimes_{eqNr}", workSpaceName )      
        uploadAwiShapeFile ( f"{awiDataPath}/{eqNr}/{eqNr}_epiCenter/",            f"epiCenter_{eqNr}",    workSpaceName )

        uploadAwiTiff ( f"{awiDataPath}/{eqNr}/{eqNr}_mwh/{eqNr}_mwh.geotiff",                       f"mwh_{eqNr}",            workSpaceName )
        uploadAwiTiff ( f"{awiDataPath}/{eqNr}/{eqNr}_mwhLand_global/{eqNr}_mwhLand_global.geotiff", f"mwhLand_global_{eqNr}", workSpaceName )
        uploadAwiTiff ( f"{awiDataPath}/{eqNr}/{eqNr}_mwhLand_local/{eqNr}_mwhLand_local.geotiff",   f"mwhLand_local_{eqNr}",  workSpaceName )


    #-------------------------------------------------------------------
    #   STYLES
    #-------------------------------------------------------------------
    print("Uploading styles")

    geo.upload_style( path=f"./styles/gfz-prod/shakemap-pga.sld",                      name="shakemap-pga",                       workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/gfz-prod/style-damagestate-sara-plasma.sld",     name="style-damagestate-sara-plasma",      workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/gfz-prod/style-cum-loss-peru-plasma.sld",        name="style-cum-loss-peru-plasma",         workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/gfz-prod/style-damagestate-medina-plasma.sld",   name="style-damagestate-medina-plasma",    workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/gfz-prod/style-damagestate-suppasri-plasma.sld", name="style-damagestate-suppasri-plasma",  workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/awi/Arrivaltime.sld",                            name="arrivalTimes",                       workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/awi/epiCenter.sld",                              name="epiCenter",                          workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/awi/waveHeight_old.sld",                         name="mwh",                                workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/other/sysrel.sld",                               name="sysrel",                             workspace=workSpaceName,  sld_version="1.0.0" )


    for dirName in os.listdir(gfzDataPath):
        #if "peru_" not in dirName: continue
        eqNr = int(dirName.replace("peru_", ""))
        if eqNr == 80000011: continue
        print(f"Registering styles with layer {eqNr}")

        geo.registerStylesWithLayer( f"pga_{eqNr}",               ["shakemap-pga"],                                                                                          workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"eqDamage_{eqNr}",          ["style-damagestate-sara-plasma", "style-cum-loss-peru-plasma"],                                           workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"tsDamage_{eqNr}",          [ "style-damagestate-medina-plasma", "style-damagestate-suppasri-plasma", "style-cum-loss-peru-plasma"],   workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"arrivalTimes_{eqNr}",      ["arrivalTimes"],                                                                                          workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"epiCenter_{eqNr}",         ["epiCenter"],                                                                                             workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"mwh_{eqNr}",               ["mwh"],                                                                                                   workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"mwhLand_global_{eqNr}",    ["mwh"],                                                                                                   workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"mwhLand_local_{eqNr}",     ["mwh"],                                                                                                   workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"sysrel_{eqNr}",            ["sysrel"],                                                                                                workSpaceName, firstStyleDefault=True )


    #-------------------------------------------------------------------
    #   EXPOSURE (special case, only needs to be uploaded once)
    #-------------------------------------------------------------------

    for i, dirName in enumerate(os.listdir(gfzDataPath)):
        #if "peru_" not in dirName: continue

        if i == 0:
            uploadExposureData(f"{gfzDataPath}/{dirName}/exposureChile.json", "exposure", workSpaceName)
            geo.upload_style(path=f"./styles/other/exposure.sld", name="exposure", workspace=workSpaceName, sld_version="1.0.0")
            geo.registerStylesWithLayer( f"exposure", ["exposure"], workSpaceName, firstStyleDefault=True)

        break


    #-------------------------------------------------------------------
    #   DAMAGE SUMMARIES (moving to backend/data)
    #-------------------------------------------------------------------
    print("Metadata to backend locally saved data")
    for i, dirName in enumerate(os.listdir(gfzDataPath)):
        # if "peru_" not in dirName: continue

        eqNr = int(dirName.replace("peru_", ""))
        
        sourcePath = f"{gfzDataPath}/{dirName}/eqDamageSummaryChile.json"
        targetPath = f"../backend/data/data/cached_data/eqDamageSummary_{eqNr}.json"
        sh.copy(sourcePath, targetPath)

        sourcePath = f"{gfzDataPath}/{dirName}/tsDamageSummaryChile.json"
        targetPath = f"../backend/data/data/cached_data/tsDamageSummary_{eqNr}.json"
        sh.copy(sourcePath, targetPath)


#%%
geoserverUrl= "http://localhost:8080/geoserver"
# geoserverUrl = "https://riesgos.dlr.de/cacheServer/geoserver"
geo = MyGeoserver(geoserverUrl, username="admin", password="geoserver")
uploadAll()





# %%
