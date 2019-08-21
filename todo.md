
create fake implementation of quakeledger for peru service
    quakeledger peru needs to return alirezas prepared eqs
        get the eqs from the epicenters aliraza sent you
        have the process return them instead of the actual data
        use those eqs as input to ts-service

create fake-implementation of geomer services
    calling wcs in background

re-integrate exposure- and vulnerability-service
    requires uuids, though. 

experiment with data per reference. 
    Can you give a productA from process1 to process2 per reference,
    when you have obtained productA from process1 under a different mime-type than what you present to process2?
        Do that with shakyground and deus

from process get both wms- and shakemap-output
    Usually, we want a wms-output for the frontend
    and a shakemap-output (or similar) for the next downstream-process.
        For shakyground, we need to pipe the shakemap-output into a translation-service to obtain wms-data
        For TS-service, we need to start ts-wms-service to get wms-output; and start ts-shkmp-service to get shakemap data

ts-service
    since the eq is given by EQ-Selection-Service, TS-Userinterface does no longer need any input fields
    can instead be a watching process that sets its own inputs once the selected eq has been chosen




process completed: jump to next
    deactivated for now.
    always jumps to wrong one. Implement "getNextActiveProcessAfter"
        now tries to jump to shakemapProcess_provider. This provider thing is rather unhandy.

fix LayersService
    usually, we add layers with lSvc.addLayer(layer, 'overlays', false)
    this causes the layer to be added 
        to lSvc.overlays
        and to lSvc.layergroups, but *not* as part of the group 'overlays', but as a single layer.
    lSvc.layergroups can therefore contain both layers and layergroups
    since lSvc.layergroups can contain single, ungrouped layers, lSvc uses the property 'filtertype' to figure out if a layer belongs to overlays or not. 
        amongst other places, this feature is used in lSvc.updateLayer(layer, 'overlays')
    however, the property 'filtertye' is optional. 
        by consequence, if you forget to set 'filtertype', updating a layer does not have an effect. 

provider auch in layerpicker

alternative catalogues

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

screenshot funktion in top right

we need a way to also 'execute' non-wps services. 
what would be the most consistent way to do this?
 - pro: with executable non-wps-processes we no longer need watching processes. 
    is this really true?