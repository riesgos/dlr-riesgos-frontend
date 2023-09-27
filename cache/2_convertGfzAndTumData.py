

#%%
import geopandas as gpd
import numpy as np
import os
import shutil as sh
from utils.raster import saveToTif, makeTransform



#%%


def dx_to_int(ds):
    """Transform a D3 to 3."""
    return int(ds[1:])


def compute_weighted_damage(expo_dict):
    buildings = np.array(expo_dict["Buildings"])
    damage_raw = [dx_to_int(x) for x in expo_dict["Damage"]]
    damage = np.array(damage_raw)
    buildings_sum = buildings.sum()
    if buildings_sum != 0:
        weighted_damage = (buildings * damage).sum() / buildings.sum()
    else:
        weighted_damage = 0
    return weighted_damage


def compute_buildings(expo_dict):
    buildings = np.array(expo_dict["Buildings"])
    buildings_sum = buildings.sum()
    return int(buildings_sum)


def shaveSakemap(sourceFileEqSim, targetFilePath):

    f = open(sourceFileEqSim)
    strData = f.read()
    strData = strData[1:-1]
    strData = strData.replace("\\'", "'")

    lines = strData.split("\\n")
    metaData = lines[0].replace("\\", "")
    data = lines[1:-1]

    def find(data, predicate):
        for datum in data:
            if predicate(datum):
                return datum
            
    def extractAttributes(string):
        out = {}
        parts = string.split(" ")
        for part in parts:
            if "=" in part:
                key, val = part.split("=")
                val = val[1:-1]
                out[key] = val
        return out

    metaDataParts = metaData.split("><")
    gridSpecification = find(metaDataParts, lambda line: line.startswith("grid_specification"))
    gridInfo = extractAttributes(gridSpecification)
    eventSpecification = find(metaDataParts, lambda line: line.startswith("event "))
    eventInfo = extractAttributes(eventSpecification)

    rows = int(gridInfo["nlat"])
    cols = int(gridInfo["nlon"])
    bbox = {
        "lonMin": float(gridInfo["lon_min"]),
        "latMin": float(gridInfo["lat_min"]) - float(gridInfo["nominal_lat_spacing"]),
        "lonMax": float(gridInfo["lon_max"]) + float(gridInfo["nominal_lon_spacing"]),
        "latMax": float(gridInfo["lat_max"])
    }

    transform = makeTransform(rows, cols, bbox)
    coordsToIndex = transform.__invert__()
    numpyData = np.zeros((6, rows, cols))

    # verified that orders are lon/lat and cols/rows
    # assert coordsToIndex * [bbox["lonMin"], bbox["latMax"]] == (0.0, 0.0)
    # assert coordsToIndex * [bbox["lonMax"], bbox["latMin"]] == (cols, rows)
    i = 0
    for datum in data:
        lon, lat, PGA, STDPGA, SA03, STDSA03, SA10, STDSA10 = [float(x) for x in datum.split(" ")]
        col, row = coordsToIndex * [lon, lat]
        row = int(row)
        col = int(col)
        if col < 0 or col > cols-1 or row < 0 or row > rows-1:
            i += 1
            print(f"{i}th out of bounds: {row} {col}")
            continue
        numpyData[0, row, col] = PGA
        numpyData[1, row, col] = STDPGA
        numpyData[2, row, col] = SA03
        numpyData[3, row, col] = STDSA03
        numpyData[4, row, col] = SA10
        numpyData[5, row, col] = STDSA10

    saveToTif(targetFilePath, numpyData[0], "EPSG:4326", transform, -9999, eventInfo)

    return



def makeGeoserverData(eqNr):

    # ---------------- PART 1: parameters   ----------------------------------------
    sourcePath          = f"./cache/peru_{eqNr}"
    sourceFileEqSim     = f"{sourcePath}/eqSimXmlRef.json"
    sourceFileEqDmg     = f"{sourcePath}/eqDamageRef.json"
    sourceFileTsDmg     = f"{sourcePath}/tsDamageRef.json"
    sourceFileSysrel    = f"{sourcePath}/sysRel.json"
    targetPath          = f"./data/{eqNr}"
    targetFileEqSim     = f"{targetPath}/{eqNr}_eqSim/eqSim.geotiff"
    targetFileEqDmg     = f"{targetPath}/{eqNr}_eqDmg/eqDmg.shp"
    targetFileTsDmt     = f"{targetPath}/{eqNr}_tsDmg/tsDmg.shp"
    targetFileSysrel    = f"{targetPath}/{eqNr}_sysrel/sysrel.shp"

    for path in [targetFileEqSim, targetFileEqDmg, targetFileTsDmt, targetFileSysrel]:
        targetPath = "/".join(path.split("/")[:-1])
        os.makedirs(targetPath, mode=0o777, exist_ok=True)


    # ---------------- PART 2: save data    ----------------------------------------
    shaveSakemap(sourceFileEqSim, targetFileEqSim)

    dfEqDmg = gpd.read_file(sourceFileEqDmg)
    dfEqDmg["w_damage"] = dfEqDmg["expo"].map(compute_weighted_damage)
    dfEqDmg["buildings"] = dfEqDmg["expo"].map(compute_buildings)
    dfEqDmg["cum_loss"] = dfEqDmg["cum_loss_value"]
    dfEqDmg.to_file(targetFileEqDmg, driver="ESRI Shapefile")

    dfTsDmg = gpd.read_file(sourceFileTsDmg)
    dfTsDmg["w_damage"] = dfTsDmg["expo"].map(compute_weighted_damage)
    dfTsDmg["buildings"] = dfTsDmg["expo"].map(compute_buildings)
    dfTsDmg["cum_loss"] = dfTsDmg["cum_loss_value"]
    dfTsDmg.to_file(targetFileTsDmt, driver="ESRI Shapefile")

    dfSysrel = gpd.read_file(sourceFileSysrel)
    dfSysrel.to_file(targetFileSysrel, driver="ESRI Shapefile")

    return



#%%
eqNrs = [int(x.replace("peru_", "")) for x in os.listdir("./cache")]
for i, eqNr in enumerate(eqNrs):
    print(f"Copying {eqNr}; {i+1} of {len(eqNrs)}")
    makeGeoserverData(eqNr)
# %%
