

---- Issue: data-return-type for dynforms -----------
wizard-page: 
    onSubmit(data) {
        store.dispatch(new ParametersProvided) ?
    => make sure data is really WpsData, not just its value



---- Issue: allow processes to add new products whenever a new product arrives ---------
should this be done in workflowcontrol or in ngrx?


---- Issue: what to do with focus-state -------------
config-wizard: 
    focusedProcess in store
        => or should it rather be in a separate global state container, lets call it EphemeralGlobalStateService?


---- Issue: consequently split Configuration from Value --------------------------------
split Product into 
   productConfig
   productValue
   Product
     config
     value
     state










things learned about ngrx
    store is just a GlobalStateService with readonly state. 
    changes in state happen through message-system. 


things learned about design
    classes should be used for injected dependencies. 
    model should be separate from these classes. 
    ie: 

        export const processes: Process[];

        export class ProcessWrapper{
            constructor(httpClient: HttpClient) {
                this.model = processes[3]
            }





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

