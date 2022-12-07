# Ongoing

- re-create slider and re-activate lahar-contours
- Ecuador: Damage lahar+ash is available before damage lahar is when damage-ash is already calculated
- When getting exposure in peru, then going to another scenario and then back again, exposure is marked green, but not displayed

# Next

- Chile exposure after eq: no legend in production
- Chile exposure: no-data-cells are not transparent
- Backend: nightly CI

# Improvements for future

- Eq-catalog: add missing parameters
- Augmenter: only those products need to be resolved where an augmenter applies.
- Make all popups dynamic, so that they change translation dynamically when required.
- Re-create graph-modal
- Restart, save- and reload-buttons
    Store current state *and* relevant data from resolver
- new docs
- Restructure directories:
    - two modules: one for map, one for wizard
        - share store between them: https://stackoverflow.com/questions/40089316/how-to-share-service-between-two-modules-ngmodule-in-angular-not-between-to-c
        - https://www.youtube.com/watch?v=oqZ4-ULwfbc
        - BUT: how do I then use the Augmentor? We'd need one augmentor for each module. 
    - all ngrx files in dir ngrx
- Interesting problem:
    - Ecuador, 1st service: picking VEI.
    - VEI is just a parameter used in a few places further downstream
    - Such an parameter, which had no computation associated with it and only serves as an input downstream, should probably not need its own step in the backend
    - And indeed, in the backend it doesnt.
    - But: The frontend will only display a step when it got one from the backend that it can augment.
    - In the frontend, steps cannot be frontend-only.
        - Suggestion: no longer create steps from backend-data, but hardcode them
            - Pro: More control
            - Pro: Could move all of wizard in own module on the same occasion
            - Con: frontend is supposed to be a dynamic image of backend
        - Suggestion: have augmenterService not only augment steps, but also create them on his own
- Running two processes in parallel sometimes has one end up stuck
    - backend completes both processes
    - but frontend only fetches one 
        - Ohh! It's because request1 gets a new state1 that includes result1 and request2 gets a newState2 that includes result2.
        - Note how newState2 does not yet include result1.
        - Frontend needs to merge together those two new states.
            - Hmm, problem persists...
- Wizard forms: Redesign
    - Global form does not get notified when its child-forms are updated
    - try removing the FromGroup from app-form
- Include jsonix license somewhere
- Remove layerMarshaller, have all map-products simply implement toUkisLayers.
- Docker-compose file for all services and frontend
- Eq-Selection: do we really need to have that selection step in the backend?
    - At least it should be simplified. It's silly that the frontend has the selected eq in it's memory already anyway.
- Backend: move away from WMS'es. Serve data yourself.
- Remove customized layer-control. Maybe ukis is good enough by now.
- Separate pages for each translation instead of dynamic translation
- Unify ng-translation, simplified translation, regex-translation
- Remove allowedCommonJsDependencies
- map.types.ts: do we still need those extensions of UKIS' own layer-types?

# Ongoing problems
- frontend must never have an own version of ol installed ... otherwise, `instanceof`-checks in @eoc-dlr/maps-ol won't work.
- **CommonJS / AMD optimization bailouts**:
    - The following libs need updates:
        - helpers/d3charts -> plotly.js
        - renderers/polygon.renderer.ts -> earcut
        - turf ... update didn't help
        - ol ... cannot update
            - geotiff
            - ol_mapbox_style -> webfont-matcher
            - ol_mapbox_style -> mapbox-to-css-font
            - MVT -> pbf
            - BaseVector -> rbush

