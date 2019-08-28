can we now forget the property 'sourceProcessId'?

search for any remaining instances of ' as '

have shakyground return both a wms and a refernce to the shakefile.

allow mulitple styles for wms layers

inputs to processes need to be listed in process-wizard

For TS-service, we need to start ts-wms-service to get wms-output; and start ts-shkmp-service to get shakemap data

geomer einbinden: 
    muss local von https aus aufrufen. 
    https://medium.com/@rubenvermeulen/running-angular-cli-over-https-with-a-trusted-certificate-4a0d5f92747a
    when using chrome: 
        Access to XMLHttpRequest at 'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?version=1.3.0&service=wms&request=GetCapabilities' from origin 'http://localhost:4200' has been blocked by CORS policy: Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response.
        



workflowcontrol changes: merge back into library
    state to processes, including state 'running' and 'error'. in wfc process-states were calculated from the surrounding productstates, which id not allow state 'running'
    process-states have attributes (like errormessage)
    processes can have custom execute method
    executeWps can be async
    provide product with watchingProcesses

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

performance: 
    je mehr features, desto längerer lag bei auswahl eq in groundmotion simulation
    https://blog.ninja-squad.com/2018/09/20/angular-performances-part-3/
    performance problems immediately disappear when i disable the feature-tables. 

screenshot funktion in top right

we need a way to also 'execute' non-wps services. 
what would be the most consistent way to do this?
 - pro: with executable non-wps-processes we no longer need watching processes. 
    is this really true?

ts-service
    switch order of coords
        shouold cause error
        error should be displayed
    email an alireaza ist unterwegs. 

exposure & vulnerability: 
    wie nochmal einbinden?
        exposition (assetmaster): output not used anywhere
        vulnerability (modelprop): return json w/o georeferences.  <-- how to style this? how to show to user?