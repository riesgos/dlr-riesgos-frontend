import numpy as np
import rasterio.transform as riot
import rasterio.features as riof
from shapely.geometry import shape, box



def createAffine(bbox, rasterShape):
    """
    | a  b  c |    | scale  rot  transX |
    | d  e  f | =  | rot   scale transY |
    | 0  0  1 |    |  0      0     1    |
    """

    imgH, imgW = rasterShape
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


def rasterizeGeojson(geojson, bbox, imgShape):

    if len(geojson["features"]) == 0:
        return np.zeros(imgShape)

    imgH, imgW = imgShape
    transform = createAffine(bbox, imgShape)
   
    rasterized = riof.rasterize(
        [(f["geometry"], 1) for f in geojson["features"]], 
        (imgH, imgW),
        all_touched=True,
        transform=transform
    )
    return rasterized



# shamelessly copied from https://gist.github.com/perrygeo/721040f8545272832a42#file-rasterize-py 
# thanks a lot @perrygeo!


def _rasterize_geom(geometry, shape, affinetrans, all_touched):
    indata = [(geometry, 1)]
    rv_array = riof.rasterize(
        indata,
        out_shape=shape,
        transform=affinetrans,
        fill=0,
        all_touched=all_touched)
    return rv_array


def _rasterize_pctcover(geom, atrans, shape):
    alltouched = _rasterize_geom(geom, shape, atrans, all_touched=True)
    exterior = _rasterize_geom(geom.exterior, shape, atrans, all_touched=True)

    # Create percent cover grid as the difference between them
    # at this point all cells are known 100% coverage,
    # we'll update this array for exterior points
    pctcover = (alltouched - exterior) * 100

    # loop through indicies of all exterior cells
    for r, c in zip(*np.where(exterior == 1)):

        # Find cell bounds, from rasterio DatasetReader.window_bounds
        window = ((r, r+1), (c, c+1))
        ((row_min, row_max), (col_min, col_max)) = window
        x_min, y_min = (col_min, row_max) * atrans
        x_max, y_max = (col_max, row_min) * atrans
        bounds = (x_min, y_min, x_max, y_max)

        # Construct shapely geometry of cell
        cell = box(*bounds)

        # Intersect with original shape
        cell_overlap = cell.intersection(geom)

        # update pctcover with percentage based on area proportion
        coverage = cell_overlap.area / cell.area
        pctcover[r, c] = int(coverage * 100)

    return pctcover




def _multi_rasterize_geom(geometries, shape, affinetrans, all_touched):
    indata = [(geometry, 1) for geometry in geometries]
    rv_array = riof.rasterize(
        indata,
        out_shape=shape,
        transform=affinetrans,
        fill=0,
        all_touched=all_touched)
    return rv_array

def _multi_rasterize_pctcover(shapes, atrans, shape):
    alltouched = _multi_rasterize_geom(shapes, shape, atrans, all_touched=True)
    exterior = _multi_rasterize_geom([g.exterior for g in shapes], shape, atrans, all_touched=True)

    # Create percent cover grid as the difference between them
    # at this point all cells are known 100% coverage,
    # we'll update this array for exterior points
    pctcover = (alltouched - exterior) * 100

    # loop through indicies of all exterior cells
    for r, c in zip(*np.where(exterior == 1)):

        # Find cell bounds, from rasterio DatasetReader.window_bounds
        window = ((r, r+1), (c, c+1))
        ((row_min, row_max), (col_min, col_max)) = window
        x_min, y_min = (col_min, row_max) * atrans
        x_max, y_max = (col_max, row_min) * atrans
        bounds = (x_min, y_min, x_max, y_max)

        # Construct shapely geometry of cell
        cell = box(*bounds)

        # Intersect with original shape
        cell_overlap_area = 0 
        for geom in shapes:
            cell_overlap_area += cell.intersection(geom).area

        # update pctcover with percentage based on area proportion
        coverage = cell_overlap_area / cell.area
        pctcover[r, c] = int(coverage * 100)

    return pctcover


def rasterizePercentage(geometries, bbox, imageSize):
    atrans = createAffine(bbox, imageSize)
    shapes = [shape(g) for g in geometries]
    pctCover = _multi_rasterize_pctcover(shapes, atrans, imageSize)
    return pctCover