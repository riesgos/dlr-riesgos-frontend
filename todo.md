allow mulitple styles for wms layers
    teste ob das mit den buttons vom layerswitcher geht 
        geht nicht, darum als dropdown in selben feld wie transparency
            user must be able to specify a component, with arguments, to be rendered in dropdown. 
                this seems to be a case of a dynamic compoent... https://angular.io/guide/dynamic-component-loader

geomer einbinden: 
    muss local von https aus aufrufen. 
    https://medium.com/@rubenvermeulen/running-angular-cli-over-https-with-a-trusted-certificate-4a0d5f92747a
    when using chrome: 
        Access to XMLHttpRequest at 'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?version=1.3.0&service=wms&request=GetCapabilities' from origin 'http://localhost:4200' has been blocked by CORS policy: Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response.

integrate deus -- seems to call for a few refactorings ...
    is called multiple times
        need another id for every time deus appears in graph
            need again to make a difference between the workflow-id and the wps-process-id
    hmm. input-product-ids are weird, too....
        habe entwurf für nachfrage-email an nils parat
        on the other hand, might it be alright if deus specifies another product-id?
            after all, the wps-product-id is something wps-specific. only the product.uid counts for us. lets say they both have product.uid = 'shakemap'
            what would that mean?
                well, for one, 
                    shakyground would have as output a product with uid = 'shakemap' and description.id = 'shakeMapFile'
                    deus        would have as input  a product with uid = 'shakemap' and description.id = 'intensity'
                that means that every wps-process needs to keep its own copy of all ingoing and outgoing wps-data.
                    that means a lot of duplication of information
                alternatively,  every wps-process could provide its own function of how to map products to wps-data.
                    that means another method in wps-processes, when initially we intended to use them as data-only objects. 
                we could have wps-processes specify their own execute-function. 
                    this way, we completely scrap the idea of wps-processes as data-only objects. 
                    but at least the wps-process could do its own transformation. 
                    we would want to avoid, however, that any places other than wps.workflowcontrol can call wps-process.execute. 
                        well, that would be avoided automatically, because only wps.workflowcontrol can provide wps-process.execute(inputs, outputs) with the neccessary arguments.
                    with this, we'd still adhere to 'dont-call-me-ill-call-you', right?
    maybe wizard-pages should be not configured by the processes & products. 
    really. just draw up the design diagram again and see if there is any way we can simplify this. 

inputs to processes need to be listed in process-wizard

For TS-service, we need to start ts-wms-service to get wms-output; and start ts-shkmp-service to get shakemap data

        



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

provider auch in layerpicker

alternative catalogues

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

ts-service
    switch order of coords
        shouold cause error
        error should be displayed
    email an alireaza ist unterwegs.

exposure & vulnerability: 
    wie nochmal einbinden?
        exposition (assetmaster): output not used anywhere
        vulnerability (modelprop): return json w/o georeferences.  <-- how to style this? how to show to user?