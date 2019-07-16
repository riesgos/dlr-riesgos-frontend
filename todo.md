performance: 
    je mehr features, desto längerer lag bei auswahl eq in groundmotion simulation


with new getLayer*s*, riesgos:shakemap does not get displayed. i believe that no full layer-object is returned. 
    layer is returned, but all tiles are transparent. 
        https://riesgos.52north.org/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=TRUE&LAYERS=riesgos%3Ashakemap_703cf&WIDTH=256&HEIGHT=256&BBOX=-68.90625%2C-33.75%2C-67.5%2C-32.34375&SRS=EPSG%3A4326&STYLES=

the rxjs-wait keeps throwing user out of textfield


popup for rasterdata: 
    often no feature returned, but at least show the collections other properties (timeStamp in this case: http://tsunami-wps.awi.de:8080/shoa_115_8.00/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=TRUE&QUERY_LAYERS=shoa_115_mwh&LAYERS=shoa_115_mwh&WIDTH=256&HEIGHT=256&BBOX=-2445.984905127436%2C-2445.984905127436%2C-1.7957972886506468e-9%2C-1.7957972886506468e-9&SRS=EPSG%3A4326&INFO_FORMAT=application%2Fjson&I=248&J=3&CRS=EPSG%3A3857&STYLES= )


---- Issue: handling multiple scenarios -----------------------------------------------
A user may jump from scenario to scenario. 
We need to adjust the state accordingly: 
    scenario
        proces
        prods
    scenario
        procs
        prods

make layers transparent once out of focus. 
    listen to "focusChangeEvent"

screenshot funktion in top right

restore

tabelle: crop to five rows
tabelle und feature in karte müssen in bezug zueinander stehen: highlight feature and row


rechte spalte: variable größe


translate jsonix to ts







layerswitcher: 
    per layer: export and table icons
    show raster/vector icons

tabelle: alphabetisch sortierbar
tabelle: unter layer
tabelle: Mouseover "add columns"


sld-styling: 
    parse:
    display
    include in riesgos
        let vector-parameters have optional sld-property




ich bin mir nicht sicher ob dir schon jemand den Link zu unserem WPS Server geschickt hat, aber wenn nicht dann ist er hier:
http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService
Und das hier ist der versprochene Link zum WCS von Geomer (gerade mit dem GetCapabilities-Aufruf):
https://www.sd-kama.de/geoserver/anim_cotopaxi4/ows?service=wcs&version=1.1&request=GetCapabilities



processes: auto-continue
    there are a lot of processes that are not part of the ui. 
    these processes should execute as soon as they are available. 
    


add wps
    GFZ
        eq-damage-loss
        will be done during sprint in july


forms
    disallow submit until all fields filled in 
    bbox-field: format field
        catch bad formatting before commiting product to message-queue
        always round of to 2 dec.places
        format in such a way that bbox is displayed in feature-tables
    feature-select-field: 
        very slow
        selected feature stays visible on top, should be on bottom
    i have a featureselect field, but also need a string-select field



Save as file
    using memento pattern?
    restoring happens per request, not per value




map create field showing current interaction mode

