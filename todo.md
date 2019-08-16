
sld

assetmaster

modelprop



provider auch in layerpicker

alternative catalogues

layercontrol does not react to restore

screenshot funktion in top right

rechte spalte: variable größe

layerswitcher: 
    per layer: export and table icons
    show raster/vector icons

bbox: 
    click on bbox field -> ineraction starts
    click on other field -> interaction has not stopped!

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

? sichtbarkeit layer auf basis aktueller auswahl
    make layers transparent once out of focus. 
        listen to "focusChangeEvent"

ich bin mir nicht sicher ob dir schon jemand den Link zu unserem WPS Server geschickt hat, aber wenn nicht dann ist er hier:
http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService
Und das hier ist der versprochene Link zum WCS von Geomer (gerade mit dem GetCapabilities-Aufruf):
https://www.sd-kama.de/geoserver/anim_cotopaxi4/ows?service=wcs&version=1.1&request=GetCapabilities

tabelle und feature in karte müssen in bezug zueinander stehen: highlight feature and row
tabelle: crop to five rows
tabelle: alphabetisch sortierbar
tabelle: unter layer
tabelle: Mouseover "add columns"
        
wps-client:
    bei CORS wird kein Error geworfen <--- scheint gar nicht zu gehen?
    Selbst execAsync sollte einen timeout haben. <-- nah, geht mit tapFunction wenn gewünscht

performance: 
    je mehr features, desto längerer lag bei auswahl eq in groundmotion simulation
    https://blog.ninja-squad.com/2018/09/20/angular-performances-part-3/
    performance problems immediately disappear when i disable the feature-tables. 

