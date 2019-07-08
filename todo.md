as a project completes, your work shifts from dev to ops. 
there are those languages that recognize that big projects require contracts, and those that dont.


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


awi
    eq-ts-interaction: has moved to get_scenario
        returns in response-body: <wps:LiteralData dataType="string">http://tsunami-wps.awi.de:8080/shoa_115_8.00/ows?service=wms&request=GetCapabilities</wps:LiteralData>
        whereas the ground-motion-service has returned:  <wps:ComplexData mimeType="application/WMS"><![CDATA[https://riesgos.52north.org/geoserver/wms?Service=WMS&Request=GetMap&Version=1.1.1&layers=riesgos:shakemap_9824f&width=0&height=0&format=image/png&bbox=&srs=]]></wps:ComplexData>
            The first seems more reasonable to me... with a GetCapabilities we can constuct a WMS-request more easily...




reconfigure: 
    problem with map and tables: mavservices dont remove layers when "reconfigure" clicked


map create field showing current interaction mode



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

