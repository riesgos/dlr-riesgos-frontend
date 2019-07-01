bbox-selected: 
    still not displayed on map - even though is mappable!







---- Issue: allow processes to add new products whenever a new product arrives ---------
should this be done in workflowcontrol or in ngrx?




---- Issue: handling multiple scenarios -----------------------------------------------
A user may jump from scenario to scenario. 
We need to adjust the state accordingly: 
    scenario
        proces
        prods
    scenario
        procs
        prods




add wps
    AWI
        innundation-map (aka. MultihazardRiskService)
            input coords should equal those of selected eq
                need a way to provide another product in onProductSet(id: string, product: Product): Product
        hazard-interaction
        TS physical simulation service
    GFZ
        eq-damage-loss
        will be done during sprint in july
    Own
        52north, pyWPS, Geoserver or UPS?





tabelle und feature in karte müssen in bezug zueinander stehen: highlight feature and row
    they all share the layers-service. Können wir den erweitern? Ihm eine 'selected-feature-observable' geben?
    Oder sollten wir das selected-feature aus einem separaten service holen?

layerswitcher: 
    per layer: export and table icons
    show raster/vector icons

screenshot funktion in top right

tabelle: alphabetisch sortierbar

tabelle: unter layer

tabelle: Mouseover "add columns"

popup: als header zeige layername, id kommt in popup tabelle

inundation-map: get lat/lon from selected eq

rename shakemap-outpt to shakemap


Save as file
    using memento pattern?
    restoring happens per request, not per value



chosen AOI must remain visible

Popup: format all numbers to 2 decimal digits



rechte spalte: variable größe
    linke und rechte spalte sind keine navigationselemente. wir sollten sie nicht als solche behandeln. Vielleicht eher cards?
        layercontrol: fixe layout
        passe höhe an bildschirm an
        mache einklappbar
    Hmm. Das ist eher eine verschlimmbesserung. Habe zurückgeschraubt. Ergebnisse zu finden in branch "split-experiment"



Restructure: Unify process and processConfig
    - we want to keep state externalized
        - config-control: don't get from process, but from context
    - wfcontrol: 
        - allow for async execution



There is a difference between datascience programming and app-programming
    datascience
        careful inputdata transformation
        documenting older attempts
    app
        design patterns

