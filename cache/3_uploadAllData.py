#%%
from geo.Geoserver import Geoserver, GeoserverException
import os
import json



# https://geoserver-rest.readthedocs.io/en/latest/


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

def uploadShapeFile(localPath, eqNr, name, workSpaceName, addEqNrToName=False):
    path = f"{localPath}/{eqNr}_{name}/"
    fileName = name
    if addEqNrToName:
        fileName = f"{eqNr}_{name}"
    dictToSubfiles = {
        # "cpg": f"{path}/{eq_name}.cpg", <- optional
        "dbf": f"{path}/{fileName}.dbf",
        "prj": f"{path}/{fileName}.prj",
        "shp": f"{path}/{fileName}.shp",
        "shx": f"{path}/{fileName}.shx"
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
    localPath = f"./data/{eqNr}/"
    geo.create_workspace(workspace=workSpaceName)

    #-------------------------------------------------------------------
    #   RAW DATA
    #-------------------------------------------------------------------

    print(f"Uploading data for {eqNr}")

    # eqSim
    eqSimPath = f"{localPath}/{eqNr}_eqSim/eqSim.geotiff"
    geo.create_coveragestore(layer_name="pga", path=eqSimPath, workspace=workSpaceName)
    # Should there be one layer each for pga, sa03, sa10? Nope; gfz server has only one file for all.
    # Difference must be in picking the right styling.

    # eqDmg
    uploadShapeFile(localPath, eqNr, "eqDmg", workSpaceName)
    # tsDmg
    uploadShapeFile(localPath, eqNr, "tsDmg", workSpaceName)
    # sysrel
    uploadShapeFile(localPath, eqNr, "sysrel", workSpaceName)
    # arrivalTimes      
    uploadShapeFile(localPath, eqNr, "arrivalTimes", workSpaceName, addEqNrToName=True)
    # epiCenter         
    uploadShapeFile(localPath, eqNr, "epiCenter", workSpaceName, addEqNrToName=True)
    # mwh
    path = f"{localPath}/{eqNr}_mwh/{eqNr}_mwh.geotiff"
    geo.create_coveragestore(layer_name="mwh", path=path, workspace=workSpaceName)
    # mwhLand_global
    path = f"{localPath}/{eqNr}_mwhLand_global/{eqNr}_mwhLand_global.geotiff"
    geo.create_coveragestore(layer_name="mwhLand_global", path=path, workspace=workSpaceName)
    # mwhLand_local
    path = f"{localPath}/{eqNr}_mwhLand_local/{eqNr}_mwhLand_local.geotiff"
    geo.create_coveragestore(layer_name="mwhLand_local", path=path, workspace=workSpaceName)

    #-------------------------------------------------------------------
    #   STYLES
    #-------------------------------------------------------------------

    geo.reset()
    geo.reload()

    print(f"Uploading styles for {eqNr}")

    # eqSim
    geo.upload_style(path=f"./styles/gfz/shakemap-pga.sld", name="shakemap-pga", workspace=workSpaceName, sld_version="1.0.0")
    geo.registerStylesWithLayer("pga", ["shakemap-pga"], workSpaceName, firstStyleDefault=True)

    # eqDmg
    geo.upload_style(path=f"./styles/gfz/style_damagestate_sara_plasma.sld", name="style-damagestate-sara-plasma", workspace=workSpaceName, sld_version="1.1.0")
    geo.upload_style(path=f"./styles/gfz/style_cum_loss_peru_plasma.sld", name="style-cum-loss-peru-plasma", workspace=workSpaceName, sld_version="1.1.0")
    geo.registerStylesWithLayer("eqDmg", ["style-damagestate-sara-plasma", "style-cum-loss-peru-plasma"], workSpaceName, firstStyleDefault=True)

    # tsDmg
    geo.upload_style(path=f"./styles/gfz/style_damagestate_medina_plasma.sld", name="style-damagestate-medina-plasma", workspace=workSpaceName, sld_version="1.1.0")
    geo.upload_style(path=f"./styles/gfz/style_damagestate_suppasri_plasma.sld", name="style-damagestate-suppasri-plasma", workspace=workSpaceName, sld_version="1.1.0")
    geo.registerStylesWithLayer("tsDmg", [ "style-damagestate-medina-plasma", "style-damagestate-suppasri-plasma", "style-cum-loss-peru-plasma"], workSpaceName, firstStyleDefault=True)

    # sysrel

    # arrivalTime
    geo.upload_style(path=f"./styles/awi/Arrivaltime.sld", name="arrivalTimes", workspace=workSpaceName, sld_version="1.1.0")
    geo.registerStylesWithLayer("arrivalTimes", ["arrivalTimes"], workSpaceName, True)

    # epiCenter
    geo.upload_style(path=f"./styles/awi/epiCenter.sld", name="epiCenter", workspace=workSpaceName, sld_version="1.1.0")
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



eqNrs = [int(x.replace("peru_", "")) for x in os.listdir("./cache")]
eqNrs.sort()


#%%
# workspaces = geo.get_workspaces()
# if type(workspaces["workspaces"]) == list:
#     for workspace in workspaces["workspaces"]["workspace"]:
#         styles = geo.get_styles(workspace["name"])
#         if type(styles["styles"] == list):
#             for style in styles["styles"]["style"]:
#                 geo.delete_style(style_name=style["name"], workspace=workspace["name"])
#         geo.delete_workspace(workspace["name"])


#%%
for i, eqNr in enumerate(eqNrs):
    print(f"Working on eq {eqNr}, nr {i+1} of {len(eqNrs)}")
    uploadEqData(eqNr)


# # %%
# eqNr = eqNrs[0]
# geo.create_classified_featurestyle(
#         style_name = "aaa_testStyleName",
#         column_name = "w_damage",
#         column_distinct_values = [0, 4],
#         workspace = f"peru_{eqNr}",
#         # color_ramp: str = "tab20",
#         # geom_type: str = "polygon",
#         # outline_color: str = "#3579b1",
#     )
# %%
