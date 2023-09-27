#%%
import rasterio as rio
import rasterio.features as riof
import rasterio.transform as riot
import rasterio.shutil as rios
from pyproj.transformer import Transformer
from utils.vectorAndRaster import _rasterize_geom
from shapely.geometry import shape, box
import numpy as np

#%%


def makeTransform(imgH, imgW, bbox):
    """
        Requires bbox to be given in EPSG:4326
    """

    # imgH -= 1
    # imgW -= 1

    lonMin = bbox["lonMin"]
    latMin = bbox["latMin"]
    lonMax = bbox["lonMax"]
    latMax = bbox["latMax"]

    scaleX = (lonMax - lonMin) / imgW
    transX = lonMin
    scaleY = -(latMax - latMin) / imgH
    transY = latMax

    # tMatrix = np.array([
    #     [scaleX, 0, transX],
    #     [0, scaleY, transY],
    #     [0, 0, 1]
    # ])
    # lon_tl, lat_tl, _ = tMatrix @ np.array([0, 0, 1])
    # lon_br, lat_br, _ = tMatrix @ np.array([imgW, imgH, 1])
    # assert(lon_tl == lonMin)
    # assert(lat_tl == latMax)
    # assert(lon_br == lonMax)
    # assert(lat_br == latMin)

    transform = riot.Affine(
        a=scaleX,  b=0,  c=transX,
        d=0,   e=scaleY,  f=transY
    )

    return transform


def readTif(targetFilePath):
    fh = rio.open(targetFilePath, "r", driver="GTiff")
    return fh


def saveToTif(targetFilePath: str, data: np.ndarray, crs: str, transform, noDataVal, extraProps=None):

    try:
        l, h, w = data.shape
    except Exception as e:
        data = np.expand_dims(data, 0)
        l, h, w = data.shape
    
    options = {
        'driver': 'GTiff',
        'compress': 'lzw',
        'width': w,
        'height': h,
        'count': l,
        'dtype': data.dtype,
        'crs': crs, 
        'transform': transform,
        'nodata': noDataVal
    }
    with rio.open(targetFilePath, 'w', **options) as dst:
        for i, layerData in enumerate(data):
            dst.write(layerData, i+1)
        if extraProps:
            dst.update_tags(**extraProps)


def saveToCOG(targetFilePath: str, data: np.ndarray, crs: str, transform, noDataVal, mode="copy", extraProps=None):
    # two modes for saving - see https://github.com/rasterio/rasterio/issues/2386
    # copy seems to be safest.

    if mode == "copy":
        tempPath = targetFilePath + "_temp.tiff"
        saveToTif(tempPath, data, crs, transform, noDataVal, extraProps)
        rios.copy(tempPath, targetFilePath, driver="COG")
        rios.delete(tempPath)

    elif mode == "direct":
        h, w = data.shape
        options = {
            'driver': 'COG',
            'compress': 'JPEG',
            'width': w,
            'height': h,
            'count': 1,
            'dtype': data.dtype,
            'crs': crs, 
            'transform': transform,
            'nodata': noDataVal,
            'interleave': 'pixel',
            'tiled': True,
            'blockxsize': 512,
            'blockysize': 512,
        }
        with rio.open(targetFilePath, 'w', **options) as dst:
            dst.write(data, 1)
            dst.build_overviews([2, 4, 8], rio.enums.Resampling.nearest)
            if extraProps:
                dst.update_tags(**extraProps)
    
    else:
        raise Exception(f"Unknown save-mode: '{mode}'. Only know 'copy' and 'direct'.")
    

def tifGetPixelRowsCols(fh):
    h = fh.height
    w = fh.width
    return (h, w)


def tifGetGeoExtent(fh):
    bounds = fh.bounds
    coordTransformer = Transformer.from_crs(fh.crs, "EPSG:4326")
    bounds4326 = coordTransformer.transform_bounds(*bounds)
    return bounds4326


def tifPixelToLonLat(fh, r, c):
    x, y = fh.xy(r, c)
    coordTransformer = Transformer.from_crs(fh.crs, "EPSG:4326")
    lat, lon = coordTransformer.transform(x, y)
    return lon, lat


def tifLonLatToPixel(fh, lon, lat):
    coordTransformer = Transformer.from_crs("EPSG:4326", fh.crs, always_xy=True)
    # transform: (xx, yy), see: https://pyproj4.github.io/pyproj/stable/api/transformer.html
    coordsTifCrs = coordTransformer.transform(lon, lat) 
    pixel = fh.index(coordsTifCrs[0], coordsTifCrs[1])
    return pixel


def tifGetBboxRough(fh, bbox):
    rtl, ctl = tifLonLatToPixel(fh, bbox["lonMin"], bbox["latMax"])
    rtr, ctr = tifLonLatToPixel(fh, bbox["lonMax"], bbox["latMax"])
    rbr, cbr = tifLonLatToPixel(fh, bbox["lonMax"], bbox["latMin"])
    rbl, cbl = tifLonLatToPixel(fh, bbox["lonMin"], bbox["latMin"])

    r0 = min(rtl, rtr, rbr, rbl)
    r1 = max(rtl, rtr, rbr, rbl)
    c0 = min(ctl, ctr, cbr, cbl)
    c1 = max(ctl, ctr, cbr, cbl)
    
    lonMin, latMax = tifPixelToLonLat(r0, c0)
    lonMax, latMin = tifPixelToLonLat(r1, c1) 
    
    outline = shape({
        "type": "Polygon",
        "geometry": [[
            [lonMin, latMax],
            [lonMax, latMax],
            [lonMax, latMin],
            [lonMin, latMin],
            [lonMin, latMax]
        ]]
    })
    
    pixels = tifGetPixels(fh, r0, r1, c0, c1)
    
    return pixels, outline


def tifGetPixels(fh, r0, r1, c0, c1, channels=None):
    # adding one so that end-index is also included
    window = rio.windows.Window.from_slices(( r0,  r1+1 ), ( c0,  c1+1 ))
    subset = fh.read(channels, window=window)
    return subset


def tifGetPixelSizeDegrees(fh):
    # return fh.res <-- always returns in units of own coordinate system, which here would be meters
    (lonMin, latMin, lonMax, latMax) = tifGetGeoExtent(fh)
    (height, width) = tifGetPixelRowsCols(fh)
    sizeW = (lonMax - lonMin) / width
    sizeH = (latMax - latMin) / height
    return sizeH, sizeW


def tifGetPixelOutline(fh, row, col):
    """
        Verified to work in qgis
    """
    lonTl, latTl = tifPixelToLonLat(fh, row + 1, col    )
    lonTr, latTr = tifPixelToLonLat(fh, row + 1, col + 1)
    lonBr, latBr = tifPixelToLonLat(fh, row,     col + 1)
    lonBl, latBl = tifPixelToLonLat(fh, row,     col    )
    w2 = (lonTr - lonTl) / 2
    h2 = (latTr - latBr) / 2
    outline = shape({
        "type": "Polygon",
        "coordinates": [[
            [lonTl - w2, latTl - h2],
            [lonTr - w2, latTr - h2],
            [lonBr - w2, latBr - h2],
            [lonBl - w2, latBl - h2],
            [lonTl - w2, latTl - h2]
        ]]
    })
    return outline



# %%
