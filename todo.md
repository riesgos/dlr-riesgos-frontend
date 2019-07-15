
make layers transparent once out of focus. 
    listen to "focusChangeEvent"
    oh, but opacity must be part of state for this to work!
        add layers to state
screenshot funktion in top right
tabelle und feature in karte müssen in bezug zueinander stehen: highlight feature and row
restore



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



rechte spalte: variable größe



---- Issue: handling multiple scenarios -----------------------------------------------
A user may jump from scenario to scenario. 
We need to adjust the state accordingly: 
    scenario
        proces
        prods
    scenario
        procs
        prods




map create field showing current interaction mode

